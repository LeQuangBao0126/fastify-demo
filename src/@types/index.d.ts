import { FastifyRedis } from "@fastify/redis";
import { FastifyMongoObject } from "@fastify/mongodb";
import { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    redis: FastifyRedis;
    mongo: FastifyMongoObject;
  }
  // interface FastifyRequest {
  //   user: string;
  //   user222: string;
  // }
}
