import type {HydratedDocument, Types} from 'mongoose';
import type {StampOfHumor} from './model';
import StampOfHumorModel from './model';

class StampOfHumorCollection {
  /**
   * Add a stampOfHumor to the collection
   *
   * @param {string} freetId - The freetId of the stamp of humor
   * @param {boolean} isSatire - Whether this freet is satirical or not
   * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly created stampOfHumor
   */
  static async addOne(freetId: Types.ObjectId | string, isSatire: boolean): Promise<HydratedDocument<StampOfHumor>> {
    const stampOfHumor = new StampOfHumorModel({
      freetId,
      isSatire,
    });
    await stampOfHumor.save();
    return stampOfHumor.populate('freetId');
  }

  /**
   * Find a stampOfHumor by freetId
   *
   * @param {string} freetId - The freetId of the stamp of humor to find
   * @return {Promise<HydratedDocument<StampOfHumor>> | Promise<null> } - The stampOfHumor with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<StampOfHumor>> {
    return StampOfHumorModel.findOne({freetId: freetId}).populate('freetId');
  }

  /**
   * Get all the stampOfHumors in the database
   *
   * @return {Promise<HydratedDocument<StampOfHumor>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<StampOfHumor>>> {
    // Retrieves freets and sorts them from most to least recent
    return StampOfHumorModel.find({}).populate('freetId');
  }

  /**
   * Update a stampOfHumor
   *
   * @param {string} stampOfHumorId - The id of the stampOfHumor to be updated
   * @param {boolean} isSatire - Whether the new freet is satical or not
   * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly updated stampOfHumor
   */
  static async updateOne(stampOfHumorId: Types.ObjectId | string, isSatire: boolean): Promise<HydratedDocument<StampOfHumor>> {
    const stampOfHumor = await StampOfHumorModel.findOne({_id: stampOfHumorId});
    stampOfHumor.isSatire = isSatire; 
    await stampOfHumor.save();
    return stampOfHumor.populate('freetId');
  }

  /**
   * Delete a stampOfHumor with given stampOfHumorId.
   *
   * @param {string} stampOfHumorId - The stampOfHumorId of stampOfHumor to delete
   * @return {Promise<Boolean>} - true if the stampOfHumor has been deleted, false otherwise
   */
  static async deleteOne(stampOfHumorId: Types.ObjectId | string): Promise<boolean> {
    const stampOfHumor = await StampOfHumorModel.deleteOne({_id: stampOfHumorId});
    return stampOfHumor !== null;
  }
}

export default StampOfHumorCollection;
