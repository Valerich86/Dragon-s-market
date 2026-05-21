export async function verifyCaptcha(
  token: string,
  clientIp?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) return { success: true };

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: token,
          ...(clientIp && { remoteip: clientIp }), // Передаём IP, если есть
        }).toString(),
      },
    );

    const data = await response.json();

    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      console.error("Ошибки reCAPTCHA:", errorCodes);
      return {
        success: false,
        error: `Ошибка reCAPTCHA: ${errorCodes.join(", ")}`,
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error("Критическая ошибка проверки reCAPTCHA:", error);
    return {
      success: false,
      error: "Ошибка связи с сервером reCAPTCHA",
    };
  }
}
