import mongoose from 'mongoose';
import slugify from '../utils/helpers.js';

const productTypes = ['course', 'video', 'snapshot'];

const productSchema = new mongoose.Schema(
  {
    type: { type: String, enum: productTypes, required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    previewUrl: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    isFree: { type: Boolean, default: false },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    language: { type: String, default: 'English' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    resourceUrl: { type: String, default: '' },
    stock: { type: Number, default: null },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

productSchema.index({ title: 'text', tags: 'text', description: 'text' });
productSchema.pre('save', function setSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(`${this.title}-${Math.random().toString(36).slice(2, 6)}`);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
