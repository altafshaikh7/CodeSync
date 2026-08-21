import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

const redisClient = redisUrl
  ? new Redis(redisUrl)
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