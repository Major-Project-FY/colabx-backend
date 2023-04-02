// importing modules
import { model, Schema } from 'mongoose';

// defining signup user schema
const userGitHubInfoSchema = new Schema(
  {
    userID: { type: String, unique: true, require: true },
    email: { type: String, unique: true, require: true },
    gitHubUsername: { type: String, unique: true, require: true },
    gitHubAvatarUrl: { type: String },
    url: { type: String },
    type: { type: String },
    name: { type: String },
    company: { type: String },
    location: { type: String },
    twitterUsername: { type: String },
    publicRepos: { type: Number },
    publicGists: { type: Number },
    followers: { type: Number },
    following: { type: Number },
    privateGists: { type: Number },
    totalPrivateRepos: { type: Number },
    ownedPrivateRepos: { type: Number },
    collaborators: { type: Number },
    twoFactorAuthentication: { type: Boolean },
  },
  { timestamps: true }
);

// signupUserSchema.index({ expireAfterSeconds: 5000 });

// exporting schema
export const gitHubUserInfo = model('user github infos', userGitHubInfoSchema);
