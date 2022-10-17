import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {StampOfHumor, PopulatedStampOfHumor} from '../stampOfHumor/model';

// Update this if you add a property to the Freet type!
type StampOfHumorResponse = {
  _id: string;
  freetId: string;
  freetContent: string;
  isSatire: boolean;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<StampOfHumor>} freet - A freet
 * @returns {StampOfHumorResponse} - The freet object formatted for the frontend
 */
const constructStampOfHumorResponse = (stampOfHumor: HydratedDocument<StampOfHumor>): StampOfHumorResponse => {
  const stampOfHumorCopy: PopulatedStampOfHumor = {
    ...stampOfHumor.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id, content} = stampOfHumorCopy.freetId;
  console.log()
  return {
    ...stampOfHumorCopy,
    _id: stampOfHumorCopy._id.toString(),
    freetId: _id.toString(),
    freetContent: content,
  };
};

export {
  constructStampOfHumorResponse
};
