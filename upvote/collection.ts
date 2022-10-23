import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from 'user/collection';
import type {Upvote} from './model';
import type {User} from '../user/model';
import UpvoteModel from './model';
import ReplyCollection from '../reply/collection';

class UpvoteCollection {
  /**
   * Add an upvote to the collection
   *
   * @param {string} replyId - The replyId of the upvote
   * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly created stampOfHumor
   */
  static async addOne(replyId: Types.ObjectId | string): Promise<HydratedDocument<Upvote>> {
    const upvote = new UpvoteModel({
      replyId,
    });
    await upvote.save();
    return upvote.populate('replyId');
  }

  /**
   * Find an upvote by replyId
   *
   * @param {string} replyId - The replyId of the upvote to find
   * @return {Promise<HydratedDocument<Upvote>> | Promise<null> } - The stampOfHumor with the given freetId, if any
   */
  static async findOne(replyId: Types.ObjectId | string): Promise<HydratedDocument<Upvote>> {
    return UpvoteModel.findOne({replyId: replyId}).populate('replyId');
  }

  /**
   * Get all the upvotes in the database
   *
   * @return {Promise<HydratedDocument<Upvote>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Upvote>>> {
    return UpvoteModel.find({}).populate('replyId');
  }

  /**
   * Get all the upvotes in a discussion
   *
   * @return {Promise<HydratedDocument<Upvote>[]>} - An array of all of the freets
   */
  // TODO: fix
  static async findAllByDiscussion(discussionId: Types.ObjectId | string): Promise<Array<HydratedDocument<Upvote>>> {
    const replies = await ReplyCollection.findAllByDiscussion(discussionId);
    const upvotes = Promise.all(replies.map((reply) => {
      const replyId = reply._id;
      return UpvoteCollection.findOne(replyId)
    }))

    return upvotes
    // return UpvoteModel.find({discussionId: discussionId}).populate('replyId');
  }

  /**
   * Update an upvote
   *
   * @param {string} upvoteId - The id of the upvote to be updated
   * @param {string} upvoter - The upvoter
   * @param {boolean} inc - Whether the upvote increments or not
   * @return {Promise<HydratedDocument<Upvote>>} - The newly updated stampOfHumor
   */
  static async updateOne(upvoteId: Types.ObjectId | string, upvoter: User, inc: boolean): Promise<HydratedDocument<Upvote>> {

    const upvote = await UpvoteModel.findOne({_id: upvoteId});
    if (inc) upvote.numUpvote = upvote.numUpvote + 1;
    else upvote.numUpvote = upvote.numUpvote - 1;
    
    upvote.upvoters.push(upvoter._id);
    await upvote.save();
    return upvote.populate('replyId');
  }

  /**
   * Delete an upote with given upvoteId.
   *
   * @param {string} upvoteId - The upvoteId of upvote to delete
   * @return {Promise<Boolean>} - true if the upvote has been deleted, false otherwise
   */
  static async deleteOne(upvoteId: Types.ObjectId | string): Promise<boolean> {
    const upvote = await UpvoteModel.deleteOne({_id: upvoteId});
    return upvote !== null;
  }
}

export default UpvoteCollection;
