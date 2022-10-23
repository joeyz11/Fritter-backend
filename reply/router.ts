import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as replyValidator from '../reply/middleware';
import * as upvoteValidator from '../upvote/middleware';
import * as discussionValidator from '../discussion/middleware';
import * as replyUtil from '../reply/util';
import * as upvoteUtil from '../upvote/util';
import ReplyCollection from '../reply/collection';
import UpvoteCollection from '../upvote/collection';

import type {HydratedDocument, Types} from 'mongoose';
import type {Upvote} from '../upvote/model';

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
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)
    // console.log('req.body', req.body)
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    if (req.query.discussionId === undefined) {

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

    const discussionId = (req.query.discussionId as string)
    const upvotesOfDiscussion = await UpvoteCollection.findAllByDiscussion(discussionId)

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
 * Delete a freet, associated stampOfHumor, and associated discussions
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in, or is not the author of
 *                 the freet or stampOfHumor
 * @throws {404} - If the freetId, stampOfHumorId, or any discussionIds are not valid
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
 * @name PUT /api/replies/:id
 *
 * @param {string} content - the new content for the freet
 * @return {ReplyResponse} - the updated freet, stampOfHumor, and discussions
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet or stampOfHumor
 * @throws {404} - If the freetId os stampOfHumorId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces, or if satire field is undefined
 * @throws {413} - If the freet content is more than 140 characters long
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