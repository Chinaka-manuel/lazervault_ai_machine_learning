import 'dotenv/config';
import mongoose from 'mongoose';
import env from './src/config/env.js';
import Download from './src/models/Download.js';
(async () => {
  await mongoose.connect(env.MONGODB_URI);
  const total = await Download.countDocuments({});
  const byUser = await Download.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
  ]);
  console.log('total download records:', total);
  console.log('by user:', JSON.stringify(byUser));
  await mongoose.disconnect();
})();
