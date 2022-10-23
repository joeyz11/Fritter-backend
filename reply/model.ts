import { Discussion } from 'discussion/model';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import UpvoteCollection from '../upvote/collection';
import type {User} from '../user/model';

// Type definition for Reply on the backend
export type Reply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  discussionId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;

};

export type PopulatedReply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  discussionId: Discussion;
  dateCreated: Date;
  content: string;
  dateModified: Date;

};

const ReplySchema = new Schema<Reply>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  discussionId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Discussion'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
});




const ReplyModel = model<Reply>('Reply', ReplySchema);
export default ReplyModel;
