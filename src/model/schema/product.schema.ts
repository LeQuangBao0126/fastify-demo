import Ajv, { Schema } from "ajv";
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const schema = {
  type: "object",
  properties: {
    size: {
      type: "number",
      minimum: 4,
    },
  },
  errorMessage: {
    properties: {
      size: "size should be a number bigger or equal to 4, current value is ${/size}",
    },
  },
};

const data = {
  product_name: 1,
};

const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) {
  console.log(validate.errors);
}
