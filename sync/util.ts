import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import { PopulatedStampOfHumor, StampOfHumor } from 'stampOfHumor/model';

// Update this if you add a property to the Freet type!
type FreetAndStampOfHumorResponse = {
  freet: Object,
  stampOfHumor: Object
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetAndStampOfHumorResponse = (freet: HydratedDocument<Freet>, stampOfHumor: HydratedDocument<StampOfHumor>): FreetAndStampOfHumorResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;

  const stampOfHumorCopy: PopulatedStampOfHumor = {
    ...stampOfHumor.toObject({
      versionKey: false
    })
  };

  return {
    freet: freetCopy,
    stampOfHumor: stampOfHumorCopy
  };
};

export {
  constructFreetAndStampOfHumorResponse
};
