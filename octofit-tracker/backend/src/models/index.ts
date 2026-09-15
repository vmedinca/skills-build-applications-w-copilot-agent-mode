import mongoose, { Schema } from 'mongoose';

const objectId = Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: '' },
    team: { type: objectId, ref: 'Team', default: null },
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '', trim: true },
    members: [{ type: objectId, ref: 'User' }],
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    user: { type: objectId, ref: 'User', required: true },
    type: { type: String, enum: ['running', 'walking', 'strength', 'cycling', 'other'], required: true },
    duration: { type: Number, required: true, min: 1 },
    distance: { type: Number, default: 0, min: 0 },
    points: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema(
  {
    user: { type: objectId, ref: 'User', required: true },
    period: { type: String, required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);
leaderboardSchema.index({ user: 1, period: 1 }, { unique: true });

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['running', 'walking', 'strength', 'cycling', 'mobility'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    duration: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);