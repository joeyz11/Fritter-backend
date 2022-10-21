import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Diversify = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  diversifiedFreets: string;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  diversifiedFreets: string;
};