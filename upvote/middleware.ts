import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UpvoteCollection from './collection';

/**
 * Checks if a upvote with associated replyId exists
 */
const isUpvoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const replyId = req.params.replyId
  const validFormat = Types.ObjectId.isValid(replyId);  
  const upvote = validFormat ? await UpvoteCollection.findOne(replyId) : '';
  if (!upvote) {
    res.status(404).json({
      error: {
        upvoteNotFound: `Upvote with associated replyId ${replyId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user can upvote the reply
 */
const isValidUpvoteModifier = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId
  const replyId = req.params.replyId
  const upvote = await UpvoteCollection.findOne(replyId);

  for (const id of upvote.upvoters) {
    if (id.toString() === userId) {
      res.status(403).json({
        error: 'Cannot upvote a reply again.'
      });
      return;
    }
  }

  next();
};

export {
  isUpvoteExists,
  isValidUpvoteModifier
};
