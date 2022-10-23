import type {NextFunction, Request, Response} from 'express';
import express from 'express';

import * as userValidator from '../user/middleware';


const router = express.Router();

/**
 * Remove diversified freets
 *
 * @name DELETE /api/diversify/
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    // const freetId = req.params.freetId 
    // // delete all replies
    // const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    // const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    // const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);
    // const supportDiscussionId = supportDiscussion._id;
    // const neutralDiscussionId = neutralDiscussion._id;
    // const opposeDiscussionId = opposeDiscussion._id;
    // await ReplyCollection.deleteManyByDiscussion(supportDiscussionId)
    // await ReplyCollection.deleteManyByDiscussion(neutralDiscussionId)
    // await ReplyCollection.deleteManyByDiscussion(opposeDiscussionId)
    // // delete discussions
    // await DiscussionCollection.deleteOne(supportDiscussionId);
    // await DiscussionCollection.deleteOne(neutralDiscussionId);
    // await DiscussionCollection.deleteOne(opposeDiscussionId);
    // // delete stamp of humor
    // const stampOfHumor = await StampOfHumorCollection.findOne(freetId)
    // const stampOfHumorId = stampOfHumor._id;
    // await StampOfHumorCollection.deleteOne(stampOfHumorId);
    // // delete freet
    // await FreetCollection.deleteOne(freetId);

    res.status(200).json({
      message: 'Your diversified freet were removed successfully.'
    });
  }
);

/**
 * Populate diversified freets
 *
 * @name PUT /api/freets/
 *
 * @return {DiversifyResponse} - the updated freet, stampOfHumor, and discussions
 * @throws {403} - if the user is not logged in
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    // const freetId = req.params.freetId
    // const content = req.body.content
    // const isSatire = req.body.satire === 'true' ? true : false;
    // const freet = await FreetCollection.updateOne(freetId, content);
    // const stampOfHumor = await StampOfHumorCollection.findOne(freetId)
    // const newStampOfHumor = await StampOfHumorCollection.updateOne(stampOfHumor._id, isSatire)
    // // get discussions
    // const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    // const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    // const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
    });
  }
);

export {router as diversifyRouter};