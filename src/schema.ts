import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const LoginSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(6, "Password too short"),
});

export const RegisterSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
});

export const ResetSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
});

export const NewPasswordSchema = z.object({
  password: passwordSchema,
});

export const TodoSchema = z.object({
  name: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  endDate: z.string().date().min(1, "End date is required"),
  colorCode: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const ActivitySchema = z.object({
  description: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().date().min(1, "Date is required"),
});
