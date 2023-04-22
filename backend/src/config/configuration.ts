import * as process from 'process';

const configs = {
  port: Number(process.env.PORT) || 3000,
  mode: String(process.env.NODE_ENV),
  DATABASE_URL: String(process.env.DB_URL),
  REDIS_URL: String(process.env.REDIS_URL),
  JWT_SECRET: String(process.env.JWT_SECRET),
};

export default () => configs;
export type ConfigsType = typeof configs;
