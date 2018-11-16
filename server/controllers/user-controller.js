import { validationResult } from 'express-validator/check';
import parcelsDb from '../parcelsdb';
import usersDb from '../usersdb';

export const getUserParcels = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const { userId } = req.params;
    const theUser = usersDb.find(user => user.id === userId);
    if (theUser) {
      const userParcels = parcelsDb.filter(parcel => parcel.userId === req.params.userId);
      if (userParcels.length) {
        res.status(200).send(userParcels);
      } else {
        res.status(404).send({ msg: 'User has no Parcel Delivery Orders yet' });
      }
    } else {
      res.status(404).send({ msg: 'User not found!!!' });
    }
  }
};
