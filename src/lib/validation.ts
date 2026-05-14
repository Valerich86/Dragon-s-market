import { z } from "zod";

const maliciousPatterns: Array<[RegExp, string]> = [
  // XSS‑паттерны
  [/script/i, "обнаружен тег script"],
  [/javascript/i, "обнаружена javascript-схема"],
  [/<\s*script/i, "обнаружено начало тега script с пробелами"],
  [/on\w+\s*=/i, "обнарушен обработчик событий (onload, onclick и т.д.)"],
  [/alert\s*\(/i, "обнарушена функция alert()"],
  [/document\.cookie/i, "попытка доступа к document.cookie"],
  [/eval\s*\(/i, "обнарушена функция eval()"],
  // SQL‑инъекции
  [
    /\b(UNION|SEL\ECT|INTO|FROM|DRO\P|CREAT\E|UPDAT\E|DELET\E)\b/i,
    "потенциальная SQL-инъекция (SQL-ключевые слова)",
  ],
  [/--|\/\*|\*\//, "обнаружены SQL-комментарии"],
  [
    /;|\b(OR|AND)\s+[\d\w]+\s*=\s*[\d\w]+/i,
    "подозрительное логическое выражение в SQL",
  ],
  [/'\s*OR\s*'\w+'\s*=\s*'\w+/, "классическая SQL-инъекция OR '1'='1'"],
  [/\bEXEC(UTE)?\b/i, "попытка выполнения команды EXECUTE"],
  [/xp_cmdshell/i, "попытка использования xp_cmdshell"],
  [/(\%27|')\s*(OR|AND)\s*(\%3D|=)/i, "URL-кодированная SQL-инъекция"],
];

export function checkMaliciousQueryAndPathParams(
  params: URLSearchParams,
  pathname: string,
): {
  isMalicious: boolean;
  suspiciousParams: Array<{
    key: string;
    value: string;
    matchedPattern: string;
    type: "query" | "path"; // тип параметра: query или path
  }>;
} {
  const suspiciousParams: Array<{
    key: string;
    value: string;
    matchedPattern: string;
    type: "query" | "path";
  }> = [];

  // 1. ПРОВЕРКА QUERY‑ПАРАМЕТРОВ
  for (const [key, value] of params) {
    for (const [pattern, description] of maliciousPatterns) {
      if (pattern.test(key + value)) {
        suspiciousParams.push({
          key,
          value,
          matchedPattern: description,
          type: "query",
        });
        break; // Достаточно одного совпадения для параметра
      }
    }
  }

  // 2. ПРОВЕРКА ПАРАМЕТРОВ ИЗ ДИНАМИЧЕСКИХ МАРШРУТОВ В PATHNAME
  // Извлекаем сегменты пути (разделяем по / и фильтруем пустые строки)
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);

  // Проходим по всем сегментам пути
  for (const segment of pathSegments) {
    // Пропускаем статические части (например, 'api', 'products')
    // и проверяем только потенциально динамические (содержащие цифры, спецсимволы и т. п.)
    if (/[^a-zA-Z]/.test(segment)) {
      for (const [pattern, description] of maliciousPatterns) {
        if (pattern.test(segment)) {
          suspiciousParams.push({
            key: "dynamic_path_segment",
            value: segment,
            matchedPattern: description,
            type: "path",
          });
          break; // Достаточно одного совпадения для сегмента
        }
      }
    }
  }
  return {
    isMalicious: suspiciousParams.length > 0,
    suspiciousParams,
  };
}

export function textAreaValidation(
  input: string,
  maxLength: number = 990000,
): { isSafe: boolean; error: string | null } {
  // 1. Проверка длины
  if (input.length > maxLength) {
    return {
      isSafe: false,
      error: `Превышено максимальное количество символов. Лимит: ${maxLength}, введено: ${input.length}`,
    };
  }
  // 2. Проверка на вредоносные паттерны
  for (const [pattern, description] of maliciousPatterns) {
    if (pattern.test(input)) {
      return {
        isSafe: false,
        error: description,
      };
    }
  }
  return {
    isSafe: true,
    error: null,
  };
}

export const PrivacyPolicySchema = z.object({
  text: z
    .string()
    .min(1, "Введите данные")
    .refine((value) => !textAreaValidation(value).isSafe, {
      message: "Есть недопустимые символы",
    }),
  email: z.string().email("Некорректный email"),
  site_url: z.url("Некорректный URL"),
});

export const LoginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
  verificationCode: z.string().optional(),
  captchaToken: z.string().min(1, "Пройдите reCaptcha"),
});

export const ChangePasswordSchema = z.object({
  email: z.string().email("Введите корректный email"),
  phone: z
    .string()
    .regex(
      /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
      "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
    )
    .transform((phone) => {
      const digits = phone.replace(/\D/g, "");
      if (digits.startsWith("8") || digits.startsWith("7")) {
        return `+7${digits.slice(1)}`;
      }
      return `+${digits}`;
    }),
  verificationCode: z.string().optional(),
  captchaToken: z.string().min(1, "Пройдите reCaptcha"),
  password: z
    .string()
    .trim()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
    .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну прописную букву")
    .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
  confirmPassword: z.string(),
});

export const RegistrationSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "Введите значение")
      .max(50, "Слишком длинное значение")
      .refine(
        (value) => {
          if (value.trim() === "") return true;
          return /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value);
        },
        {
          message: "Есть недопустимые символы",
        },
      ),
    last_name: z
      .string()
      .trim()
      .min(1, "Введите значение")
      .max(50, "Слишком длинное значение")
      .refine(
        (value) => {
          if (value.trim() === "") return true;
          return /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value);
        },
        {
          message: "Есть недопустимые символы",
        },
      ),
    phone: z
      .string()
      .regex(
        /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
      )
      .transform((phone) => {
        const digits = phone.replace(/\D/g, "");
        if (digits.startsWith("8") || digits.startsWith("7")) {
          return `+7${digits.slice(1)}`;
        }
        return `+${digits}`;
      }),
    email: z
      .string()
      .trim()
      .email("Введите корректный email-адрес")
      .min(1, "Введите email")
      .max(254, "Email слишком длинный (максимум 254 символа)")
      .refine((value) => value.toLowerCase() === value, {
        message: "Email должен быть в нижнем регистре",
      }),
    password: z
      .string()
      .trim()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну прописную букву")
      .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
    confirmPassword: z.string(),
    verificationCode: z.string().optional(),
    captchaToken: z.string().min(1, "Пройдите reCaptcha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const AddressSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  city: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(30, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  street: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(30, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  house: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  entrance: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  floor: z
    .string()
    .trim()
    .optional()
    .nullable()
    .default(null)
    .refine(
      (value) => {
        if (value === null || value === undefined || value === "") return true;
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 999;
      },
      {
        message: "Этаж должен быть числом от 0 до 999",
      },
    ),
  apartment: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  intercom_number: z
    .string()
    .trim()
    .max(20, "Слишком длинное значение")
    .optional()
    .default("")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  additional_info: z
    .string()
    .trim()
    .max(500, "Дополнительная информация не может быть длиннее 500 символов")
    .optional()
    .default("")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  is_default: z.boolean().optional(),
});

export const PhoneSchema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
      "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
    )
    .transform((phone) => {
      const digits = phone.replace(/\D/g, "");
      if (digits.startsWith("8") || digits.startsWith("7")) {
        return `+7${digits.slice(1)}`;
      }
      return `+${digits}`;
    }),
});

export const EmailPhoneSchema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
      "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
    )
    .transform((phone) => {
      const digits = phone.replace(/\D/g, "");
      if (digits.startsWith("8") || digits.startsWith("7")) {
        return `+7${digits.slice(1)}`;
      }
      return `+${digits}`;
    }),
  email: z
    .string()
    .trim()
    .email("Введите корректный email-адрес")
    .min(1, "Введите email")
    .max(254, "Email слишком длинный (максимум 254 символа)")
    .refine((value) => value.toLowerCase() === value, {
      message: "Email должен быть в нижнем регистре",
    }),
  captchaToken: z.string().min(1, "Пройдите reCaptcha"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну прописную букву")
      .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
    confirmPassword: z.string(),
    token: z.string(),
    captchaToken: z.string().min(1, "Пройдите reCaptcha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
