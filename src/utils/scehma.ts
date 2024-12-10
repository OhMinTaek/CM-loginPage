import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, USERNAME_MIN_LENGTH } from "./constants";
import { checkEmailAvailability, checkUsernameAvailability } from "./validator";

export const responseSchema = z
  .string({
    required_error: "Response is required.",
  })
  .trim()
  .max(200, "Response should be less then 200 characters long.");

export const keywordSchema = z
  .string({
    required_error: "Search-keyword is required.",
  })
  .trim()
  .max(20, "Search-keyword should be less then 20 characters long.");

export const profileSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required.",
      })
      .trim()
      .email("Please enter a valid email address."),
    username: z
      .string({
        invalid_type_error: "Username must contain only letters.",
        required_error: "Username is required.",
      })
      .trim()
      .min(USERNAME_MIN_LENGTH, "Username must be at least 5 characters long."),
    password: z.string({
      required_error: "Password is required.",
    }),
    newPassword: z
      .string()
      .optional()
      .refine((value) => !value || (value.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(value)), {
        message: "New password must be at least 10 characters long and contain at least one number.",
      }),
    bio: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || value.length <= 200, {
        message: "Bio must be 200 characters or less.",
      }),
  })
  .superRefine(async ({ email }, ctx) => {
    const isEmailAvailable = await checkEmailAvailability(email);
    if (!isEmailAvailable) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already in use.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export type UserInformationType = z.infer<typeof profileSchema>;