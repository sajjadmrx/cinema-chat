import { customAlphabet } from 'nanoid';

export function getRandomNumber(length: number): number {
  const nanoid = customAlphabet('123456789', length);
  return Number(nanoid());
}
