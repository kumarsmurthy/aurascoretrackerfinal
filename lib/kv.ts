import { kv } from '@vercel/kv';
import { hash, compare } from 'bcrypt';

export async function createUser(email: string, password: string) {
  const hashedPassword = await hash(password, 10);
  await kv.hset(`user:${email}`, {
    email,
    password: hashedPassword,
  });
}

export async function getUser(email: string) {
  return kv.hgetall(`user:${email}`);
}

export async function verifyPassword(email: string, password: string) {
  const user = await getUser(email);
  if (!user) return false;
  return compare(password, user.password);
}

export async function saveAuraScore(email: string, date: string, score: number) {
  await kv.lpush(`aura_scores:${email}`, JSON.stringify({ date, score }));
}

export async function getAuraScores(email: string) {
  const scores = await kv.lrange(`aura_scores:${email}`, 0, -1);
  return scores.map(score => JSON.parse(score));
}
