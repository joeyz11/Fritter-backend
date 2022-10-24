import { Discussion } from 'discussion/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Reply on the backend
export type Reply = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  discussionId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

export type PopulatedReply = {
  _id: Types.ObjectId;
  authorId: User;
  discussionId: Discussion;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

const ReplySchema = new Schema<Reply>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  discussionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Discussion'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  },
});

const ReplyModel = model<Reply>('Reply', ReplySchema);
export default ReplyModel;
