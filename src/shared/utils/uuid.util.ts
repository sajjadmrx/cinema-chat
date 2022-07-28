import { nanoid, customAlphabet } from 'nanoid';
import { Schema } from 'mongoose';

export function getRandomNumber(length: number): number {
  const nanoid = customAlphabet('123456789', length);
  return Number(nanoid());
}
