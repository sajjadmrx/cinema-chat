import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mode: process.env.NODE_ENV,
  DATABASE_URL: process.env.DB_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});
