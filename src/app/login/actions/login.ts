'use server';

import { z } from 'zod';

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

async function mockAuthCheck(email: string, password: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return email === "test@zod.com" && password === "password123456";
}

export async function loginAction(formData: FormData) {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password')
    });

    const { email, username, password } = validatedFields;
    
    const isValidLogin = await mockAuthCheck(email, password);
    
    if (!isValidLogin) {
      return {
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      };
    }

    return { 
      success: true, 
      message: '로그인에 성공했습니다!',
      user: { email, username }
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