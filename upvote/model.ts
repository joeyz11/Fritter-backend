import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Reply} from '../reply/model';

export type Upvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  replyId: Types.ObjectId;
  numUpvote: number;
  upvoters: Types.ObjectId[]
};

export type PopulatedUpvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  replyId: Reply;
  numUpvote: number;
  upvoters: Array<string>
};

const UpvoteSchema = new Schema<Upvote>({
  replyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Reply'
  },
  numUpvote: {
    type: Number,
    default: 0,
    required: true
  },
  upvoters: {
    type: [Schema.Types.ObjectId],
    required: true,
  }
});

const UpvoteModel = model<Upvote>('Upvote', UpvoteSchema);
export default UpvoteModel;
