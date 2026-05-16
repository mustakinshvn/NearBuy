import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Email is invalid");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const vendorLoginSchema = loginSchema;

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^01[0-9]{9}$/, "Phone must be 11 digits starting with 01"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required"),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^01[0-9]{9}$/, "Phone must be 11 digits starting with 01"),
    street: z.string().trim().min(1, "Street address is required"),
    area: z.string().trim().min(1, "Area is required"),
    city: z.string().trim().min(1, "City is required"),
    postal_code: z.string().trim().min(1, "Postal code is required"),
    payment_method: z.enum(["cash_on_delivery", "credit_card", "bkash"]),
    card_number: z.string().trim().optional(),
    card_expiry: z.string().trim().optional(),
    card_cvv: z.string().trim().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.payment_method !== "credit_card") return;

    if (!v.card_number || v.card_number.replace(/\s/g, "").length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["card_number"],
        message: "Card number is required",
      });
    }

    if (!v.card_expiry || !/^\d{2}\/\d{2}$/.test(v.card_expiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["card_expiry"],
        message: "Expiry date must be MM/YY",
      });
    }

    if (!v.card_cvv || !/^\d{3}$/.test(v.card_cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["card_cvv"],
        message: "CVV must be 3 digits",
      });
    }
  });

const optionalIntString = z
  .union([z.literal(""), z.coerce.number()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : v));

const optionalNumberString = z
  .union([z.literal(""), z.coerce.number()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : v));

export const vendorAddProductSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  model_number: z.string().optional(),
  category_id: optionalIntString,
  subcategory_id: optionalIntString,
  price: z
    .union([z.literal(""), z.coerce.number()])
    .refine((v) => v !== "" && !Number.isNaN(v), "Valid price is required"),
  discount_price: optionalNumberString,
  currency: z.string().optional(),
  stock_quantity: optionalIntString,
  is_available: z.boolean().optional(),
  main_image_url: z.string().optional(),
  image_urls: z.string().optional(),
  weight: optionalNumberString,
  dimensions: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  keywords: z.string().optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().optional(),
        variant_name: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        material: z.string().optional(),
        price: optionalNumberString,
        discount_price: optionalNumberString,
        stock_quantity: optionalIntString,
        is_available: z.boolean().optional(),
        image_url: z.string().optional(),
        weight: optionalNumberString,
        dimensions: z.string().optional(),
      }),
    )
    .optional(),
});
