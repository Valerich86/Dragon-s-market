import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminAccess } from "@/lib/auth";
import { checkMaliciousQueryAndPathParams } from "@/lib/validation";
import { checkMemoryRateLimit } from "@/lib/memory-rate-limiter";
import { pool } from "@/lib/db";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = request.headers.get("user-agent");

  // 1. ПРОВЕРКА QUERY‑ПАРАМЕТРОВ НА ВРЕДОНОСНЫЙ КОД С ЛОГИРОВАНИЕМ
  const { isMalicious, suspiciousParams } = checkMaliciousQueryAndPathParams(
    searchParams,
    pathname,
  );

  if (isMalicious) {
    // Логируем попытку XSS‑атаки
    try {
      await pool.query(
        `INSERT INTO security_logs (ip_address, action, timestamp, details)
         VALUES ($1, $2, NOW(), $3)`,
        [
          ip,
          "попытка XSS-атаки через query-параметры",
          JSON.stringify({
            endpoint: pathname,
            suspiciousParams,
            userAgent,
          }),
        ],
      );
    } catch (logError) {
      console.error("Ошибка логирования попытки XSS-атаки:", logError);
      // Продолжаем выполнение, даже если логирование не удалось
    }

    return NextResponse.json(
      { error: "Обнаружены подозрительные параметры запроса" },
      { status: 400 },
    );
  }

  // 2. ЗАЩИТА ОТ БРУТФОРСА ДЛЯ API‑ЭНДПОИНТОВ С ФОРМАМИ
  if (pathname.startsWith("/api") && pathname.includes("auth")) {
    const { allowed, resetAfter } = checkMemoryRateLimit(ip, 5, 1);

    if (!allowed) {
      try {
        await pool.query(
          `INSERT INTO security_logs (ip_address, action, timestamp, details)
           VALUES ($1, $2, NOW(), $3)`,
          [
            ip,
            "попытка брутфорса",
            JSON.stringify({
              endpoint: pathname,
              resetAfter,
              userAgent,
            }),
          ],
        );
      } catch (logError) {
        console.error("Ошибка логирования попытки брутфорса:", logError);
      }

      return NextResponse.json(
        {
          error: `Слишком много попыток. Повторите через ${resetAfter} секунд.`,
          resetAfter,
        },
        { status: 429 },
      );
    }
  }

  // 3. ПРОВЕРКА ПРАВ ДОСТУПА ДЛЯ АДМИНИСТРАТИВНЫХ СТРАНИЦ
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      return NextResponse.next();
    }

    try {
      const user = await requireAdminAccess();
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.userId.toString());
      requestHeaders.set("x-user-role", user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_vercel|favicon).*)"],
};
