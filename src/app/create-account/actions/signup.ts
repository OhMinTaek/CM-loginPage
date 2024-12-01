'use server'

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const signupSchema = z.object({
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

export async function signupAction(formData: FormData) {
  try {
    const validatedFields = signupSchema.parse({
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password')
    });

    const { email, username, password } = validatedFields;

    // 이메일 중복 체크
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return {
        success: false,
        message: '이미 존재하는 이메일 또는 사용자명입니다.'
      };
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        bio: ''  // 기본값 설정
      }
    });

    return {
      success: true,
      message: '계정이 생성되었습니다. 로그인해주세요.',
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
    
    console.error('Signup error:', error);
    return {
      success: false,
      message: '계정 생성 중 오류가 발생했습니다.'
    };
  }
}