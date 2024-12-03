// src/lib/session.ts
import type { IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "user_session",
};

export interface SessionData extends IronSessionData {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
 }