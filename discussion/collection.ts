import type {HydratedDocument, Types} from 'mongoose';
import ReplyModel from '../reply/model';
import type {Reply} from '../reply/model';
import type {Discussion} from './model';
import DiscussionModel from './model';
import ReplyCollection from '../reply/collection';

class DiscussionCollection {
  /**
   * Add a discussion to the collection
   *
   * @param {string} freetId - The freetId of the discussion
   * @param {string} sentiment - The sentiment of this discussion
   * @return {Promise<HydratedDocument<Discussion>>} - The newly created stampOfHumor
   */
  static async addOne(freetId: Types.ObjectId | string, sentiment: string): Promise<HydratedDocument<Discussion>> {
    const discussion = new DiscussionModel({
      freetId,
      sentiment,
    });
    await discussion.save();
    return discussion.populate('freetId');
  }

  /**
   * Find a discussion by freetId
   *
   * @param {string} freetId - The freetId of the discussion to find
   * @return {Promise<HydratedDocument<Discussion>> | Promise<null> } - The discussion with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string, sentiment: string): Promise<HydratedDocument<Discussion>> {
    return DiscussionModel.findOne({freetId: freetId, sentiment: sentiment}).populate('freetId');
  }

  /**
   * Find a discussion by discussionId
   *
   * @param {string} discussionId - The discussionId of the discussion to find
   * @return {Promise<HydratedDocument<Discussion>> | Promise<null> } - The discussion with the given discussionId, if any
   */
    static async findOneById(discussionId: Types.ObjectId | string): Promise<HydratedDocument<Discussion>> {
      return DiscussionModel.findOne({_id: discussionId}).populate('freetId');
    }

  /**
   * Get all the discussions in the database
   *
   * @return {Promise<HydratedDocument<Discussion>[]>} - An array of all of the discussions
   */
  static async findAll(): Promise<Array<HydratedDocument<Discussion>>> {
    return DiscussionModel.find({}).populate('freetId');
  }

  /**
   * Add a reply to a discussion 
   *
   * @param {string} discussionId - The id of the discussion to be updated
   * @param {Reply} reply - The new reply to be added
   * @return {Promise<HydratedDocument<Discussion>>} - The newly updated discussion
   */
  static async addReplyTo(discussionId: Types.ObjectId | string, reply: Reply): Promise<HydratedDocument<Discussion>> {
    const discussion = await DiscussionModel.findOne({_id: discussionId});
    discussion.replies.push(reply._id); 
    await discussion.save();
    return discussion.populate('freetId');
  }

  /**
   * Delete a reply from a discussion 
   *
   * @param {Reply} reply - The reply to be deleted
   * @return {Promise<HydratedDocument<Discussion>>} - The newly updated discussion
   */
  static async deleteReplyFrom(reply: Reply): Promise<HydratedDocument<Discussion>> {
    const replyId = reply._id
    const discussionId = reply.discussionId
    const discussion = await DiscussionCollection.findOneById(discussionId);
    const newDiscussionReplies = discussion.replies.filter((id) => {
      id === replyId;
    });

    discussion.replies = newDiscussionReplies;
    await discussion.save();
    return discussion.populate('freetId');
  }

  /**
   * Delete a discussion with given discussionId
   *
   * @param {string} discussionId - The discussionId of discussion to delete
   * @return {Promise<Boolean>} - true if the discussion has been deleted, false otherwise
   */
  static async deleteOne(discussionId: Types.ObjectId | string): Promise<boolean> {
    const discussion = await DiscussionModel.deleteOne({_id: discussionId});
    return discussion !== null;
  }
}

export default DiscussionCollection;