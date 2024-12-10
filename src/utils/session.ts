import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const getSession = async () => {
  return await getIronSession<{ id?: number }>(cookies(), {
    cookieName: "carrot-market",
    password: process.env.COOKIE_PASSWORD!,
  });
};
