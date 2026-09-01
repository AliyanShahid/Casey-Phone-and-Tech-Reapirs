import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const quoteRequestSchema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  deviceBrand: z.string().min(1),
  deviceModel: z.string().min(1),
  repairType: z.string().min(1),
  issueDescription: z.string().min(10)
});
