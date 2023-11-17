import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
}

export const signAsync = (
  payload: TokenPayload,
  expiresIn,
  secret = "secret1234567890"
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const rs = await jwt.sign({ data: payload }, secret, {
        expiresIn,
      });
      resolve(rs);
    } catch (err) {
      reject(err);
    }
  });
};

export const verifyAccessTokenAsync = (
  token: string,
  secret = "secret1234567890"
): Promise<TokenPayload> => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, secret);
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};
