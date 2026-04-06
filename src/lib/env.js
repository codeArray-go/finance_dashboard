import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  CLIENT_URI: process.env.CLIENT_URI,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_URI: process.env.DB_URI,
  ARCJET_KEY: process.env.ARCJET_KEY
};
