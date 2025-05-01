import { z } from "zod";

export const LoginSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  nationalId: z.string().min(5, "National ID must be at least 5 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.object({
    prefix: z
      .string()
      .min(2, "Country code is required")
      .regex(
        /^\+\d+$/,
        "Country code must start with + and contain only digits"
      ),
    number: z
      .string()
      .min(5, "Phone number must be at least 5 digits")
      .max(15, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain only digits"),
  }),
  dateOfBirth: z.coerce
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .refine((date) => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      return date >= minDate;
    }, "You must be under 120 years old"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().max(500, "Address is too long"),
});

export const DoctorRegisterSchema = z.object({
  Id: z.string().min(5, "ID must be at least 6 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.object({
    prefix: z
      .string()
      .min(2, "Country code is required")
      .regex(
        /^\+\d+$/,
        "Country code must start with + and contain only digits"
      ),
    number: z
      .string()
      .min(5, "Phone number must be at least 5 digits")
      .max(15, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain only digits"),
  }),
  gender: z.enum(["male", "female", "other"]),
});
