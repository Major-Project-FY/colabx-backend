// importing modules
import { model, Schema } from 'mongoose';

// defining signup user schema
const signupUserSchema = new Schema(
  {
    signupEmail: { type: String, unique: true },
    userOTP: { type: String },
    verifiedEmail: { type: Boolean },
    userIP: { type: String },
    createdAt: { type: Date, expires: 300, default: Date.now }
  },
  { timestamps: true }
);

// signupUserSchema.index({ expireAfterSeconds: 5000 });

// exporting schema
export const signupUser = model('signup users', signupUserSchema);
