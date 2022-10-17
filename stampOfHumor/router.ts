import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import StampOfHumorCollection from './collection';
import * as userValidator from '../user/middleware';
import * as stampOfHumorValidator from '../stampOfHumor/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {boolean} isSatire - The content of the freet
 * @return {StampOfHumorResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    stampOfHumorValidator.isValidStampOfHumor
  ],
  async (req: Request, res: Response) => {
    console.log(req.body)

    const freetId = (req.body.freetId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const isSatire = req.body.satire === 'true' ? true : false;
    const stampOfHumor = await StampOfHumorCollection.addOne(freetId, isSatire);

    res.status(201).json({
      message: 'Your stamp of humor was created successfully.',
      stampOfHumor: util.constructStampOfHumorResponse(stampOfHumor)
    });
  }
);

export {router as stampOfHumorRouter};