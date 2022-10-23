import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Diversify = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  diversifiedFreets: Types.ObjectId[];
};

export type PopulatedDiversify = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  diversifiedFreets: Array<string>;
};


const DiversifySchema = new Schema<Diversify>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  diversifiedFreets: {
    type: [Schema.Types.ObjectId],
    required: true,
  }
});

const DiversifyModel = model<Diversify>('Diversify', DiversifySchema);
export default DiversifyModel;