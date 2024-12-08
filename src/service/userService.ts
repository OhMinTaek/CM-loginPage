"use server";

import db from "@/utils/db";

export const isEmailExist = async (email: string): Promise<boolean> => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(user);
};

export const isUsernameExist = async (username: string): Promise<boolean> => {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return Boolean(user);
};
