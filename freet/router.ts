import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as stampOfHumorValidator from '../stampOfHumor/middleware';
import * as freetUtil from '../freet/util';
import * as stampOfHumorUtil from '../stampOfHumor/util';

import StampOfHumorCollection from '../stampOfHumor/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetAndStampOfHumorResponse[]} - A list of all the freets and stampOfHumors sorted in descending
 *                      order by date modified
 */
/**
 * Get freets and stampOfHumors by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetAndStampOfHumorResponse[]} - An array of freets and stampOfHumors created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    const allFreets = await FreetCollection.findAll();
    const response = await Promise.all(allFreets.map(async (freet) => {
      const stampOfHumor = await StampOfHumorCollection.findOne(freet._id.toString())
      return ({
        freet: freetUtil.constructFreetResponse(freet),
        stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
      })
    }));
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = await Promise.all(authorFreets.map(async (freet) => {
      const stampOfHumor = await StampOfHumorCollection.findOne(freet._id.toString())
      return ({
        freet: freetUtil.constructFreetResponse(freet),
        stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
      })
    }));
    res.status(200).json(response);
  }
);

/**
 * Create a new freet and associated stampOfHumors.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} satire - Whether the freet is satircal or not
 * @return {FreetResponse, StampOfHumorResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces, or if satire field is undefined
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    stampOfHumorValidator.isValidStampOfHumor
  ],
  async (req: Request, res: Response) => {
    // create freet
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);
    const freetId = freet._id
    // create stamp of humor
    const isSatire = req.body.satire === 'true' ? true : false;
    const stampOfHumor = await StampOfHumorCollection.addOne(freetId, isSatire);
    res.status(201).json({
      message: 'Your freet and stampOfHumor was created successfully.',
      freet: freetUtil.constructFreetResponse(freet),
      stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor)
    });
  }
);

/**
 * Delete a freet and associated stampOfHumor
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in, or is not the author of
 *                 the freet or stampOfHumor
 * @throws {404} - If the freetId or stampOfHumorId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    stampOfHumorValidator.isStampOfHumorExists,
    freetValidator.isValidFreetModifier,
    stampOfHumorValidator.isValidStampOfHumorModifier,
  ],
  async (req: Request, res: Response) => {
    const stampOfHumor = await StampOfHumorCollection.findOne(req.params.freetId)
    const stampOfHumorId = stampOfHumor._id;
    await StampOfHumorCollection.deleteOne(stampOfHumorId);
    await FreetCollection.deleteOne(req.params.freetId);

    res.status(200).json({
      message: 'Your freet and stampOfHumor was deleted successfully.'
    });
  }
);

/**
 * Modify a freet and associated stampOfHumor
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @param {string} satire - whether the new freet is satirical or not
 * @return {FreetResponse,StampOfHumorResponse} - the updated freet and stampOfHumor
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet or stampOfHumor
 * @throws {404} - If the freetId os stampOfHumorId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces, or if satire field is undefined
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    stampOfHumorValidator.isStampOfHumorExists,
    freetValidator.isValidFreetModifier,
    stampOfHumorValidator.isValidStampOfHumorModifier,
    freetValidator.isValidFreetContent,
    stampOfHumorValidator.isValidStampOfHumor
  ],
  async (req: Request, res: Response) => {
    const freetId = req.params.freetId
    const content = req.body.content
    const isSatire = req.body.satire === 'true' ? true : false;
    const freet = await FreetCollection.updateOne(freetId, content);
    const stampOfHumor = await StampOfHumorCollection.findOne(freetId)
    const newStampOfHumor = await StampOfHumorCollection.updateOne(stampOfHumor._id, isSatire)
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: freetUtil.constructFreetResponse(freet),
      stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(newStampOfHumor)
    });
  }
);

export {router as freetRouter};
