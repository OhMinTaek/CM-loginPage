"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { typeToFlattenedError, z } from "zod";

import db from "@/utils/db";
import { isEmailExist, isUsernameExist } from "@/service/userService";
import { getSession } from "@/utils/session";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MIN_LENGTH } from "../../utils/constants";

const createAccountSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Please enter a valid email address.")
      .refine((email) => email.includes("@zod.com"), "Only @zod.com email addresses are allowed."),

    username: z
      .string({
        invalid_type_error: "Username must be a string.",
        required_error: "Username is required.",
      })
      .trim()
      .min(USERNAME_MIN_LENGTH, `Username should be at least ${USERNAME_MIN_LENGTH} characters long.`),

    password: z
      .string({
        required_error: "Password is required.",
      })
      .trim()
      .min(PASSWORD_MIN_LENGTH, `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`)
      .regex(PASSWORD_REGEX, "Password should contain at least one number (0-9)."),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await isUsernameExist(username);
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await isEmailExist(email);
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

interface SuccessState {
  isSuccess: true;
  error: null;
}

interface ErrorState {
  isSuccess: false;
  error: typeToFlattenedError<{ email: string; username: string; password: string }, string>;
}

type FormState = SuccessState | ErrorState;

export async function handleForm(_: unknown, formData: FormData): Promise<FormState> {
  try {
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = await createAccountSchema.parseAsync(data);
    
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/");
    
    // TypeScript를 위한 더미 리턴
    return { isSuccess: true, error: null };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.flatten(),
        isSuccess: false,
      };
    }
    
    // 다른 에러 처리
    return {
      error: {
        formErrors: ["An unexpected error occurred"],
        fieldErrors: {},
      },
      isSuccess: false,
    };
  }
}