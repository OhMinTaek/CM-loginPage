"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

import db from "@/utils/db";
import { isEmailExist } from "@/service/userService";
import { getSession } from "@/utils/session";

const logInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email("Please enter a valid email address.")
    .refine(isEmailExist, "An account with this email does not exist."),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .trim(),
});

interface FormState {
  isSuccess: boolean;
  error: typeToFlattenedError<{ email: string; username: string; password: string }, string> | null;
}

export async function handleForm(_: unknown, formData: FormData): Promise<FormState> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await logInSchema.spa(data);
  if (!result.success) {
    return {
      error: result.error?.flatten(),
      isSuccess: false,
    };
  }

  const user = await db.user.findUnique({
    where: {
      email: result.data.email,
    },
    select: {
      id: true,
      password: true,
    },
  });
  if (!user || !(await bcrypt.compare(result.data.password, user.password))) {
    return {
      error: {
        formErrors: [],
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      },
      isSuccess: false,
    };
  }

  const session = await getSession();
  session.id = user.id;
  await session.save();
  redirect("/");
}