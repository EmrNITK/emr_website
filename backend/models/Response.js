import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed },   // string, array, etc.
  pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  submittedAt: { type: Date, default: Date.now },
  respondentEmail: { type: String, default: null },
  answers: [AnswerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Response', ResponseSchema);