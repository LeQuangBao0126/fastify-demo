export class ErrorWithStatus extends Error {
  code: string;
  constructor({ message, code }: { message: string; code: string }) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

class SuccessResponse {}
