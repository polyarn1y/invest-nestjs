import type { Response, CookieOptions, Request } from "express";
import { StringValue } from "ms";
export declare function setCookie(response: Response, name: string, value: string, maxAge?: StringValue | number, cookieOptions?: CookieOptions): void;
export declare function getCookie(request: Request, name: string): string | undefined;
