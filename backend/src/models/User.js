import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: 8 },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
    googleId: { type: String },
    githubId: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    refreshTokens: [{ type: String, select: false }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    isActive: { type: Boolean, default: true },
    isApprovedInstructor: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
