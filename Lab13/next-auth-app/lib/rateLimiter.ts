const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count: number;
  lockedUntil?: number;
}

const attempts = new Map<string, AttemptRecord>();

export function checkRateLimit(email: string): { blocked: boolean; remaining: number } {
  const record = attempts.get(email) ?? { count: 0 };

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return { blocked: true, remaining: 0 };
  }

  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    attempts.delete(email);
    return { blocked: false, remaining: MAX_ATTEMPTS };
  }

  return { blocked: false, remaining: MAX_ATTEMPTS - record.count };
}

export function recordFailedAttempt(email: string): { blocked: boolean; remaining: number } {
  const record = attempts.get(email) ?? { count: 0 };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS;
    attempts.set(email, record);
    return { blocked: true, remaining: 0 };
  }

  attempts.set(email, record);
  return { blocked: false, remaining: MAX_ATTEMPTS - record.count };
}

export function clearAttempts(email: string): void {
  attempts.delete(email);
}
