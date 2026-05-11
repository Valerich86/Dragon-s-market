import nodemailer from 'nodemailer';

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
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

    const info = await transporter.sendMail({
      from: `"Драконий Базар" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Код подтверждения для входа на сайт',
      text: `Ваш код подтверждения: ${code}. Он действителен в течение 10 минут.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Подтверждение регистрации</h2>
          <p>Ваш код подтверждения:</p>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${code}
          </div>
          <p style="margin-top: 20px; color: #666;">Код действителен в течение 10 минут.</p>
        </div>
      `,
    });

    console.log('Письмо отправлено:', info.messageId);
    return true;
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return false;
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
