'use server'

import { prisma } from '@/lib/prisma';

export async function updateProfile(userId: string, bio: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { bio }
    });

    return {
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio
      }
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      message: '프로필 업데이트 중 오류가 발생했습니다.'
    };
  }
}