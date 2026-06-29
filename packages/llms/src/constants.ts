// Internal constants
export const LLM_MAX_RETRIES = 2
export const DEFAULT_TEMPERATURE = 0.7 // higher randomness helps auto-recovery

// Exponential backoff settings for withRetry.
// - BASE_BACKOFF_MS: initial backoff before any retry
// - BACKOFF_MULTIPLIER: per-attempt multiplier applied on top of base
// - MAX_BACKOFF_MS: ceiling to prevent runaway waits
// - JITTER_FRACTION: random (0, JITTER_FRACTION) of the computed wait is added to prevent thundering herds
export const RETRY_BASE_BACKOFF_MS = 200
export const RETRY_BACKOFF_MULTIPLIER = 2
export const RETRY_MAX_BACKOFF_MS = 5000
export const RETRY_JITTER_FRACTION = 0.25
