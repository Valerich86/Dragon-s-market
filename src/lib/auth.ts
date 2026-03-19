import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";

// Создание токена (вход)
export async function createSessionToken(userId: string, first_name: string) {
  console.log("creating token")
  return new SignJWT({ userId, first_name })
    .setProtectedHeader({ alg })
    .setExpirationTime("1d")
    .sign(secretKey);
}

// Проверка токена (получение пользователя)
export async function verifySession() {
  try {
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies()
    );
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return { userId: payload.userId as string, first_name: payload.first_name as string };
  } catch {
    return null;
  }
}