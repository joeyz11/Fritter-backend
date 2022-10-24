import type {HydratedDocument} from 'mongoose';
import type {Discussion, PopulatedDiscussion} from '../discussion/model';

type DiscussionResponse = {
  _id: string;
  freetId: string;
  sentiment: string;
};

export enum Sentiment {
  Support = 'support',
  Neutral = 'neutral',
  Oppose = 'oppose'
}

/**
 * Transform a raw Discussion object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Discussion>} discussion - A discussion
 * @returns {DiscussionResponse} - The discussion object formatted for the frontend
 */
const constructDiscussionResponse = (discussion: HydratedDocument<Discussion>): DiscussionResponse => {
  const discussionCopy: PopulatedDiscussion = {
    ...discussion.toObject({
      versionKey: false
    })
  };
  const {_id} = discussionCopy.freetId;
  return {
    ...discussionCopy,
    _id: discussionCopy._id.toString(),
    freetId: _id.toString(),
  };
};

export {
  constructDiscussionResponse
};