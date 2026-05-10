import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
  name?: string;
  [key: string]: any;
}

export async function encrypt(payload: SessionPayload, expiresIn = "24h") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: SessionPayload, rememberMe: boolean = false) {
  const expiresIn = rememberMe ? "30d" : "24h";
  const session = await encrypt(payload, expiresIn);

  const cookieStore = await cookies();
  const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  if (rememberMe) {
    cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  cookieStore.set("session", session, cookieOptions);
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
