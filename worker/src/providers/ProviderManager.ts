import type { ImageProvider } from "./Provider.js";
import type { GenerateRequest, GenerateResult } from "../types.js";
import { GeminiProvider } from "./GeminiProvider.js";
import { WrapperProvider } from "./WrapperProvider.js";
import { config } from "../config.js";

const registry: Record<string, ImageProvider> = {
  gemini: new GeminiProvider(),
  wrapper: new WrapperProvider(),
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateWithFallback(
  req: GenerateRequest,
  prompt: string,
): Promise<GenerateResult> {
  const providers = config.providerOrder
    .map((name) => registry[name])
    .filter((p): p is ImageProvider => Boolean(p) && p.isConfigured());

  if (providers.length === 0) {
    throw new Error("هیچ ارائه‌دهنده‌ی پیکربندی‌شده‌ای موجود نیست");
  }

  const errors: string[] = [];

  for (const provider of providers) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await provider.generate(req, prompt);
      } catch (err: any) {
        errors.push(`${provider.name} (تلاش ${attempt}): ${err.message}`);
        if (attempt < 2) await sleep(800 * attempt); // backoff
      }
    }
  }

  throw new Error(`همه‌ی ارائه‌دهنده‌ها شکست خوردند:\n${errors.join("\n")}`);
}
