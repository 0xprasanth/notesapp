import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "stage", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(3001),
  MONGODB_URI: z
    .string()
    .default("mongodb://localhost:27017/notesapp_platform"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
