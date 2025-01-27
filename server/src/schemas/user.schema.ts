/******************* Imports *********************/
import { z } from "zod";

/** SignUp Schema **/
const signupWithoutOTPSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupWithOTPSchema = signupWithoutOTPSchema.extend({
  otp: z.string().length(6, "Invalid OTP"),
});

/** Login Schema **/
const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export { signupWithoutOTPSchema, signupWithOTPSchema, loginSchema };
