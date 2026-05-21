import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
const alg = "HS256";

//создание токена сессии
export async function createSessionToken(
  userId: number,
  role: string
) {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg })
    .setExpirationTime("7d") 
    .sign(secretKey);
}

//проверка сессии
export async function verifySession(name:string = "dragon_bazar_session") {
  try {
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const token = cookieStore.get(name)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secretKey);

    return {
      userId: payload.userId as number,
      role: payload.role as string,
    };
  } catch (error) {
    console.error("Admin session verification error:", error);
    return null;
  }
}

// Утилита для проверки прав администратора
export async function requireAdminAccess() {
  const user = await verifySession("dragon_bazar_session_admin");
  if (!user) {
    throw new Error("Authentication required");
  }
  if (user.role !== "admin" && user.role !== "superadmin") {
    throw new Error("Admin access required");
  }
  return user;
}
