export const serverError = (res, error) => {
  return res.status(500).send(error);
};

export const successResponse = (res, data) => {
  return res.status(200).send(data);
};
