import { NextRequest, NextResponse } from "next/server";
import { getSystemStats } from "@/lib/server/bot-data";

export const dynamic = "force-dynamic";

// In-memory sliding-window IP rate limiter
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  // Periodic cleanup if map grows
  if (rateLimitMap.size > 2000) {
    for (const [key, list] of rateLimitMap.entries()) {
      if (list.length === 0 || now - list[list.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Track rate limit
  isRateLimited(ip);

  const stats = await getSystemStats();

  return NextResponse.json(stats, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, max-age=60, stale-while-revalidate=120",
    },
  });
}
