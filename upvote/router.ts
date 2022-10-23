import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as replyValidator from '../reply/middleware';
import * as upvoteValidator from '../upvote/middleware';
import * as replyUtil from '../reply/util';
import * as upvoteUtil from '../upvote/util';
import UpvoteCollection from '../upvote/collection';
import ReplyCollection from '../reply/collection';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Increment upvote of associated replyId
 *
 * @name PUT /api/upvotes/:id/inc
 *
 * @return {UpvoteResponse} - the updated upvote
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the replyId
 */
router.put(
  '/:replyId?/inc',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    upvoteValidator.isUpvoteExists,
    upvoteValidator.isValidUpvoteModifier
  ],
  async (req: Request, res: Response) => {
    console.log('req.query', req.query)
    console.log('req.body', req.body)
    console.log('req.params', req.params)
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const replyId = req.params.replyId
    const reply = await ReplyCollection.findOne(replyId);
    const upvote = await UpvoteCollection.findOne(replyId);
    const upvoteId = upvote._id;
    const newUpvote = await UpvoteCollection.updateOne(upvoteId, user, true);

    res.status(200).json({
      message: 'Your upvote was incremented successfully.',
      reply: replyUtil.constructReplyResponse(reply),
      upvote: upvoteUtil.constructUpvoteResponse(newUpvote),
    });
  }
);

/**
 * Decrement upvote of associated replyId
 *
 * @name PUT /api/upvotes/:id/dec
 *
 * @return {UpvoteResponse} - the updated upvote
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the replyId
 */
router.put(
  '/:replyId?/dec',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    upvoteValidator.isUpvoteExists,
    upvoteValidator.isValidUpvoteModifier
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const replyId = req.params.replyId
    const reply = await ReplyCollection.findOne(replyId);
    const upvote = await UpvoteCollection.findOne(replyId);
    const upvoteId = upvote._id;
    const newUpvote = await UpvoteCollection.updateOne(upvoteId, user, false);

    res.status(200).json({
      message: 'Your upvote was decremented successfully.',
      reply: replyUtil.constructReplyResponse(reply),
      upvote: upvoteUtil.constructUpvoteResponse(newUpvote),
    });
  }
);

export {router as upvoteRouter};