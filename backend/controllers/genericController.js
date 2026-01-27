import { modelsMap, GalleryOption } from '../models/index.js';

// Get Generic
export const getAll = async (req, res) => {
  const Model = modelsMap[req.params.type];
  if (!Model) return res.status(404).send("Invalid type");
  const items = await Model.find().sort({ createdAt: -1 });
  res.json(items);
};

// Create Generic
export const createItem = async (req, res) => {
  const Model = modelsMap[req.params.type];
  if (!Model) return res.status(404).send("Invalid type");
  const newItem = new Model(req.body);
  await newItem.save();
  res.json(newItem);
};

// Update Generic
export const updateItem = async (req, res) => {
  const Model = modelsMap[req.params.type];
  if (!Model) return res.status(404).send("Invalid type");
  const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete Generic
export const deleteItem = async (req, res) => {
  const Model = modelsMap[req.params.type];
  if (!Model) return res.status(404).send("Invalid type");
  await Model.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// Create Gallery Option (Special case)
export const createOption = async (req, res) => {
  const { type, value } = req.body;
  try {
    const exists = await GalleryOption.findOne({ type, value });
    if (exists) return res.status(400).json({ error: "Option already exists" });
    const newOption = new GalleryOption({ type, value });
    await newOption.save();
    res.json(newOption);
  } catch (err) { res.status(500).json({ error: "Creation failed" }); }
};