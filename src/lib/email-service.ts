import nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  purpose: "auth-code" | "reset-password" | "pay-link",
  value: string,
  orderId?: number
): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // Для порта 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject: string;
    let text: string;
    let html: string;

    // Определяем тип письма по наличию параметров
    if (purpose === "auth-code") {
      // Режим отправки кода подтверждения
      subject = "Код подтверждения для входа на сайт";
      text = `Ваш код подтверждения: ${value}. Он действителен в течение 10 минут.`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Подтверждение регистрации</h2>
          <p>Ваш код подтверждения:</p>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${value}
          </div>
          <p style="margin-top: 20px; color: #666;">Код действителен в течение 10 минут.</p>
        </div>
      `;
    } else if (purpose === "pay-link") {
      // Режим отправки ссылки на оплату
      subject = `Оплата заказа № ${orderId}`;
      text = `Ссылка на оплату заказа № ${orderId}`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Оплата заказа № ${orderId}, сумма: ${value}</h2>
          <p>Пройдите по ссылке и совершите оплату:</p>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            <a href="https://platiqr.ru/?uuid=1000405369" target="_blank"
               style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Оплатить ${value}
            </a>
          </div>
        </div>
      `;
    } else if (purpose === "reset-password") {
      // Режим отправки ссылки для сброса пароля
      subject = "Восстановление пароля для аккаунта";
      text = `Для сброса пароля перейдите по ссылке: ${value}\n\nСсылка действительна в течение 1 часа.`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Восстановление пароля</h2>
          <p>Вы запросили сброс пароля для вашего аккаунта на сайте «Драконий Базар».</p>
          <p>Чтобы установить новый пароль, перейдите по ссылке ниже:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${value}"
               style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Ссылка действительна в течение 1 часа.<br>
            Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">
            Это автоматическое сообщение. Пожалуйста, не отвечайте на него.
          </p>
        </div>
      `;
    } else {
      // Если ни один параметр не передан
      throw new Error("Необходимо передать либо code, либо resetUrl");
    }

    const info = await transporter.sendMail({
      from: `"Драконий Базар" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    console.error("Ошибка отправки письма:", error);
    return false;
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
