import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import StampOfHumorCollection from '../stampOfHumor/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as stampOfHumorValidator from '../stampOfHumor/middleware';

import * as util from './util';

const router = express.Router();


router.post(
  '/freetAndStampOfHumor',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    stampOfHumorValidator.isValidStampOfHumor
  ],
  
  async (req: Request, res: Response) => {
    console.log('in sync routers', req.body)

    //create freet
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);
    console.log('freet', freet)
    const freetId = freet._id

    //create stamp of humor
    const isSatire = req.body.satire === 'true' ? true : false;
    const stampOfHumor = await StampOfHumorCollection.addOne(freetId, isSatire);
    console.log('stamp of humor', stampOfHumor)

    res.status(201).json({
      message: 'Your freet and stamp of humor was created successfully.',
      freetAndStampOfHumor: util.constructFreetAndStampOfHumorResponse(freet, stampOfHumor)
    });
  }
);

export {router as syncRouter};