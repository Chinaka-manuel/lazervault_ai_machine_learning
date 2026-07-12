import mongoose from 'mongoose';
import slugify from '../utils/helpers.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.pre('save', function setSlug(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
