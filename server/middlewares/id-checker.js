import { checkSchema } from 'express-validator/check';

const idChecker = (field, locations, errMsg) => checkSchema({
  [field]: {
    in: locations,
    errorMessage: errMsg,
    isInt: true,
    toInt: true,
    trim: true,
  },
});

export default idChecker;
