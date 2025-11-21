import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;