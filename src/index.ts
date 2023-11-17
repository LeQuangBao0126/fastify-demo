import Fastify, {
  FastifyInstance,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";
import crypto from "crypto";
import { userRoutes } from "~/routes/v1/users.routes";
import mongoDbInit from "~/config/mongodb.config";
import redisDbInit from "~/config/redisdb.config";
import { logRoutes } from "./routes/v1/logs.routes";
import { ErrorWithStatus } from "./config/error.config";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import middie from "@fastify/middie";
import fpExpress from "@fastify/express";
import fp from "fastify-plugin";
import Etag from "@fastify/etag";
import fs from "fs";
// test schema import "~/model/schema/product.schema";

const app: FastifyInstance = Fastify({
  logger: false,
  caseSensitive: false,
}).withTypeProvider<TypeBoxTypeProvider>();

app.get("/ping", async (request, response) => {
  return "ready \n";
});

app.addHook("onRequest", (request, reply, done) => {
  console.log("onRequest global run :::::::: ");
  done();
});

app.register(fpExpress);
app.register(Etag);

app.register(mongoDbInit);
app.register(redisDbInit);
app.register(
  // ket hop fastify register with use middleware
  fp((fastify, opts, done) => {
    fastify.use(require("cors")());
    fastify.use((req, res, next) => {
      console.log("second");
      next();
    });
    fastify.use((req, res, next) => {
      console.log("third");
      next();
    });
    done();
  })
);

app.register(userRoutes, { prefix: "/v1" });
app.register(logRoutes, { prefix: "/v1" });

//add global middleware
app.setErrorHandler((error, req, res) => {
  console.log("Loi roi ", error.code);
  if (error instanceof Fastify.errorCodes.FST_ERR_CTP_EMPTY_JSON_BODY) {
    return res.send({ message: error.message });
  }

  if ((error as any) instanceof ErrorWithStatus) {
    return res.send({
      message: error.message,
      code: error.code,
    });
  } else if (error instanceof Error) {
    console.log("error", error);
    return res.send(error);
  }
});

const checkAuthMiddleware = async (req, res, done) => {
  console.log("pre handler request");
  done();
};

const validateBody = async (req: FastifyRequest, res, done) => {
  // req.user = "lequangbao";
  // req.user222 = "lequangbao222";
  done();
};

const opts: RouteShorthandOptions = {
  onRequest: function (request, reply, done) {
    done();
  },

  preValidation: [validateBody],
  preHandler: [checkAuthMiddleware],
};

app.get("/product", opts, async (req, res) => {
  return res.send({ message: "ok" });
});

///////////   tự suy ra type nhờ vào schema . express ko có phải dùng thư vien khác

const keyCheck = (req, res, done) => {
  const isValid = RSAVerify(
    fs.readFileSync("public.pem"),
    fs.readFileSync("signature.pem"),
    "ORDER_XXXXX_123"
  );
  if (isValid) {
    done();
  } else {
    return res.send({ error: "true" });
  }
};

function RSAVerify(publicKey, signature, data) {
  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  const rs = verify.verify(publicKey.toString(), signature.toString(), "hex");
  return rs;
}

function RSASign(privateKey, data) {
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  var sig = sign.sign(privateKey, "hex");
  fs.writeFileSync("signature.pem", sig);
  return sig;
}

app.post("/contract", async (req: any, res) => {
  RSASign(fs.readFileSync("private.pem"), "ORDER_XXXXX_123");

  return res.send({ ok: true });
});

app.post("/contract-check", { preHandler: keyCheck }, async (req, res) => {
  return res.send({ message: "verify processing :: ", data: "true " });
});

// const schema = {
//   body: Type.Object({
//     product_name: Type.String(),
//     product_price: Type.Number(),
//   }),
// };
// type ProductBody = Static<typeof schema.body>;
//app.post<{ Body: ProductBody }>("/product2", async (req, reply) => {});

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
