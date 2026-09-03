import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;

const redisClient = redisUrl
  ? new Redis(redisUrl)
  : redisHost
    ? new Redis({
        host: redisHost,
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
      })
    : null;

if (redisClient) {
  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.on("error", (err) => {
    console.log("Redis error:", err.message);
  });
} else {
  console.log("Redis not configured - continuing without Redis");
}

export default redisClient;