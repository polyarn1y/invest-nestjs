import type { Response, CookieOptions, Request } from "express";
import ms, { StringValue } from "ms";

export function setCookie(response: Response, name: string, value: string, maxAge: StringValue | number = '15m', cookieOptions?: CookieOptions): void {
  const maxAgeMs: number = typeof maxAge === 'number' ? maxAge : ms(maxAge) as number;
  
  response.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: maxAgeMs,
    ...cookieOptions
  })
};

export function getCookie(request: Request, name: string): string | undefined {
  return request.cookies?.[name];
};