// importing modules
import { model, Schema } from 'mongoose';

// defining signup user schema
const signupUserSchema = new Schema(
  {
    signupEmail: { type: String },
    userOTP: { type: String },
    verifiedEmail: { type: Boolean },
    userIP: { type: String },
  },
  { timestamps: true }
);

signupUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// exporting schema
export const signupUser = model('signupUsers', signupUserSchema);
