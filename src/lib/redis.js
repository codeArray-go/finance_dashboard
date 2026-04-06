import redis from "redis";
import { ENV } from "./env.js";

const redisClient = redis.createClient({
  url: ENV.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis error: ", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully.");
};

export default redisClient;