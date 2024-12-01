'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';  // bcrypt 추가
import { getSession } from '@/lib/session';  // 이 줄 추가

const loginSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .refine((email) => email.endsWith('@zod.com'), {
      message: '오직 @zod.com 이메일만 허용됩니다.',
    }),
  username: z
    .string()
    .min(5, '유저명은 5글자 이상이어야 합니다.'),
  password: z
    .string()
    .min(10, '비밀번호는 10글자 이상이어야 합니다.')
    .regex(/\d/, '비밀번호는 최소 1개 이상의 숫자를 포함해야 합니다.')
});

export async function loginAction(formData: FormData) {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password')
    });

    const { email, username, password } = validatedFields;
    
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { email },
          { username }
        ]
      }
    });

    if (!user) {
      return {
        success: false,
        message: '로그인 정보가 올바르지 않습니다.'
      };
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return {
        success: false,
        message: '로그인 정보가 올바르지 않습니다.'
      };
    }

    // 세션에 사용자 정보 저장
    const session = await getSession();
    session.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };
    await session.save();

    return { 
      success: true, 
      message: '로그인에 성공했습니다!',
      user: { email: user.email, username: user.username }
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      };
    }
    
    console.error('Login error:', error);
    return { 
      success: false, 
      message: '로그인 처리 중 오류가 발생했습니다.' 
    };
  }
}