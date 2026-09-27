import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'land-rover-secret-key-2024-change-in-production'
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: { id: number; email: string; role: string; name: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<{ id: number; email: string; role: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: number; email: string; role: string; name: string };
  } catch {
    return null;
  }
}
