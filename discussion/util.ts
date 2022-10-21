import type {HydratedDocument} from 'mongoose';
import type {Discussion, PopulatedDiscussion} from '../discussion/model';

type DiscussionResponse = {
  _id: string;
  freetId: string;
  sentiment: string;
};

/**
 * Transform a raw StampOfHumor object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Discussion>} stampOfHumor - A stampOfHumor
 * @returns {DiscussionResponse} - The stampOfHumor object formatted for the frontend
 */
const constructDiscussionResponse = (discussion: HydratedDocument<Discussion>): DiscussionResponse => {
  const discussionCopy: PopulatedDiscussion = {
    ...discussion.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
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