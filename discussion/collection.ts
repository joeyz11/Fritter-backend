import type {HydratedDocument, Types} from 'mongoose';
import type {Discussion} from './model';
import DiscussionModel from './model';

class DiscussionCollection {
  /**
   * Add a stampOfHumor to the collection
   *
   * @param {string} freetId - The freetId of the stamp of humor
   * @param {string} sentiment - Whether this freet is satirical or not
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
   * Find a stampOfHumor by freetId
   *
   * @param {string} freetId - The freetId of the stamp of humor to find
   * @return {Promise<HydratedDocument<Discussion>> | Promise<null> } - The stampOfHumor with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string, sentiment: string): Promise<HydratedDocument<Discussion>> {
    return DiscussionModel.findOne({freetId: freetId, sentiment: sentiment}).populate('freetId');
  }

  /**
   * Get all the stampOfHumors in the database
   *
   * @return {Promise<HydratedDocument<Discussion>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Discussion>>> {
    // Retrieves freets and sorts them from most to least recent
    return DiscussionModel.find({}).populate('freetId');
  }

  // /**
  //  * Update a stampOfHumor
  //  *
  //  * @param {string} stampOfHumorId - The id of the stampOfHumor to be updated
  //  * @param {boolean} isSatire - Whether the new freet is satical or not
  //  * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly updated stampOfHumor
  //  */
  // static async updateOne(discussionId: Types.ObjectId | string, isSatire: boolean): Promise<HydratedDocument<StampOfHumor>> {
  //   const discussion = await DiscussionModel.findOne({_id: discussionId});
  //   stampOfHumor.isSatire = isSatire; 
  //   await stampOfHumor.save();
  //   return stampOfHumor.populate('freetId');
  // }

  /**
   * Delete a stampOfHumor with given stampOfHumorId.
   *
   * @param {string} stampOfHumorId - The stampOfHumorId of stampOfHumor to delete
   * @return {Promise<Boolean>} - true if the stampOfHumor has been deleted, false otherwise
   */
  static async deleteOne(discussionId: Types.ObjectId | string): Promise<boolean> {
    const discussion = await DiscussionModel.deleteOne({_id: discussionId});
    return discussion !== null;
  }
}

export default DiscussionCollection;