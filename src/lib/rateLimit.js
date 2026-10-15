// Limiteur en mémoire (suffisant pour une instance). En production multi-instances : Upstash/Redis.
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { count: 1, reset: now + windowMs }); return true; }
  b.count++;
  return b.count <= max;
}
export const clientIp = (req) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
