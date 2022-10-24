import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import StampOfHumorCollection from '../stampOfHumor/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a stampOfHumor with stampOfHumorId exists
 */
const isStampOfHumorExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.params.freetId;
  const validFormat = Types.ObjectId.isValid(freetId);  
  const stampOfHumor = validFormat ? await StampOfHumorCollection.findOne(freetId) : '';
  if (!stampOfHumor) {
    res.status(404).json({
      error: {
        stampOfHumorNotFound: `Stamp Of Humor with associated freetId ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the satire is not undefined
 * spaces and not more than 140 characters
 */
const isValidStampOfHumor = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.satire === undefined) {
    res.status(400).json({
      error: 'Must select value for satire.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose stampOfHumorId is associated
 */
const isValidStampOfHumorModifier = async (req: Request, res: Response, next: NextFunction) => {
  const stampOfHumor = await StampOfHumorCollection.findOne(req.params.freetId);
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
