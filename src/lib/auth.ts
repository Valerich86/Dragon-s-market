import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";

// Создание токена (вход)
export async function createSessionToken(
  userId?: number
) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setExpirationTime("1d")
    .sign(secretKey);
}

// Проверка токена (получение пользователя)
export async function verifySession() {
  try {
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const token = cookieStore.get("dragon_bazar_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as number
    };
  } catch {
    return null;
  }
}
