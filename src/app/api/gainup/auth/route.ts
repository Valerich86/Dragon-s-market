import { NextResponse } from "next/server";

//аутентификация
export async function GET() {
  try {
    const host_name = process.env.HOST_NAME
    const url = `${host_name}/api/auth`;
    const headers = {
      'X-Auth-User': process.env.X_AUTH_USER || '',
      'X-Auth-Key': process.env.X_AUTH_KEY || ''
    };
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 204) {
      const authToken = response.headers.get('X-Auth-Token');
      const expireToken = response.headers.get('X-Expire-Auth-Token');

      if (!authToken || !expireToken) {
        return Response.json(
          {
            success: false,
            error: 'Внешний API вернул 204, но не содержит необходимых заголовков'
          },
          { status: 502 } // Bad Gateway
        );
      }

      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', 'application/json');

      return new Response(
        JSON.stringify({
          success: true,
          authToken: authToken,
          expireToken: expireToken,
          message: 'Аутентификация успешна'
        }),
        {
          status: 200,
          headers: responseHeaders
        }
      );
    }

    else if (response.status === 403) {
      const authError = response.headers.get('X-Auth-Error') || 'Неизвестная ошибка аутентификации';

      return Response.json(
        {
          success: false,
          error: authError,
          message: 'Ошибка аутентификации'
        },
        { status: 403 }
      );
    }

    else {
      return Response.json(
        {
          success: false,
          error: `Внешний API вернул статус ${response.status}`,
          message: 'Ошибка внешнего API'
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Критическая ошибка при запросе к внешнему API:', error);

    return Response.json(
      {
        success: false,
        error: 'Внутренняя ошибка сервера',
        message: 'Не удалось выполнить запрос к внешнему API'
      },
      { status: 500 }
    );
  }
}


