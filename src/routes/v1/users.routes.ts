import { FastifyInstance, RouteShorthandOptions } from "fastify";
import usersControllers from "~/controllers/users.controllers";
import { FastifyRedis } from "@fastify/redis";
import { getAllKeys, getRD } from "~/config/redisdb.config";

export const userRoutes = async function (app: FastifyInstance, options) {
  const validateJOI = async (request, reply, next) => {
    console.log("midd1 run validate");
    next();
  };

  console.log("setup routes ::::::::::");

  app.get(
    "/users",
    { preHandler: [validateJOI] },
    usersControllers.getUsers(app)
  );
  app.get("/users/login", usersControllers.login(app));
  app.get("/users/register", usersControllers.register(app));

  app.get("/users/setredis/:value", {}, (req, res) => {
    const redis = app.redis as FastifyRedis;
    // services .. pass redis client

    redis.set("key1", (req.params as any).value as string);
    return res.send({ message: "redis set successfull" });
  });

  app.get("/users/getredis", async (req, res) => {
    const rs = await getRD("key1");
    return res.send({ message: rs });
  });

  app.get("/users/logs", usersControllers.logs(app));
};
