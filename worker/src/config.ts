import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`متغیر محیطی ${key} تعریف نشده است`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  sharedSecret: required("WORKER_SHARED_SECRET"),
  providerOrder: (process.env.PROVIDER_ORDER ?? "gemini")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    modelStandard: process.env.GEMINI_MODEL_STANDARD ?? "gemini-2.5-flash-image",
    modelPro: process.env.GEMINI_MODEL_PRO ?? "gemini-3-pro-image-preview",
  },

  wrapper: {
    baseUrl: process.env.WRAPPER_BASE_URL ?? "",
    apiKey: process.env.WRAPPER_API_KEY ?? "",
    modelStandard: process.env.WRAPPER_MODEL_STANDARD ?? "nano-banana",
    modelPro: process.env.WRAPPER_MODEL_PRO ?? "nano-banana-pro",
  },
};
