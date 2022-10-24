import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Diversify = {
  _id: Types.ObjectId;
  diversifiedFreets: Types.ObjectId[];
};

export type PopulatedDiversify = {
  _id: Types.ObjectId
  diversifiedFreets: Array<string>;
};

const DiversifySchema = new Schema<Diversify>({
  diversifiedFreets: {
    type: [Schema.Types.ObjectId],
    required: true,
  }
});

const DiversifyModel = model<Diversify>('Diversify', DiversifySchema);
export default DiversifyModel;