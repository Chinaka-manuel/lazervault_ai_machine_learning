import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import env from '../config/env.js';
import logger from './logger.js';
import { slugify } from './helpers.js';

const categories = [
  'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Python', 'TensorFlow',
  'PyTorch', 'Computer Vision', 'NLP', 'Data Science', 'Cyber Security',
  'Node.js', 'Express', 'React', 'MongoDB', 'JavaScript',
  'TypeScript', 'Docker', 'Kubernetes', 'Cloud Computing', 'Generative AI', 'LLMs', 'Prompt Engineering',
];

const products = [
  { title: 'Complete Machine Learning Bootcamp', type: 'course', price: 89, difficulty: 'beginner', description: 'Master ML from zero to hero with hands-on projects.' },
  { title: 'Deep Learning with PyTorch', type: 'course', price: 99, difficulty: 'advanced', description: 'Build neural networks and transformers with PyTorch.' },
  { title: 'Intro to Computer Vision', type: 'video', price: 19, difficulty: 'intermediate', description: 'Recorded lecture on image classification fundamentals.' },
  { title: 'NLP Class Snapshots', type: 'snapshot', price: 12, difficulty: 'intermediate', description: 'Slide snapshots covering tokenization and transformers.' },
  { title: 'Prompt Engineering Masterclass', type: 'course', price: 49, difficulty: 'beginner', description: 'Learn to craft effective prompts for LLMs.' },
  { title: 'Free Python Crash Course', type: 'video', price: 0, difficulty: 'beginner', description: 'A free intro to Python programming.', isFree: true },
];

const seed = async () => {
  await mongoose.connect(env.MONGODB_URI);
  logger.info('Connected for seeding');

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);

  const password = 'Password123';

  const admin = await User.create({ name: 'Site Admin', email: 'admin@lazervault.com', password, role: 'admin', isEmailVerified: true });
  const instructor = await User.create({ name: 'Dr. Ada Instructor', email: 'instructor@lazervault.com', password, role: 'instructor', isApprovedInstructor: true, isEmailVerified: true });
  await User.create({ name: 'Sam Student', email: 'student@lazervault.com', password, role: 'student', isEmailVerified: true });

  const cats = await Category.insertMany(categories.map((name) => ({ name, slug: slugify(name) })));

  const productDocs = products.map((p, i) => ({
    ...p,
    instructor: instructor._id,
    category: cats[i % cats.length]._id,
    thumbnail: '',
    slug: `${slugify(p.title)}-${Math.random().toString(36).slice(2, 6)}`,
    tags: [p.type, p.difficulty],
    language: 'English',
    publishedAt: new Date(),
  }));
  await Product.insertMany(productDocs);

  logger.info(`Seeded: 3 users, ${cats.length} categories, ${productDocs.length} products`);
  logger.info('Login with: admin@lazervault.com / Password123 (and instructor@ / student@)');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  logger.error('Seed failed', { error: err.message });
  process.exit(1);
});
