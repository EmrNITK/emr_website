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
    // 1. Aggregation pipeline for Events: 
    // Priorities: LIVE (1) > upcoming (2) > completed (3)
    const eventPromise = Event.aggregate([
      {
        $addFields: {
          sortPriority: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'LIVE'] }, then: 1 },
                { case: { $eq: ['$status', 'upcoming'] }, then: 2 },
                { case: { $eq: ['$status', 'completed'] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { sortPriority: 1, targetDate: 1 } },
      { $limit: 2 } // 2 total transfers
    ]);

    // 2. Aggregation pipeline for Workshops: 
    // Priorities: upcoming (1) > completed (2) (Note: Schema doesn't have 'LIVE')
    const workshopPromise = Workshop.aggregate([
      {
        $addFields: {
          sortPriority: {
            $cond: { if: { $eq: ['$status', 'upcoming'] }, then: 1, else: 2 }
          }
        }
      },
      { $sort: { sortPriority: 1, createdAt: -1 } },
      { $limit: 2 } // 2 total transfers
    ]);

    // 3. Fetch all data in parallel using Promise.all
    // Appended .lean() to standard queries for optimization
    const [workshops, events, projects, rawGallery, sponsor] = await Promise.all([
      workshopPromise,
      eventPromise,
      Project.find().sort({ createdAt: -1 }).limit(3).lean(),
      Gallery.find().sort({ createdAt: -1 }).limit(15).lean(),
      Sponsor.find({ tier: 'platinum' }).sort({ year: -1, createdAt: -1 }).lean()
    ]);

    // 4. Filter the gallery to exclude videos
    const gallery = rawGallery
      .filter(item => !isVideoMedia(item))
      .slice(0, 4);

    // 5. Build the 'current' array 
    // Pulls from the already fetched top-priority events and workshops to avoid extra DB calls
    const current = [
      ...events
        .filter(e => e.status === 'LIVE' || e.status === 'upcoming')
        .map(e => ({ ...e, collectionType: 'event' })), // Added type for frontend handling
      ...workshops
        .filter(w => w.status === 'upcoming')
        .map(w => ({ ...w, collectionType: 'workshop' }))
    ];

    res.json({
      workshops,
      events,
      projects,
      gallery,
      sponsor,
      current // Includes LIVE and upcoming items
    });

  } catch (err) {
    console.error("Home content fetch error:", err);
    res.status(500).json({ error: "Failed to fetch home content" });
  }
};

export const getGallery = async (req, res) => {
  const { page = 1, limit = 15, search, category, year } = req.query;
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