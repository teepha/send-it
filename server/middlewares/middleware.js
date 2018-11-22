import jwt from 'jsonwebtoken';

export const JwtDocoder = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
      if (err) {
        res.status(500).send(err)
      } else {
        req.user = userInfo;
        next();
      }
    });
  } else {
    res.status(401).send({ msg: 'Authorization header is missing!!!' });
  }
};
