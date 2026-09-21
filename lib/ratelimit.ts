// Rate limiting using Upstash Redis
// Gracefully degrades if env vars are not set (no rate limiting enforced)

let ratelimit: { limit: (key: string) => Promise<{ success: boolean }> } | null = null;

async function getRatelimiter() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // No rate limiting if env vars not set
    return null;
  }

  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: false,
  });

  return ratelimit;
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const limiter = await getRatelimiter();
  if (!limiter) return { allowed: true };

  const result = await limiter.limit(ip);
  return { allowed: result.success };
}
