import fastifyPlugin from "fastify-plugin";
import fastifyMySql from "@fastify/mysql";

async function mySqlConnector(fastify, options) {
  fastify.register(fastifyMySql, {
    connectionString: "mysql://root@localhost/mysql",
  });
}

export default fastifyPlugin(mySqlConnector);
