import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

export type StampOfHumor = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  isSatire: boolean;
};

export type PopulatedStampOfHumor = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  isSatire: boolean;
};

const StampOfHumorSchema = new Schema<StampOfHumor>({
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  isSatire: {
    type: Boolean,
    required: true
  },
});

const StampOfHumorModel = model<StampOfHumor>('StampOfHumor', StampOfHumorSchema);
export default StampOfHumorModel;
