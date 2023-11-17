import fastifyMongodb, { FastifyMongoObject } from "@fastify/mongodb";
import { ErrorWithStatus } from "~/config/error.config";
import bcrypt from "bcrypt";
import { signAsync } from "~/config/jwt.config";
import { hgetAll, hsetRD } from "~/config/redisdb.config";
import { SendEmail } from "~/config/mail.config";
const getUsers = (app) => {
  return async (req, res) => {
    const users = await app.mongo.db
      .collection("users")
      .find({ username: "bao" })
      .toArray();

    return res.send({ users });
  };
};
const LOG_USER = "LOG:USER:";

const login = (app) => {
  return async (req, res) => {
    const { email, password } = req.query;

    // start log chơi redis
    hsetRD(LOG_USER + email, Date.now().toString(), "login");
    // end log
    //const rs = await hgetAll(LOG_USER_KEY);
    //console.log(rs);
    const user = await app.mongo.db.collection("users").findOne({ email });
    if (!user) {
      throw new ErrorWithStatus({
        message: "không tìm thấy user",
        code: "404",
      });
    }
    // compare hash and plain text password
    const match = await bcrypt.compareSync(password, user.password);
    if (!match) {
      throw new ErrorWithStatus({
        message: "password hoac mat khẩu ko chính xác",
        code: "400",
      });
    }

    // sign and return access_token or refresh_token

    const access_token = await signAsync({ userId: user._id }, 60 * 60 * 60);
    const refresh_token = await signAsync(
      { userId: user._id },
      60 * 60 * 60 * 24
    );

    return res.send({
      message: "Login thành công",
      data: {
        access_token,
        refresh_token,
      },
    });
  };
};

const register = (app) => {
  return async (req, res) => {
    // hash password
    const { email, password } = req.query;
    const user = await app.mongo.db.collection("users").findOne({ email });
    if (user) {
      throw new ErrorWithStatus({
        message: "user đã có trong he thống",
        code: "400",
      });
    }

    // hashhh
    let salt = bcrypt.genSaltSync(10);
    var passwordHashed = bcrypt.hashSync(password, salt);
    // store mongo
    const rs = await app.mongo.db
      .collection("users")
      .insertOne({ email, password: passwordHashed, salt });
    console.log(rs);
    // notify or send email to user
    const sender = {
      email: "admin@gmail.com",
      name: "Quản trị viên BAOBEO fanpage",
    };
    const receivers = [{ email }];
    SendEmail(sender, receivers);

    return res.send({ message: "Register thành công", data: rs });
  };
};

const logs = (app) => {
  return async (req, res) => {
    const { email } = req.query;
    const rs = await hgetAll(LOG_USER + email);
    console.log(rs);
    return res.send({ data: rs });
  };
};
export default {
  getUsers,
  login,
  register,
  logs,
};
