import type {HydratedDocument} from 'mongoose';
import type {Diversify, PopulatedDiversify} from '../diversify/model';

type DiversifyResponse = {
  _id: string;
  userId: string;
};

/**
 * Transform a raw Diversify object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Diversify>} diversify - A diversify
 * @returns {DiversifyResponse} - The diversify object formatted for the frontend
 */
const constructDiversifyResponse = (diversify: HydratedDocument<Diversify>): DiversifyResponse => {
  const diversifyCopy: PopulatedDiversify = {
    ...diversify.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {_id} = diversifyCopy.userId;
  return {
    ...diversifyCopy,
    _id: diversifyCopy._id.toString(),
    userId: _id.toString(),
  };
};

export {
  constructDiversifyResponse
};