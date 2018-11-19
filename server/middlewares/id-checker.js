import { checkSchema } from 'express-validator/check'; // to check a particular field

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
