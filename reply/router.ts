import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as replyValidator from '../reply/middleware';
import * as discussionValidator from '../discussion/middleware';
import * as replyUtil from '../reply/util';

import ReplyCollection from '../reply/collection';

const router = express.Router();


/**
 * Get all the replies
 *
 * @name GET /api/replies
 *
 * @return {ReplyResponse[]} - A list of all the replies sorted in descending
 *                      order by date modified
 */
/**
 * Get replies by author.
 *
 * @name GET /api/replies?authorId=id
 *
 * @return {ReplyResponse[]} - An array of replies created by user with id, authorId
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
    const allReplies = await ReplyCollection.findAll();
    const response = allReplies.map(replyUtil.constructReplyResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await ReplyCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(replyUtil.constructReplyResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reply
 *
 * @name POST /api/replies
 *
 * @param {string} content - The content of the freet
 * @param {string} discussionId - The discussionId of the associated discussion
 * @return {ReplyResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 */
router.post(
  '/:discussionId?',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isValidReplyContent,
    discussionValidator.isDiscussionsByIdExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; 
    const discussionId = req.body.id;
    const reply = await ReplyCollection.addOne(userId, discussionId, req.body.content);

    res.status(201).json({
      message: 'Your reply was created successfully.',
      reply: replyUtil.constructReplyResponse(reply),
    
    });
  }
);

export {router as replyRouter};