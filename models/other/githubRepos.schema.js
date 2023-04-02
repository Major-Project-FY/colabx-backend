// importing modules
import { model, Schema } from 'mongoose';

// defining signup user schema
const gitHubReposSchema = new Schema(
  {
    userID: { type: String },
    repoName: { type: String },
    repoFullName: { type: String },
    private: { type: Boolean },
    ownerUsername: { type: String },
    htmlURL: { type: String },
    description: { type: String },
    fork: { type: String },
    url: { type: String },
    forksURL: { type: String },
    collaborators: { type: Object },
    languages: { type: Object },
    contributors: { type: Object },
    repoCreatedAt: { type: Date },
    repoUpdatedAt: { type: Date },
    repoPushedAt: { type: Date },
    gitURL: { type: String },
    sshURL: { type: String },
    cloneIRL: { type: String },
    repoSize: { type: Number },
    mainLanguage: { type: String },
    forksCount: { type: Number },
    archived: { type: Boolean },
    disabled: { type: Boolean },
    openIssuesCount: { type: Number },
    license: { type: Object },
    allowForking: { type: Boolean },
    topics: { type: Array },
    visibility: { type: String },
    forks: { type: Number },
    defaultBranch: { type: String },
    permissions: { type: Object },
  },
  { timestamps: true }
);

// exporting schema
export const gitHubUserRepos = model('user repos', gitHubReposSchema);
