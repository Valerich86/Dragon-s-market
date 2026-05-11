interface RateLimitRecord {
  count: number;
  resetTime: number; // timestamp в миллисекундах
}

interface RateLimitStore {
  [ip: string]: RateLimitRecord;
}

const store: RateLimitStore = {};

/**
 * Проверяет лимит запросов для IP‑адреса
 * @param ip — IP‑адрес клиента
 * @param maxRequests — максимальное количество запросов за окно
 * @param windowInMinutes — длительность окна в минутах
 * @returns { allowed: boolean, resetAfter: number }
 *   allowed — разрешено ли делать запрос
 *   resetAfter — сколько секунд осталось до сброса лимита
 */
export function checkMemoryRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowInMinutes: number = 1
): { allowed: boolean; resetAfter: number } {
  const now = Date.now();
  const windowMs = windowInMinutes * 60 * 1000;

  const record = store[ip];

  // Случай 1: IP ещё не был в хранилище
  if (!record) {
    store[ip] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, resetAfter: windowInMinutes * 60 };
  }

  // Случай 2: окно лимита истекло — сбрасываем счётчик
  if (now > record.resetTime) {
    store[ip] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, resetAfter: windowInMinutes * 60 };
  }

  // Случай 3: превышен лимит запросов
  if (record.count >= maxRequests) {
    const resetAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, resetAfter };
  }

  // Случай 4: в пределах лимита — увеличиваем счётчик
  record.count++;
  const remainingTime = Math.ceil((record.resetTime - now) / 1000);
  return { allowed: true, resetAfter: remainingTime };
}

/**
 * Очищает устаревшие записи из хранилища (сборщик мусора)
 */
export function cleanupOldRecords() {
  const now = Date.now();
  Object.keys(store).forEach(ip => {
    if (store[ip].resetTime < now) {
      delete store[ip];
    }
  });
}

// Запускаем сборщик мусора каждые 5 минут
setInterval(cleanupOldRecords, 15 * 60 * 1000);
