import { FastifyRedis } from "@fastify/redis";

export const getLogsRD = async (redisClient: FastifyRedis) => {
  return await redisClient.get("key1");
};
