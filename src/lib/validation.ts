interface ValidationResult {
  isSafe: boolean;
  cleanedValue: string | null;
  errors: string[];
}

export function validateAndSanitize(input: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. Проверка типа
  if (input === undefined || input === null) {
    return {
      isSafe: true,
      cleanedValue: null,
      errors: []
    };
  }

  if (typeof input !== 'string') {
    return {
      isSafe: false,
      cleanedValue: null,
      errors: ['Поле notes должно быть строкой']
    };
  }

  let cleaned = input.trim();

  // 2. Проверка длины (максимум 500 символов)
  if (cleaned.length > 500) {
    errors.push('Поле notes слишком длинное (максимум 1000 символов)');
    return {
      isSafe: false,
      cleanedValue: null,
      errors
    };
  }

  // 3. Проверка на XSS‑паттерны
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i, // обработчики событий (onclick и т. д.)
    /<\/script>/i,
    /<iframe/i,
    /<img[^>]*onerror/i,
    /<svg[^>]*onload/i
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(cleaned)) {
      errors.push('Обнаружены потенциально опасные скрипты или XSS-векторы');
      break;
    }
  }

  // 4. Проверка на SQL‑инъекции
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP',
    'UNION', 'OR 1=1', 'OR \'1\'=\'1\'',
    'EXEC', 'EXECUTE', 'xp_cmdshell',
    ';--', '--', '/*', '*/'
  ];
  const upperInput = cleaned.toUpperCase();

  for (const keyword of sqlKeywords) {
    if (upperInput.includes(keyword)) {
      errors.push('Обнаружены признаки SQL-инъекций');
      break;
    }
  }

  // Если есть ошибки — возвращаем результат с ошибками
  if (errors.length > 0) {
    return {
      isSafe: false,
      cleanedValue: null,
      errors
    };
  }

  // 5. Очистка от HTML‑тегов
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // 6. Экранирование специальных HTML‑символов
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  cleaned = cleaned.replace(/[&<>"'\/]/g, match => escapeMap[match]);

  // 7. Дополнительная очистка от JavaScript‑событий в остатках
  cleaned = cleaned
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '');

  // Финальная проверка на пустоту после очистки
  if (cleaned.trim().length === 0) {
    cleaned = '';
  }

  return {
    isSafe: true,
    cleanedValue: cleaned,
    errors: []
  };
}
