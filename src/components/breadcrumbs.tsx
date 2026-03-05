'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Breadcrumb {
  label: string;
  href: string;
}

const pages = ['/catalog', '/news', '/delivery', '/about'];

export default function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Добавляем текущий путь в историю при навигации
    setHistory((prev) => {
      // Избегаем дубликатов подряд
      if (prev[prev.length - 1] === pathname) {
        return prev;
      }
      if (pathname === "/") return [pathname];
      if (pages.includes(pathname)) return ["/", pathname];
      return [...prev, pathname];
    });
  }, [pathname]);

  // Формируем крошки из истории
  const breadcrumbs: Breadcrumb[] = history.map((path, index) => ({
    label: getLabelFromPath(path),
    href: path,
  }));

  // Добавляем текущую страницу, если её ещё нет в истории
  if (!breadcrumbs.some(crumb => crumb.href === pathname)) {
    breadcrumbs.push({
      label: getLabelFromPath(pathname),
      href: pathname
    });
  }

  return (
    <nav aria-label="Breadcrumbs" className='absolute x-spacing left-0 top-20 text-gray-400 text-xs z-50'>
      <ol className="flex gap-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            {index > 0 && <span>/</span>}
            <a
              href={crumb.href}
            >
              {crumb.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function getLabelFromPath(path: string): string {
  const labels: Record<string, string> = {
    '/': 'Главная',
    '/catalog': 'Каталог',
    '/news': 'Новости',
    '/about': 'О нас',
    '/delivery': 'Как купить?',
    '/basket': 'Корзина',
    '/profile': 'Профиль',
    "/catalog/6": "Японские вафли и печенье",
  };
  return labels[path] || 'Страница';
}
