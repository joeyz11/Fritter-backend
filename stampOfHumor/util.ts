import type {HydratedDocument} from 'mongoose';
import type {StampOfHumor, PopulatedStampOfHumor} from '../stampOfHumor/model';

type StampOfHumorResponse = {
  _id: string;
  freetId: string;
  isSatire: boolean;
};

/**
 * Transform a raw StampOfHumor object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<StampOfHumor>} stampOfHumor - A stampOfHumor
 * @returns {StampOfHumorResponse} - The stampOfHumor object formatted for the frontend
 */
const constructStampOfHumorResponse = (stampOfHumor: HydratedDocument<StampOfHumor>): StampOfHumorResponse => {
  const stampOfHumorCopy: PopulatedStampOfHumor = {
    ...stampOfHumor.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id} = stampOfHumorCopy.freetId;
  return {
    ...stampOfHumorCopy,
    _id: stampOfHumorCopy._id.toString(),
    freetId: _id.toString(),
  };
};

export {
  constructStampOfHumorResponse
};
