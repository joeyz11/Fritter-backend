import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DiscussionCollection from '../discussion/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a stampOfHumor with stampOfHumorId exists
 */
const isDiscussionsExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);  
  const discussions = validFormat ? await Promise.all([DiscussionCollection.findOne(req.params.freetId, 'support'), DiscussionCollection.findOne(req.params.freetId, 'neutral'), DiscussionCollection.findOne(req.params.freetId, 'oppose')]) : '';
  console.log('discussions exist', discussions)
  if (!discussions) {
    res.status(404).json({
      error: {
        discussionsNotFound: `Discussions with associated freetId ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose stampOfHumorId is associated
 */
const isValidDiscussionDeleter = async (req: Request, res: Response, next: NextFunction) => {
  const supportDiscussion = await DiscussionCollection.findOne(req.params.freetId, 'support');
  const neutralDiscussion = await DiscussionCollection.findOne(req.params.freetId, 'neutral');
  const opposeDiscussion = await DiscussionCollection.findOne(req.params.freetId, 'oppose');
  const idArr = [supportDiscussion.freetId._id, neutralDiscussion.freetId._id, opposeDiscussion.freetId._id]
  const sameId = idArr.every(idObj => {
    if (idObj.toString() === idArr[0].toString()) {
      return true;
    }
  })

  if (!sameId) {
    res.status(500).json({
      error: 'Discussions have differing freet ids.'
    });
    return;
  }

  const freetId = supportDiscussion.freetId._id;
  const freet = await FreetCollection.findOne(freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot delete other users\' discussions.'
    });
    return;
  }

  next();
};

export {
  isDiscussionsExists,
  isValidDiscussionDeleter,
};
