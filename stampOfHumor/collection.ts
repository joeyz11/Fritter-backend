import type {HydratedDocument, Types} from 'mongoose';
import type {StampOfHumor} from './model';
import StampOfHumorModel from './model';

class StampOfHumorCollection {
  /**
   * Add a stamp of humor to the collection
   *
   * @param {string} freetId - The id of the freet of the stamp of humor
   * @param {boolean} isSatire
   * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly created freet
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
   * Find a stamp of humor by freetId
   *
   * @param {string} freetId - The freetId of the stamp of humor to find
   * @return {Promise<HydratedDocument<StampOfHumor>> | Promise<null> } - The stampOfHumor with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<StampOfHumor>> {
    return StampOfHumorModel.findOne({freetId: freetId}).populate('freetId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<StampOfHumor>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<StampOfHumor>>> {
    // Retrieves freets and sorts them from most to least recent
    return StampOfHumorModel.find({}).populate('freetId');
  }


  /**
   * Update a freet with the new content
   *
   * @param {string} stampOfHumorId - The id of the freet to be updated
   * @param {boolean} isSatire - The new content of the freet
   * @return {Promise<HydratedDocument<StampOfHumor>>} - The newly updated freet
   */
  static async updateOne(stampOfHumorId: Types.ObjectId | string, isSatire: boolean): Promise<HydratedDocument<StampOfHumor>> {
    const stampOfHumor = await StampOfHumorModel.findOne({_id: stampOfHumorId});
    stampOfHumor.isSatire = isSatire; 
    await stampOfHumor.save();
    return stampOfHumor.populate('freetId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} stampOfHumorId - The stampOfHumorId of stamp of humor to delete
   * @return {Promise<Boolean>} - true if the stamp of humor has been deleted, false otherwise
   */
  static async deleteOne(stampOfHumorId: Types.ObjectId | string): Promise<boolean> {
    const stampOfHumor = await StampOfHumorModel.deleteOne({_id: stampOfHumorId});
    return stampOfHumor !== null;
  }
}

export default StampOfHumorCollection;
