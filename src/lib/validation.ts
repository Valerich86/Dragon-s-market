interface ValidationResult {
  isSafe: boolean;
  cleanedValue: string | null;
  error: string;
}

export function validateAndSanitize(
  input: string,
  options: {
    allowMarkdown?: boolean;
    maxLength?: number;
  } = {}
): ValidationResult {
  // 1. Проверка типа
  if (input === undefined || input === null) {
    return {
      isSafe: true,
      cleanedValue: null,
      error: "",
    };
  }

  let cleaned = input.trim();

  // 2. Базовая проверка на очевидные XSS‑векторы
  const dangerousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
    /<\/script>/i,
    /<iframe[^>]*>/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(cleaned)) {
      return {
        isSafe: false,
        cleanedValue: null,
        error: "Обнаружены потенциально опасные скрипты или XSS‑векторы",
      };
    }
  }

  // 3. Санитизация в зависимости от формата
  if (options.allowMarkdown) {
    // Для Markdown — только базовая очистка опасных элементов
    cleaned = sanitizeMarkdown(cleaned);
  } else {
    // Для HTML — разрешаем только безопасные теги
    const allowedTags = ['p', 'br', 'b', 'i', 'u', 'ol', 'ul', 'li', 'blockquote'];
    cleaned = sanitizeHtml(cleaned, allowedTags);
  }

  // 4. Финальная проверка на пустоту
  if (cleaned.trim().length === 0) {
    cleaned = "";
  }

  return {
    isSafe: true,
    cleanedValue: cleaned,
    error: "",
  };
}

// Вспомогательная функция для санитизации Markdown
function sanitizeMarkdown(text: string): string {
  // Удаляем опасные конструкции, но сохраняем синтаксис Markdown
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, 'javascript&#58;')
    .replace(/vbscript:/gi, 'vbscript&#58;');
}

// Вспомогательная функция для санитизации HTML
function sanitizeHtml(html: string, allowedTags: string[]): string {
  const allowedPattern = new RegExp(`<(?!\/?(?:${allowedTags.join('|')})\b)[^>]*>`, 'gi');
  return html.replace(allowedPattern, '');
}
