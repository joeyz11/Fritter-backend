import type {NextFunction, Request, Response} from 'express';

import * as discussionUtil from '../discussion/util';
import * as freetValidator from '../freet/middleware';
import DiscussionCollection from '../discussion/collection';
import express from 'express';
import {Sentiment} from '../discussion/util'

const router = express.Router();

/**
 * Get discussions of freet
 *
 * @name GET /api/discussions?freetId=id
 *
 * @return {DiscussionResponse[]} - An array of discussions associated with the freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If freetId is invalid
 *
 */
router.get(
  '/',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetId = (req.query.freetId as string);
    // get 'support', 'neutral', 'oppose' discussions
    const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);

    res.status(200).json({
      supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
      neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
      opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
    })
  }
);

export {router as discussionRouter};