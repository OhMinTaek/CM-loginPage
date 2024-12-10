import { z } from "zod";

export const responseSchema = z
  .string({
    required_error: "Response is required.",
  })
  .trim()
  .max(200, "Response should be less then 200 characters long.");
