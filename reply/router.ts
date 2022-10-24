import type {NextFunction, Request, Response} from 'express';
import type {HydratedDocument, Types} from 'mongoose';
import type {Upvote} from '../upvote/model';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as replyValidator from '../reply/middleware';
import * as upvoteValidator from '../upvote/middleware';
import * as discussionValidator from '../discussion/middleware';
import * as replyUtil from '../reply/util';
import * as upvoteUtil from '../upvote/util';
import ReplyCollection from '../reply/collection';
import UpvoteCollection from '../upvote/collection';

const router = express.Router();

/**
 * Get all the replies
 *
 * @name GET /api/replies
 *
 * @return {ReplyResponse[]} - A list of all the replies
 */
/**
 * Get replies by discussion in decreasing order of upvotes
 *
 * @name GET /api/replies?discussionId=id
 *
 * @return {ReplyResponse[]} - An array of replies with discussionId
 * @throws {400} - If discussionId is not given
 * @throws {404} - If discussionId is invalid
 *
 */
/**
 * Get replies by author
 *
 * @name GET /api/replies?authorId=id
 *
 * @return {ReplyResponse[]} - An array of replies created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If authorId is invalid
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.author !== undefined) {
      next();
      return;
    }
    if (req.query.discussionId === undefined) {
      // get all replies
      const allReplies = await ReplyCollection.findAll();
      const response = await Promise.all(allReplies.map(async (reply) => {
      const replyId = reply._id.toString();
      const upvote = await UpvoteCollection.findOne(replyId);
      return ({
        reply: replyUtil.constructReplyResponse(reply),
        upvote: upvoteUtil.constructUpvoteResponse(upvote),
      })
      }));
      res.status(200).json(response);
      return;
    }
    // get replied from discussion
    const discussionId = (req.query.discussionId as string)
    const upvotesOfDiscussion = await UpvoteCollection.findAllByDiscussion(discussionId)

    // sort by descreasing numUpvote
    function upvoteBubbleSort(upvotes: Array<HydratedDocument<Upvote>>){
      //Outer pass
      for(let i = 0; i < upvotes.length; i++){
          //Inner pass
          for(let j = 0; j < upvotes.length - i - 1; j++){
              //Value comparison using descending order
              if(upvotes[j + 1].numUpvote > upvotes[j].numUpvote){
                  //Swapping
                  [upvotes[j + 1],upvotes[j]] = [upvotes[j],upvotes[j + 1]]
              }
          }
      };
      return upvotes;
    };

    const orderedUpvotesOfDiscussion = upvoteBubbleSort(upvotesOfDiscussion);
    const response = await Promise.all(orderedUpvotesOfDiscussion.map(async (upvote) => {
      const replyId = upvote.replyId;
      const reply = await ReplyCollection.findOne(replyId);
      return ({
        reply: replyUtil.constructReplyResponse(reply),
        upvote: upvoteUtil.constructUpvoteResponse(upvote),
      }) 
    }))
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    // get replies from author
    const authorReplies = await ReplyCollection.findAllByUsername(req.query.author as string);
    const response = await Promise.all(authorReplies.map(async (reply) => {
      const replyId = reply._id.toString();
      const upvote = await UpvoteCollection.findOne(replyId);
      return ({
        reply: replyUtil.constructReplyResponse(reply),
        upvote: upvoteUtil.constructUpvoteResponse(upvote),
      })
    }));
    res.status(200).json(response);
  }
);

/**
 * Create a new reply
 *
 * @name POST /api/replies/discussionId
 *
 * @param {string} content - The content of the freet
 * @param {string} discussionId - The discussionId of the associated discussion
 * @return {string} - A success message
 * @return {ReplyResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reply content is empty or a stream of empty spaces, or if discussionId is not given
 * @throws {404} = If discussionId is invalid
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
    // create reply
    const userId = (req.session.userId as string) ?? ''; 
    const discussionId = req.params.discussionId;
    const reply = await ReplyCollection.addOne(userId, discussionId, req.body.content);
    // create upvote
    const replyId = reply._id;
    const upvote = await UpvoteCollection.addOne(replyId)
    res.status(201).json({
      message: 'Your reply and upvote were created successfully.',
      reply: replyUtil.constructReplyResponse(reply),
      upvote: upvoteUtil.constructUpvoteResponse(upvote),
    });
  }
);

/**
 * Delete a reply
 *
 * @name DELETE /api/reply/:replyId
 *
 * @return {string} - A success message
 * @throws {400} - If replyId is not given
 * @throws {403} - If the user is not logged in, or user is not the author of the reply
 * @throws {404} - If the replyId are invalid
 */
router.delete(
  '/:replyId?',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    upvoteValidator.isUpvoteExists,
    replyValidator.isValidReplyModifier,
  ],
  async (req: Request, res: Response) => {
    const replyId = req.params.replyId 
    // delete upvote
    const upvote = await UpvoteCollection.findOne(replyId);
    const upvoteId = upvote._id;
    await UpvoteCollection.deleteOne(upvoteId);
    // delete reply
    await ReplyCollection.deleteOne(replyId);
    res.status(200).json({
      message: 'Your reply and upvote were deleted successfully.'
    });
  }
);


/**
 * Modify a reply
 *
 * @name PUT /api/replies/:replyId
 *
 * @param {string} content - the new content for the freet
 * @return {string} - A success message
 * @return {ReplyResponse} - the updated reply
 * @throws {403} - if the user is not logged in or not the author of the reply
 * @throws {404} - If the replyId is invalid
 * @throws {400} - If replyId is not given, or the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 */
router.put(
  '/:replyId?',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    replyValidator.isValidReplyModifier,
    replyValidator.isValidReplyContent,
  ],
  async (req: Request, res: Response) => {
    const replyId = req.params.replyId
    const content = req.body.content
    const reply = await ReplyCollection.updateOne(replyId, content);
    res.status(200).json({
      message: 'Your reply was updated successfully.',
      reply: replyUtil.constructReplyResponse(reply),
    });
  }
);

export {router as replyRouter};