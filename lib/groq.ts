import Groq, {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  AuthenticationError,
  BadRequestError,
  GroqError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
} from "groq-sdk";
import type { ChatCompletion, ChatCompletionCreateParamsNonStreaming } from "groq-sdk/resources/chat/completions";

/**
 * Centralized Groq model identifier.
 * Update this single constant to migrate all AI endpoints to a new model.
 */
export const GROQ_MODEL = "openai/gpt-oss-120b" as const;

type EndpointCompletionDefaults = Pick<
  ChatCompletionCreateParamsNonStreaming,
  | "model"
  | "temperature"
  | "max_completion_tokens"
  | "reasoning_effort"
  | "include_reasoning"
>;

/**
 * Per-endpoint completion defaults tuned for GPT-OSS 120B.
 * Note: For reasoning models on Groq, `max_completion_tokens` caps BOTH internal
 * reasoning tokens and visible output content combined, so generous limits prevent
 * empty/truncated replies (`finish_reason: "length"`).
 */
export const GROQ_CONFIG: {
  model: typeof GROQ_MODEL;
  chat: EndpointCompletionDefaults;
  workout: EndpointCompletionDefaults;
} = {
  model: GROQ_MODEL,
  chat: {
    model: GROQ_MODEL,
    temperature: 0.7,
    max_completion_tokens: 2048,
    reasoning_effort: "low",
    include_reasoning: false,
  },
  workout: {
    model: GROQ_MODEL,
    temperature: 0.3,
    max_completion_tokens: 4096,
    reasoning_effort: "medium",
    include_reasoning: false,
  },
};

export class GroqConfigError extends Error {
  constructor(message = "GROQ_API_KEY is not configured.") {
    super(message);
    this.name = "GroqConfigError";
  }
}

let cachedClient: Groq | null = null;
let cachedApiKey: string | null = null;

/**
 * Reads and validates GROQ_API_KEY on the server without ever instantiating at import time.
 */
export function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new GroqConfigError(
      "GROQ_API_KEY is not configured. Set GROQ_API_KEY in your server environment."
    );
  }
  return apiKey;
}

/**
 * Returns a lazily initialized Groq client bound to the server-side GROQ_API_KEY.
 */
export function getGroqClient(): Groq {
  if (typeof window !== "undefined") {
    throw new GroqConfigError("Groq client must only be used on the server.");
  }

  const apiKey = getGroqApiKey();
  if (!cachedClient || cachedApiKey !== apiKey) {
    cachedClient = new Groq({ apiKey });
    cachedApiKey = apiKey;
  }
  return cachedClient;
}

/**
 * Extracts clean assistant text from a Groq completion response, stripping any
 * accidental thinking tags if emitted.
 */
export function extractCompletionText(completion: ChatCompletion): {
  text: string | null;
  finishReason: string | null;
} {
  const choice = completion.choices?.[0];
  const finishReason = choice?.finish_reason ?? null;
  const rawContent = choice?.message?.content;

  if (typeof rawContent !== "string") {
    return { text: null, finishReason };
  }

  const cleaned = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  return {
    text: cleaned.length > 0 ? cleaned : null,
    finishReason,
  };
}

export type FormattedGroqError = {
  status: number;
  error: string;
  code: string;
  model: string;
  upstreamStatus?: number;
};

function extractUpstreamErrorFields(err: APIError): {
  message: string;
  code?: string;
} {
  const body = err.error as
    | { error?: { message?: unknown; code?: unknown }; message?: unknown; code?: unknown }
    | undefined;

  const nested = body?.error;
  const rawMsg =
    typeof nested?.message === "string"
      ? nested.message
      : typeof body?.message === "string"
      ? body.message
      : err.message;

  const rawCode =
    typeof nested?.code === "string"
      ? nested.code
      : typeof body?.code === "string"
      ? body.code
      : undefined;

  return {
    message: rawMsg || "Upstream Groq API request failed.",
    code: rawCode,
  };
}

/**
 * Converts Groq SDK / runtime errors into safe, actionable HTTP diagnostic payloads.
 */
export function formatGroqError(
  err: unknown,
  endpointName: string
): FormattedGroqError {
  if (err instanceof GroqConfigError) {
    return {
      status: 500,
      error: err.message,
      code: "missing_api_key",
      model: GROQ_MODEL,
    };
  }

  if (err instanceof APIConnectionTimeoutError) {
    return {
      status: 504,
      error: `${endpointName}: Groq AI request timed out. Please try again.`,
      code: "groq_timeout",
      model: GROQ_MODEL,
    };
  }

  if (err instanceof APIConnectionError) {
    return {
      status: 502,
      error: `${endpointName}: Unable to connect to Groq AI service (${err.message}).`,
      code: "groq_connection_error",
      model: GROQ_MODEL,
    };
  }

  if (err instanceof AuthenticationError) {
    const { code } = extractUpstreamErrorFields(err);
    return {
      status: 502,
      error: `${endpointName}: Groq API authentication failed. Verify GROQ_API_KEY is valid.`,
      code: code ?? "groq_auth_error",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof PermissionDeniedError) {
    const { message, code } = extractUpstreamErrorFields(err);
    return {
      status: 502,
      error: `${endpointName}: Groq API permission denied for model '${GROQ_MODEL}': ${message}`,
      code: code ?? "groq_permission_denied",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof NotFoundError) {
    const { message, code } = extractUpstreamErrorFields(err);
    return {
      status: 502,
      error: `${endpointName}: Groq model '${GROQ_MODEL}' was not found or is unavailable: ${message}`,
      code: code ?? "model_not_found",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof RateLimitError) {
    const { message, code } = extractUpstreamErrorFields(err);
    return {
      status: 429,
      error: `${endpointName}: Groq API rate limit reached. Please wait a moment and try again. (${message})`,
      code: code ?? "rate_limit_exceeded",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof BadRequestError) {
    const { message, code } = extractUpstreamErrorFields(err);
    return {
      status: 502,
      error: `${endpointName}: Groq rejected the completion request for '${GROQ_MODEL}': ${message}`,
      code: code ?? "groq_bad_request",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof APIError) {
    const { message, code } = extractUpstreamErrorFields(err);
    return {
      status: 502,
      error: `${endpointName}: Groq API error (${err.status ?? "unknown"}): ${message}`,
      code: code ?? "groq_api_error",
      model: GROQ_MODEL,
      upstreamStatus: err.status,
    };
  }

  if (err instanceof GroqError) {
    return {
      status: 500,
      error: `${endpointName}: Groq client error: ${err.message}`,
      code: "groq_client_error",
      model: GROQ_MODEL,
    };
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  return {
    status: 500,
    error: `${endpointName}: ${message}`,
    code: "internal_error",
    model: GROQ_MODEL,
  };
}
