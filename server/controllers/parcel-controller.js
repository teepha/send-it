import fs from 'fs';
import { validationResult } from 'express-validator/check'; // calls the specified validation
import parcelsDb from '../parcelsdb';

export const getAllParcels = (req, res) => {
  if (parcelsDb.length) {
    res.status(200).send(parcelsDb);
  } else {
    res.status(404).send({ msg: 'No Parcel-Delivery orders' });
  }
};

export const getParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const foundParcel = parcelsDb.find(parcel => parcel.id === req.params.id);
    if (foundParcel) {
      res.status(200).send(foundParcel);
    } else {
      res.status(404).send({ msg: 'Parcel not found' });
    }
  }
};

export const updateParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const parcelToCancel = parcelsDb.find(parcel => parcel.id === req.params.id);
    if (!parcelToCancel) {
      res.status(404).send({ msg: 'Error! Parcel Order Not Found' });
    } else if (parcelToCancel.status === 'Delivered') {
      res.status(400).send({ msg: 'Parcel Delivered! Cannot cancel Parcel Order.' });
    } else if (parcelToCancel.status === 'Cancelled') {
      res.status(400).send({ msg: 'Cannot Cancel Parcel Order, Order Already Cancelled.' });
    } else {
      parcelToCancel.status = 'Cancelled';
      fs.writeFile('server/parcelsdb.json', JSON.stringify(parcelsDb, null, 2), (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(202).send(parcelToCancel);
        }
      });
    }
  }
};

export const createParcel = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const newParcel = {
      id: parcelsDb[parcelsDb.length - 1].id + 1,
      userId: req.body.userId,
      pickupLocation: req.body.pickupLocation,
      destination: req.body.destination,
      recipientName: req.body.recipientName,
      recipientPhone: req.body.recipientPhone,
      status: 'Ready for Pickup',
      presentLocation: '',
    };

    parcelsDb.push(newParcel);

    fs.writeFile('server/parcelsdb.json', JSON.stringify(parcelsDb, null, 2), (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(newParcel);
      }
    });
  }
};
