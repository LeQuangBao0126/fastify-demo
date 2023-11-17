import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyRedis, { FastifyRedis } from "@fastify/redis";

import Redis from "ioredis";

// sử dụng vs redis client để share tất cả xài 1 connection redis
const client = new Redis({
  host: "redis-15784.c290.ap-northeast-1-2.ec2.cloud.redislabs.com",
  port: 15784,
  password: "36W2Sfc7zGfkkpEpiv7UZjrPEGJXR1Le",
  family: 4,
});

async function redisConnector(fastify: FastifyInstance) {
  return fastify.register(fastifyRedis, { client });
}

export const getRD = async (key: string) => {
  return await client.get(key);
};

export const getAllKeys = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      client.keys("*", function (err, keys) {
        if (err) return console.log(err);

        resolve(keys);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const hgetAll = async (key: string) => {
  return await client.hgetall(key);
};

export const hgetRD = async (key: string, field: string) => {
  return await client.hget(key, field);
};
export const hsetRD = async (key: string, field: string, value: string) => {
  return await client.hset(key, field, value);
};
export default fp(redisConnector);
