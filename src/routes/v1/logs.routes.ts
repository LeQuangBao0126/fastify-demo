import { FastifyInstance } from "fastify";

export const logRoutes = async function (fastify: FastifyInstance, options) {
  fastify.get("/logs", async (req, res) => {
    const rs = await fastify.redis.get("*");
    return res.send({ data: rs });
  });
};
