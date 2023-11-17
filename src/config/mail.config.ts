// bị deprecate import Sib from "sib-api-v3-sdk";

import SibApiV3Sdk from "sib-api-v3-sdk";
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

interface SenderType {
  email: string;
  name: string;
}
interface ReceiverType {
  email: string;
}
export function SendEmail(sender: SenderType, receivers: ReceiverType[]) {
  return tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Subscribe to Cules Coding to become a developer",
    textContent: `
    Cules Coding will teach you how to become {{params.role}} a developer.
    `,
    htmlContent: `
                 <h1>Chúc mừng bạn đã đăng kí thành công .Xin hãy đăng nhập vào hệ thống để trải nghiệm</h1>
                 `,
  });
}
