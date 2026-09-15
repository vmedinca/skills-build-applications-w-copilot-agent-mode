import { Router } from 'express';
import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const router = Router();

const isId = (value: string) => mongoose.Types.ObjectId.isValid(value);

function pointsForActivity(type: string, duration: number, distance: number) {
  const distancePoints = Math.round(distance * 10);
  const durationMultiplier = type === 'strength' ? 2 : 1;
  return Math.max(1, distancePoints + duration * durationMultiplier);
}

router.get('/users', async (_request, response, next) => {
  try {
    response.json(await User.find().populate('team', 'name').sort({ points: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (request, response, next) => {
  try {
    const user = await User.create(request.body);
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (request, response, next) => {
  try {
    if (!isId(request.params.id)) return response.status(400).json({ error: 'Invalid user id' });
    const user = await User.findById(request.params.id).populate('team', 'name description');
    if (!user) return response.status(404).json({ error: 'User not found' });
    response.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/teams', async (_request, response, next) => {
  try {
    response.json(await Team.find().populate('members', 'name email points').sort({ points: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/teams', async (request, response, next) => {
  try {
    response.status(201).json(await Team.create(request.body));
  } catch (error) {
    next(error);
  }
});

router.post('/teams/:teamId/members/:userId', async (request, response, next) => {
  try {
    const { teamId, userId } = request.params;
    if (!isId(teamId) || !isId(userId)) return response.status(400).json({ error: 'Invalid team or user id' });
    const [team, user] = await Promise.all([Team.findById(teamId), User.findById(userId)]);
    if (!team || !user) return response.status(404).json({ error: 'Team or user not found' });
    if (!team.members.some((member: mongoose.Types.ObjectId) => member.toString() === userId)) team.members.push(user._id);
    user.team = team._id;
    await Promise.all([team.save(), user.save()]);
    response.json(await team.populate('members', 'name email points'));
  } catch (error) {
    next(error);
  }
});

router.get('/activities', async (request, response, next) => {
  try {
    const filter = request.query.user && isId(String(request.query.user)) ? { user: request.query.user } : {};
    response.json(await Activity.find(filter).populate('user', 'name email').sort({ date: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/activities', async (request, response, next) => {
  try {
    const { user, type, duration, distance = 0, notes = '', date } = request.body;
    if (!isId(user) || !type || !Number.isFinite(Number(duration))) {
      return response.status(400).json({ error: 'user, type and numeric duration are required' });
    }
    const owner = await User.findById(user);
    if (!owner) return response.status(404).json({ error: 'User not found' });
    const points = pointsForActivity(type, Number(duration), Number(distance));
    const activity = await Activity.create({ user, type, duration, distance, points, notes, date });
    owner.points += points;
    await owner.save();
    if (owner.team) await Team.findByIdAndUpdate(owner.team, { $inc: { points } });
    response.status(201).json(await activity.populate('user', 'name email'));
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard', async (_request, response, next) => {
  try {
    const users = await User.find().populate('team', 'name').sort({ points: -1, name: 1 }).limit(50).lean();
    response.json(users.map((user, index) => ({ rank: index + 1, ...user })));
  } catch (error) {
    next(error);
  }
});

router.get('/workouts', async (request, response, next) => {
  try {
    const filter = request.query.type ? { type: String(request.query.type) } : {};
    response.json(await Workout.find(filter).sort({ difficulty: 1, name: 1 }));
  } catch (error) {
    next(error);
  }
});

router.get('/workouts/recommendations/:userId', async (request, response, next) => {
  try {
    if (!isId(request.params.userId)) return response.status(400).json({ error: 'Invalid user id' });
    const recent = await Activity.find({ user: request.params.userId }).sort({ date: -1 }).limit(5).lean();
    const recentTypes = recent.map((activity) => activity.type);
    const recommendation = await Workout.find({ type: { $nin: recentTypes } }).limit(3);
    response.json(recommendation.length ? recommendation : await Workout.find().limit(3));
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard/snapshots/:period', async (request, response, next) => {
  try {
    response.json(await Leaderboard.find({ period: request.params.period }).populate('user', 'name points').sort({ rank: 1 }));
  } catch (error) {
    next(error);
  }
});

export default router;