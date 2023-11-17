var crypto = require("crypto");
var fs = require("fs");
var data = "Your Password 1 ";
var salt = Date.now().toString();
// SHA256
// nếu 2 input giống thì ra 2 output giống . nen có thể thêm random salt
// băm 1 chiều ko thể decrypt lại đc . mún compare thì phải hash

const hash = crypto
  .createHash("sha256")
  .update(salt)
  .update(data)
  .digest("hex");
//console.log("Hash successfully generated: ", hash);
// SHA-256 là 1 thuat toán mã hóa (hàm băm) , trong nodejs có 1 gói là crypto để thực hiện thuật toán đó dùng để mã hóa chuỗi
// và là hàm băm 1 chiều ko thể decrypt lại đc . mún compare 2 chuổi thì phải hash rồi compare 2 hash
// và 1 điều lưu ý nếu 2 input giống thì ra 2 output giống (2 hash giống nhau). nên có thể thêm random salt
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});
//
// fs.writeFileSync("public2.pem", publicKey);
// fs.writeFileSync("private2.pem", privateKey);
// console.log("done ::::");

//pem
const dataBuf = Buffer.from("ORDER_XXXXX_123");

const chuki = crypto.sign("sha256", dataBuf, {
  key: fs.readFileSync("private.pem"),
});

const isVerified = crypto.verify(
  "sha256",
  dataBuf,
  {
    key: fs.readFileSync("public.pem"),
  },
  chuki
);

console.log(chuki.toString("hex"));
console.log(isVerified);
