import { customAlphabet } from 'nanoid';

export function getRandomNumber(length: number): number {
  const nanoid = customAlphabet('123456789', length);
  return Number(nanoid());
}
export function getRandomString(length: number): string {
  const nanoid = customAlphabet('1234567890abcdef_xyaw', length);
  return nanoid()
}