import mongoose from 'mongoose';

const createSchema = (structure) => new mongoose.Schema(structure, { timestamps: true });

const Workshop = mongoose.model('Workshop', createSchema({
  title: String, subtitle: String, description: String,
  details: { date: String, time: String, venue: String, prereq: String },
  posterImg: String, tags: [String], regLink: String, section : String, gallery: String
}));

const Event = mongoose.model('Event', createSchema({
  title: String, tagline: String, status: String, targetDate: Date,
  posterUrl: String, description: String, rules: [String], prizes: [String],
  regLink: String, rulebooklink: String
}));

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