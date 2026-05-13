export async function verifyCaptcha(
  token: string,
): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) return true;
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: token,
        }).toString(),
      },
    );
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Ошибка проверки reCAPTCHA:", error);
    return false;
  }
}