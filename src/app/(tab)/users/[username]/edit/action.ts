"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { typeToFlattenedError } from "zod";

import db from "@/utils/db";
import { profileSchema } from "@/utils/scehma";
import { getSession } from "@/utils/session";
import { checkUserPassword } from "@/utils/validator";

interface FormState {
  isSuccess: boolean;
  error: typeToFlattenedError<
    { email: string; username: string; password: string; newPassword: string; bio: string },
    string
  > | null;
}

export async function editProfile(_: unknown, formData: FormData): Promise<FormState> {
  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    newPassword: formData.get("newPassword"),
    bio: formData.get("bio"),
  };
  const result = await profileSchema.safeParseAsync(data);
  if (!result.success) return { error: result.error.flatten(), isSuccess: false };

  const isValidPassword = await checkUserPassword(result.data.password);
  if (!isValidPassword) {
    return { error: { fieldErrors: { password: ["Please check your password."] }, formErrors: [] }, isSuccess: false };
  }
  const session = await getSession();
  if (result.data && result.data.newPassword) {
    const hashedNewPassword = await bcrypt.hash(result.data?.newPassword, 12);
    const user = await db.user.update({
      where: {
        id: session.id,
      },
      data: {
        email: result.data?.email,
        username: result.data?.username,
        password: hashedNewPassword,
        bio: result.data?.bio,
      },
    });
    return redirect(`/users/${user.username}`);
  }
  const user = await db.user.update({
    where: {
      id: session.id,
    },
    data: {
      email: result.data?.email,
      username: result.data?.username,
      bio: result.data?.bio,
    },
  });
  return redirect(`/users/${user.username}`);
}