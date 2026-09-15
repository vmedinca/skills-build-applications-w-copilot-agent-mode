import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([User.deleteMany({}), Team.deleteMany({}), Activity.deleteMany({}), Leaderboard.deleteMany({}), Workout.deleteMany({})]);

    const [alex, sam] = await User.create([
      { name: 'Alex Rivera', email: 'alex@example.com', points: 120 },
      { name: 'Sam Lee', email: 'sam@example.com', points: 90 },
    ]);
    const team = await Team.create({ name: 'Trailblazers', description: 'Small steps, strong habits', members: [alex._id, sam._id], points: 210 });
    await User.updateMany({ _id: { $in: [alex._id, sam._id] } }, { team: team._id });
    await Activity.create([
      { user: alex._id, type: 'running', duration: 30, distance: 4, points: 70, notes: 'Morning run' },
      { user: sam._id, type: 'strength', duration: 45, distance: 0, points: 90, notes: 'Full body session' },
    ]);
    await Workout.create([
      { name: 'Easy Run', type: 'running', difficulty: 'beginner', duration: 25, description: 'A conversational pace run.', tags: ['cardio', 'outside'] },
      { name: 'Core Builder', type: 'strength', difficulty: 'intermediate', duration: 20, description: 'A focused bodyweight core session.', tags: ['core', 'bodyweight'] },
      { name: 'Recovery Walk', type: 'walking', difficulty: 'beginner', duration: 30, description: 'A relaxed walk to keep moving.', tags: ['recovery'] },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
