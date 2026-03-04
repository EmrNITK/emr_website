import mongoose from 'mongoose';

const accessRequestSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('AccessRequest', accessRequestSchema);