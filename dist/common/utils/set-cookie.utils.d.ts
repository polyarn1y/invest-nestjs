import type { Response, CookieOptions } from "express";
import { StringValue } from "ms";
export declare function setCookie(response: Response, name: string, value: any, maxAge?: StringValue | number, cookieOptions?: CookieOptions): void;
