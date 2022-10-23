import type {HydratedDocument} from 'mongoose';
import type {Upvote, PopulatedUpvote} from './model';

type UpvoteResponse = {
  _id: string;
  replyId: string;
  numUpvote: number;
};

/**
 * Transform a raw Upvote object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Upvote>} upvote - A upvote
 * @returns {UpvoteResponse} - The upvote object formatted for the frontend
 */
const constructUpvoteResponse = (upvote: HydratedDocument<Upvote>): UpvoteResponse => {
  const upvoteCopy: PopulatedUpvote = {
    ...upvote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id} = upvoteCopy.replyId;
  return {
    ...upvoteCopy,
    _id: upvoteCopy._id.toString(),
    replyId: _id.toString(),
  };
};

export {
  constructUpvoteResponse
};
