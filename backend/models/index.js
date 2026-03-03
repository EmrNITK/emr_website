import mongoose from 'mongoose';

// --- 1. UTILITY ---
const createSchema = (structure) => new mongoose.Schema(structure, { timestamps: true });


// Workshop Model
const Workshop = mongoose.model('Workshop', createSchema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  content: String,
  image: String,
  details: { date: String, time: String, venue: String, prereq: String },
  regLink: String,
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
  gallery: [String]
}));

// Event Model
const Event = mongoose.model('Event', createSchema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  tagline: String,
  description: String,
  content: String,
  status: { type: String, enum: ['upcoming', 'LIVE', 'completed'], default: 'upcoming' },
  targetDate: Date,
  image: String,
  rules: [String],
  prizes: [String],
  regLink: String,
  rulebooklink: String,
  gallery: [String]
}));

// Other Models
const GalleryOption = mongoose.model('GalleryOption', createSchema({ type: String, value: String }));
const Gallery = mongoose.model('Gallery', createSchema({ src: String, title: String, category: String, year: String, description: String }));
const Project = mongoose.model('Project', createSchema({ title: String, slug: String, status: String, image: String, description: String, techStack: [String], githubLink: String, demoLink: String }));
const Sponsor = mongoose.model('Sponsor', createSchema({ name: String, tier: { type: String, enum: ['platinum', 'gold', 'silver', 'bronze'], default: 'bronze' }, year: String, website: String, logo: String, description: String }));

// --- 4. EXPORTS ---

export const modelsMap = { 
  workshops: Workshop, 
  events: Event, 
  gallery: Gallery, 
  projects: Project, 
  sponsors: Sponsor, 
};

export { Workshop, Event, GalleryOption, Gallery, Project, Sponsor };