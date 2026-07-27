import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/**
 * Provider-agnostic model registry.
 *
 * Replaces the Lovable AI Gateway with a direct, swappable connection to a
 * real provider. Switch providers with the `AI_PROVIDER` env var (or per-call
 * override) without touching any UI or route code.
 */
export type ProviderId = "anthropic" | "openai";

const DEFAULT_MODEL: Record<ProviderId, string> = {
  anthropic: "claude-3-7-sonnet-latest",
  openai: "gpt-4o",
};

function resolveProvider(): ProviderId {
  const raw = (process.env.AI_PROVIDER ?? "anthropic").toLowerCase();
  return raw === "openai" ? "openai" : "anthropic";
}

/**
 * Whether the active provider has an API key. When false, the chat falls back
 * to a local demo stream so the app is fully usable with zero configuration.
 */
export function isProviderConfigured(): boolean {
  return resolveProvider() === "openai"
    ? Boolean(process.env.OPENAI_API_KEY)
    : Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Returns a configured language model for the active provider.
 * @param modelId optional explicit model id; falls back to `AI_MODEL`, then the
 *                provider default.
 */
export function getModel(modelId?: string): LanguageModel {
  const provider = resolveProvider();
  const id = modelId ?? process.env.AI_MODEL ?? DEFAULT_MODEL[provider];

  if (provider === "openai") {
    const openai = createOpenAI({ apiKey: requireKey("OPENAI_API_KEY") });
    return openai(id);
  }

  const anthropic = createAnthropic({ apiKey: requireKey("ANTHROPIC_API_KEY") });
  return anthropic(id);
}

function requireKey(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in your environment (see .env.example) to enable the chat engine.`,
    );
  }
  return value;
}
