import Team from '../models/Team.js';
import User from '../models/User.js'; // Ensure correct path to your User schema

// 1. Search Users for the Dropdown
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const regex = new RegExp(q, 'i');

        // Search top 20 users by name, rollNo, or email
        const users = await User.find({
            $or: [{ name: regex }, { rollNo: regex }, { email: regex }]
        })
            .limit(20)
            .select('name email rollNo profilePhoto');

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to search users" });
    }
};

// 2. Create Team Member (Handles both Existing Users & New Entries)
export const createTeamMember = async (req, res) => {
    try {
        const { isExistingUser, userId, name, role, year, rank, bio, linkedin, github, instagram, image } = req.body;

        let finalName = name;
        let finalImage = image;

        // If attaching an existing user, pull their verified data
        if (isExistingUser && userId) {
            const existingUser = await User.findById(userId);
            if (!existingUser) return res.status(404).json({ error: "User not found" });

            finalName = existingUser.name;
            // Use user's profile photo if no specific team image is provided
            finalImage = image || existingUser.profilePhoto;
        }

        const newTeamMember = new Team({
            userId: isExistingUser ? userId : null,
            name: finalName,
            role,
            image: finalImage,
            year,
            rank,
            bio,
            linkedin,
            github,
            instagram
        });

        await newTeamMember.save();
        res.status(201).json(newTeamMember);
    } catch (err) {
        res.status(500).json({ error: "Failed to create team member" });
    }
};

// 3. Update Team Member
export const updateTeamMember = async (req, res) => {
    try {
        // Standard update logic
        const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update" });
    }
};

export const getTeam = async (req, res) => {
    const { year } = req.query;
    let query = {};
    if (year) query.year = parseInt(year);

    try {
        // 1. Fetch team members.
        // 2. .populate() fetches linked User data. We only select specific fields to keep the payload tiny.
        // 3. .lean() makes the query incredibly fast by returning plain JSON objects instead of heavy Mongoose docs.
        const rawTeam = await Team.find(query)
            .sort({ rank: 1, createdAt: -1 })
            .populate('userId', 'name profilePhoto bio linkedin github instagram')
            .lean();

        // Transform the data to ensure the frontend gets a consistent, flat object
        const optimizedTeam = rawTeam.map(member => {

            // If this team member is linked to an existing User in the database
            if (member.userId) {
                return {
                    ...member,
                    userId: member.userId._id, // Keep the ID reference

                    // Prioritize the User's live profile data. If empty, fall back to what was saved in the Team document.
                    name: member.userId.name || member.name,
                    image: member.userId.profilePhoto || member.image,
                    bio: member.userId.bio || member.bio,
                    linkedin: member.userId.linkedin || member.linkedin,
                    github: member.userId.github || member.github,
                    instagram: member.userId.instagram || member.instagram,
                };
            }

            // If it's a standalone team member (created directly via "Create New"), just return it
            return member;
        });

        res.json(optimizedTeam);
    } catch (err) {
        console.error("Fetch Team Error:", err);
        res.status(500).json({ error: "Server Error fetching team" });
    }
};
// 4. Delete Team Member
export const deleteTeamMember = async (req, res) => {
    try {
        const deleted = await Team.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Team member not found" });
        }

        res.json({ message: "Team member deleted successfully", deleted });
    } catch (err) {
        console.error("Delete Team Error:", err);
        res.status(500).json({ error: "Failed to delete team member" });
    }
};