import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['worker', 'recruiter'],
    required: true
  },
  profile: {
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    summary: {
      type: String,
      default: ''
    },
    resume: {
      type: String, // file path or URL
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    company: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Company'
    },
    profilePhoto: {
      type: String, // image path or URL
      default: ''
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
