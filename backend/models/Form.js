import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, default: '' },
  image: { type: String, default: '' },
  goToSection: { type: String, default: 'NEXT' },
  isCorrect: { type: Boolean, default: false },
  isOther: { type: Boolean, default: false }
}, { _id: false });

const ValidationSchema = new mongoose.Schema({
  regex: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  enabled: { type: Boolean, default: false }
}, { _id: false });

const FileRestrictionsSchema = new mongoose.Schema({
  allowedExtensions: { type: String, default: '' },
  maxSizeMB: { type: Number, default: 10 }
}, { _id: false });

const ConditionSchema = new mongoose.Schema({
  questionId: { type: String, default: '' },
  operator: { type: String, default: 'equals' },
  value: { type: String, default: '' }
}, { _id: false });

const CorrectAnswerSchema = new mongoose.Schema({
  type: { type: String, enum: ['exact', 'regex', 'multiple'], default: 'exact' },
  value: { type: mongoose.Schema.Types.Mixed, default: null }
}, { _id: false });

const ElementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  question: { type: String, default: '' },
  description: { type: String, default: '' },
  showDescription: { type: Boolean, default: false },
  shuffleOptions: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' },
  required: { type: Boolean, default: false },
  logicEnabled: { type: Boolean, default: false },
  options: [OptionSchema],
  points: { type: Number, default: 0 },
  isGraded: { type: Boolean, default: true },
  correctAnswer: CorrectAnswerSchema,
  validation: ValidationSchema,
  conditions: [ConditionSchema],
  fileRestrictions: FileRestrictionsSchema,
  shortInputType: { type: String, enum: ['', 'name', 'email', 'rollNo', 'collegeEmail', 'collegeName'], default: '' },
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  elements: [ElementSchema]
}, { _id: false });

const FormSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Form' },
  description: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  settings: {
    loginReq: {type: Boolean, default: false},
    requireNitkkrDomain: {type: Boolean, default: false},
    isQuiz: { type: Boolean, default: false },
    releaseGrades: { type: String, default: 'MANUALLY' },
    showMissedQuestions: { type: Boolean, default: true },
    showCorrectAnswers: { type: Boolean, default: true },
    showPointValues: { type: Boolean, default: true },
    defaultQuestionPoints: { type: Number, default: 0 },
    collectEmails: { type: String, default: 'DO_NOT_COLLECT' },
    sendResponderCopy: { type: String, default: 'OFF' },
    allowEditAfterSubmit: { type: Boolean, default: false },
    limitToOneResponse: { type: Boolean, default: false },
    acceptingResponses: { type: Boolean, default: true },
    showProgressBar: { type: Boolean, default: false },
    shuffleQuestionOrder: { type: Boolean, default: false },
    confirmationMessage: { type: String, default: 'Your response has been recorded.' }
  },
  sections: [SectionSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    profilePhoto: String
  }]
}, { timestamps: true });

export default mongoose.model('Form', FormSchema);