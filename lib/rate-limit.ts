import { isDemoMode } from './demo-mode'

interface RateLimitResult {
  success: boolean
  remaining: number
}

export async function rateLimit(
  _request: Request,
  _options: { max?: number; window?: number } = {}
): Promise<RateLimitResult> {
  // In demo mode or if Upstash not configured, always allow
  if (isDemoMode() || !process.env.UPSTASH_REDIS_REST_URL) {
    return { success: true, remaining: 99 }
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
    })

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        _options.max ?? 50,
        `${_options.window ?? 60000}ms` as `${number} ms`
      ),
    })

    const ip = 'anonymous'
    const result = await ratelimit.limit(ip)
    return { success: result.success, remaining: result.remaining }
  } catch {
    return { success: true, remaining: 99 }
  }
}
