const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
