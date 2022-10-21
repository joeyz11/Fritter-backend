import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

export type Discussion = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  sentiment: string
  // replies: Set<Types.ObjectId>;
};

export type PopulatedDiscussion = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  sentiment: string
  // replies: Set<string>;
};

const DiscussionSchema = new Schema<Discussion>({
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  sentiment: {
    type: String,
    required: true
  },
});

const DiscussionModel = model<Discussion>('Discussion', DiscussionSchema);
export default DiscussionModel;