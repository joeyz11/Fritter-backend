// import type {HydratedDocument, Types} from 'mongoose';
// import { Diversify } from './model';

// class DiversifyCollection {
//   /**
//    * Populate diversified freets
//    *
//    * @return {Promise<HydratedDocument<Diversify>>} - The newly updated diversify
//    */
//   static async populateDiversify(): Promise<HydratedDocument<Diversify>> {
//     const freet = await FreetModel.findOne({_id: freetId});
//     freet.content = content;
//     freet.dateModified = new Date();
//     await freet.save();
//     return freet.populate('authorId');
//   }

//   /**
//    * Delete a freet with given freetId.
//    *
//    * @param {string} freetId - The freetId of freet to delete
//    * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
//    */
//   static async removeDiversify(): Promise<boolean> {
//     const freet = await FreetModel.deleteOne({_id: freetId});
//     return freet !== null;
//   }
// }

// export default DiversifyCollection;
