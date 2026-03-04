// In your backend controller file
import { Workshop, Event, Project, Gallery, Sponsor, GalleryOption } from '../models/index.js';
import Team from '../models/Team.js';

const isVideoMedia = (item) => {
  if (item?.mediaType === 'video') return true;
  if (item?.src && typeof item.src === 'string') {
    const lowerSrc = item.src.toLowerCase();
    return (
      lowerSrc.endsWith('.mp4') || 
      lowerSrc.endsWith('.mov') || 
      lowerSrc.endsWith('.webm') || 
      lowerSrc.includes('/video/upload/')
    );
  }
  return false;
};
export const getHomeContent = async (req, res) => {
  try {
    // We fetch a larger limit (e.g., 10 or 20) to ensure that after filtering 
    // out videos, we still have enough images to meet your UI needs (e.g., 4).
    const [workshops, events, projects, rawGallery] = await Promise.all([
      Workshop.find().sort({ createdAt: -1 }).limit(3),
      Event.find({ status: { $in: ['upcoming', 'LIVE'] } }).sort({ targetDate: 1 }).limit(3),
      Project.find().sort({ createdAt: -1 }).limit(3),
      Gallery.find().sort({ createdAt: -1 }).limit(15), 
    ]);

    // Filter the gallery to exclude videos using your helper function
    const gallery = rawGallery
      .filter(item => !isVideoMedia(item))
      .slice(0, 4);

    const sponsor = await Sponsor.find({ tier: 'platinum' })
      .sort({ year: -1, createdAt: -1 })
      .lean();    

    res.json({ 
      workshops, 
      events, 
      projects, 
      gallery, 
      sponsor 
    });
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

// export const getTeam = async (req, res) => {
//   const { year } = req.query;
//   let query = {};
//   if (year) query.year = parseInt(year);
//   try {
//     const items = await Team.find(query).sort({ rank: 1, createdAt: -1 });
//     res.json(items);
//   } catch (err) { res.status(500).send("Server Error"); }
// };