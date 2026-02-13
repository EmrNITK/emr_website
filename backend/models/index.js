import mongoose from 'mongoose';

const createSchema = (structure) => new mongoose.Schema(structure, { timestamps: true });

// ... existing imports

const Workshop = mongoose.model('Workshop', createSchema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // NEW: For routing /w/workshop-name
  description: String, // Short summary for cards
  content: String,     // NEW: Long form Markdown content
  image: String,       // Standardized from posterImg
  details: { 
    date: String, 
    time: String, 
    venue: String, 
    prereq: String 
  },
  regLink: String,
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
  gallery: [String]    // Optional: For post-event photos
}));

// ... rest of the models

// ... existing imports

const Event = mongoose.model('Event', createSchema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // NEW: URL friendly ID
  tagline: String,
  description: String, // Short summary
  content: String,     // NEW: Long form Markdown (Detailed Rules, etc.)
  status: { type: String, enum: ['upcoming', 'LIVE', 'completed'], default: 'upcoming' },
  targetDate: Date,
  image: String,       // Standardized from posterUrl
  rules: [String],     // Quick list of rules
  prizes: [String],    // Quick list of prizes
  regLink: String,
  rulebooklink: String,
  gallery: [String]    // Optional: Post-event photos
}));

// ... rest of models

const GalleryOption = mongoose.model('GalleryOption', createSchema({
  type: String, value: String
}));

const Gallery = mongoose.model('Gallery', createSchema({
  src: String, title: String, category: String, year: String, description: String
}));

const Project = mongoose.model('Project', createSchema({
  title: String, slug: String, status: String, image: String, description: String,
  techStack: [String], githubLink: String, demoLink: String
}));

const Sponsor = mongoose.model('Sponsor', createSchema({
  name: String,
  tier: { type: String, enum: ['platinum', 'gold', 'silver', 'bronze'], default: 'bronze' },
  year: String, website: String, logo: String, description: String
}));

const Team = mongoose.model('Team', createSchema({
  name: String, role: String, image: String,
  year: { type: Number, default: new Date().getFullYear() },
  rank: { type: Number, default: 99 },
  bio: String, linkedin: String, github: String, instagram: String
}));
export const modelsMap = { 
  workshops: Workshop, events: Event, gallery: Gallery, 
  projects: Project, sponsors: Sponsor, team: Team 
};

export { Workshop, Event, GalleryOption, Gallery, Project, Sponsor, Team };