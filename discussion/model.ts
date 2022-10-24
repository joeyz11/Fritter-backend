import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

export type Discussion = {
  _id: Types.ObjectId;
  freetId: Types.ObjectId;
  sentiment: string;
  replies: Types.ObjectId[];
};

export type PopulatedDiscussion = {
  _id: Types.ObjectId;
  freetId: Freet;
  sentiment: string;
  replies: Array<string>;
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
  replies: {
    type: [Schema.Types.ObjectId],
    required: true,
  }
});

const DiscussionModel = model<Discussion>('Discussion', DiscussionSchema);
export default DiscussionModel;