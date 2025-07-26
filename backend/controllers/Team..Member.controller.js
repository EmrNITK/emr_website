import TeamMember from "../models/TeamMember.model.js";

export const getTeamYears = async (req, res) => {
  try {
    const years = await TeamMember.distinct("year");
    years.sort((a, b) => b - a);
    res.json(years);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch years" });
  }
};

export const getTeamByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    if (!year) return res.status(400).json({ message: "Year is required" });
    const team = await TeamMember.find({ year }).sort({ order: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team" });
  }
};

export const createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: "Failed to create team member", error: err.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: "Failed to update team member", error: err.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete team member", error: err.message });
  }
};
