// importing modules
import { model, Schema } from 'mongoose';

// defining signup user schema
const userInfoSchema = new Schema(
  {
    profileURL: { type: String, unique: true },
    locationInfo: { type: Object },
  },
  { timestamps: true }
);

// signupUserSchema.index({ expireAfterSeconds: 5000 });

// exporting schema
export const signupUser = model('user info', userInfoSchema);
