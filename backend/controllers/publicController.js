import { Workshop, Event, Project, Gallery, Team, GalleryOption } from '../models/index.js';

export const getHomeContent = async (req, res) => {
  try {
    const [workshops, events, projects, gallery, latestTeamDoc] = await Promise.all([
      Workshop.find().sort({ createdAt: -1 }).limit(3),
      Event.find({ status: { $in: ['upcoming', 'LIVE'] } }).sort({ targetDate: 1 }).limit(3),
      Project.find().sort({ createdAt: -1 }).limit(3),
      Gallery.find().sort({ createdAt: -1 }).limit(4),
      Team.findOne().sort({ year: -1 })
    ]);

    let team = [];
    if (latestTeamDoc) {
      team = await Team.find({ year: latestTeamDoc.year }).sort({ rank: 1 }).limit(5);
    }
    res.json({ workshops, events, projects, gallery, team });
  } catch (err) {
    console.error("Home content fetch error:", err);
    res.status(500).json({ error: "Failed to fetch home content" });
  }
};

export const getGallery = async (req, res) => {
  const { page = 1, limit = 5, search, category, year } = req.query;
  let query = {};
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [{ title: searchRegex }, { description: searchRegex }, { category: searchRegex }, { year: searchRegex }];
  }
  if (category) query.category = category;
  if (year) query.year = year;

  try {
    const items = await Gallery.find(query)
      .sort({ year: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Gallery.countDocuments(query);
    res.json({ data: items, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).send("Server Error"); }
};

export const getOptions = async (req, res) => {
  try {
    const categories = await GalleryOption.find({ type: 'category' }).sort({ value: 1 });
    const years = await GalleryOption.find({ type: 'year' }).sort({ value: -1 });
    res.json({ categories, years });
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
};

export const getTeamYears = async (req, res) => {
  try {
    const years = await Team.distinct('year');
    res.json(years);
  } catch (err) { res.status(500).json({ error: "Failed to fetch years" }); }
};

export const getTeam = async (req, res) => {
  const { year } = req.query;
  let query = {};
  if (year) query.year = parseInt(year);
  try {
    const items = await Team.find(query).sort({ rank: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).send("Server Error"); }
};