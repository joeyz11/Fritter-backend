import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';

import * as userValidator from '../user/middleware';
import * as stampOfHumorUtil from '../stampOfHumor/util';
import * as discussionUtil from '../discussion/util';
import * as freetUtil from '../freet/util';
import StampOfHumorCollection from '../stampOfHumor/collection';
import DiscussionCollection from '../discussion/collection';

const router = express.Router();
import {Sentiment} from '../discussion/util'

/**
 * Remove diversified freets
 *
 * @name GET /api/diversify/remove
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/remove',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {

    res.status(200).json({
      diversifiedFreet: [] 
    });
  }
);

/**
 * Get diversified freets
 *
 * @name Get /api/diversify
 *
 * @return {DiversifyResponse} - the updated freet, stampOfHumor, and discussions
 * @throws {403} - if the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    // find diversified freets based on user
    const diversifiedFreets = await FreetCollection.findDiversifiedFreetsForUserId(userId)
    const response = await Promise.all(diversifiedFreets.map(async (freet) => {
      const freetId = freet._id.toString();
      const stampOfHumor = await StampOfHumorCollection.findOne(freetId);
      const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
      const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
      const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);
      return ({
        diversifiedFreet: freetUtil.constructFreetResponse(freet),
        stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
        supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
        neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
        opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
      })
    }));
    res.status(200).json(response);

  }
);

export {router as diversifyRouter};