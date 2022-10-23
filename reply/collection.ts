import type {HydratedDocument, Types} from 'mongoose';
import type {Reply} from './model';
import ReplyModel from './model';
import UserCollection from '../user/collection';
import DiscussionCollection from '../discussion/collection';

class ReplyCollection {
  /**
   * Add a reply to the collection
   *
   * @param {string} authorId - The id of the author of the reply
   * @param {string} discussionId - The id of the associated discussion of the reply
   * @param {string} content - The content of the reply
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, discussionId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Reply>> {
    const date = new Date();
    const reply = new ReplyModel({
      authorId,
      discussionId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await DiscussionCollection.addReplyTo(discussionId, reply)
    await reply.save();
    return reply.populate('authorId');
  }

  /**
   * Find a reply by replyId
   *
   * @param {string} replyId - The id of the reply to find
   * @return {Promise<HydratedDocument<Reply>> | Promise<null> } - The reply with the given replyId, if any
   */
  static async findOne(replyId: Types.ObjectId | string): Promise<HydratedDocument<Reply>> {
    return ReplyModel.findOne({_id: replyId}).populate('authorId');
  }

  /**
   * Get all the replies in the database
   *
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
   */
  static async findAll(): Promise<Array<HydratedDocument<Reply>>> {
    // Retrieves replies and sorts them from most to least recent
    return ReplyModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the replies by given author
   *
   * @param {string} username - The username of author of the reply
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reply>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReplyModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the replies in a given discussion
   *
   * @param {string} discussionId - The username of author of the reply
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
   */
    static async findAllByDiscussion(discussionId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reply>>> {
      const discussion = await DiscussionCollection.findOneById(discussionId);
      return ReplyModel.find({discussionId: discussion._id}).populate('authorId');
    }

  /**
   * Update a freet with the new content
   *
   * @param {string} replyId - The id of the reply to be updated
   * @param {string} content - The new content of the reply
   * @return {Promise<HydratedDocument<Reply>>} - The newly updated freet
   */
  static async updateOne(replyId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Reply>> {
    const reply = await ReplyModel.findOne({_id: replyId});
    reply.content = content;
    reply.dateModified = new Date();
    await reply.save();
    return reply.populate('authorId');
  }

  /**
   * Delete a reply with given replyId.
   *
   * @param {string} replyId - The replyId of reply to delete
   * @return {Promise<Boolean>} - true if the reply has been deleted, false otherwise
   */
  static async deleteOne(replyId: Types.ObjectId | string): Promise<boolean> {
    const reply = await ReplyCollection.findOne(replyId);
    
    const response = await ReplyModel.deleteOne({_id: replyId});
    await DiscussionCollection.deleteReplyFrom(reply)
    return response !== null;
  }

  /**
   * Delete all the reply in a given discussion
   *
   * @param {string} discussionId - The id of discussion
   */
  static async deleteManyByDiscussion(discussionId: Types.ObjectId | string): Promise<void> {
    await ReplyModel.deleteMany({discussionId});
  }
}

export default ReplyCollection;
