import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import StampOfHumorCollection from '../stampOfHumor/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isStampOfHumorExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.stampOfHumorId);
  const stampOfHumor = validFormat ? await StampOfHumorCollection.findOne(req.params.stampOfHumorId) : '';
  if (!stampOfHumor) {
    res.status(404).json({
      error: {
        stampOfHumorNotFound: `Stamp Of Humor with ID ${req.params.stampOfHumorId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidStampOfHumor = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.satire === undefined) {
    res.status(400).json({
      error: 'Must select value for Satire.'
    });
    return;
  }

  next();
};


const isValidStampOfHumorModifier = async (req: Request, res: Response, next: NextFunction) => {
  const stampOfHumor = await StampOfHumorCollection.findOne(req.params.stampOfHumorId);
  const freetId = stampOfHumor.freetId._id;
  const freet = await FreetCollection.findOne(freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' stamp of humor.'
    });
    return;
  }

  next();
};

export {
  isValidStampOfHumor,
  isStampOfHumorExists,
  isValidStampOfHumorModifier,
};
