import { z } from "zod";

// 1. تحديث الـ Schema عشان يقبل المتغير الجديد
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_TARGET_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(), // المتغير الجديد بتاع التسليم
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

// 2. ربط المتغير الجديد بـ process.env
export const env: PublicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_TARGET_URL: process.env.NEXT_PUBLIC_API_TARGET_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

// 3. تحديث الدوال عشان الأولوية تكون للمتغير الجديد
// Old: export const getApiBaseUrl = () => env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const getApiBaseUrl = () => 
  env.NEXT_PUBLIC_API_URL || env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Old: export const getApiTargetUrl = () => env.NEXT_PUBLIC_API_TARGET_URL || env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const getApiTargetUrl = () => 
  env.NEXT_PUBLIC_API_TARGET_URL || env.NEXT_PUBLIC_API_BASE_URL || env.NEXT_PUBLIC_API_URL || "http://localhost:8000";