import Response from '../models/Response.js';
import Form from '../models/Form.js';

// -------------------- Form --------------------
// GET /api/forms/:id
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------- Responses --------------------
// GET /api/forms/:formId/responses?page=1&limit=50&sort=submittedAt&order=desc&filter[column]=value
export const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 50, sort = 'submittedAt', order = 'desc', ...filters } = req.query;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const query = { formId };

    // Apply filters
    if (filters.respondentEmail) {
      query.respondentEmail = new RegExp(filters.respondentEmail, 'i');
    }
    Object.keys(filters).forEach(key => {
      if (key.startsWith('customFields.')) {
        query[`customFields.${key.split('.')[1]}`] = filters[key];
      }
    });

    const responses = await Response.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Response.countDocuments(query);

    res.json({
      responses,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/forms/:formId/responses (create a blank response)
export const createBlankResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const newResponse = new Response({
      formId,
      answers: [],
      respondentEmail: '',
      customFields: {}
    });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/responses/:responseId/answer (update a specific answer)
export const updateAnswer = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { questionId, value } = req.body;

    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });

    const answerIndex = response.answers.findIndex(a => a.questionId === questionId);
    if (answerIndex >= 0) {
      response.answers[answerIndex].value = value;
    } else {
      response.answers.push({ questionId, value });
    }
    await response.save();

    res.json({ message: 'Answer updated', answers: response.answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/responses/:responseId/custom (update a custom field)
// PUT /api/responses/:responseId/custom (update a custom field)
export const updateCustomField = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { fieldName, value } = req.body;

    // Use findByIdAndUpdate to target ONLY the specific custom field key.
    // This bypasses full-document validation and is much faster.
    const response = await Response.findByIdAndUpdate(
      responseId,
      { $set: { [`customFields.${fieldName}`]: value } },
      { new: true, runValidators: false } 
    );

    if (!response) return res.status(404).json({ message: 'Response not found' });

    res.json({ message: 'Custom field updated', customFields: response.customFields });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/responses/:responseId
export const deleteResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });

    // Optional: verify ownership via form's userId
    const form = await Form.findById(response.formId);
    if (!form || form.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await response.deleteOne();
    res.json({ message: 'Response deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------- Custom Columns --------------------
// GET /api/forms/:formId/custom-columns
export const getCustomColumns = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId).select('customColumns');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form.customColumns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/forms/:formId/custom-columns
export const addCustomColumn = async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, type = 'text', color } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    if (form.customColumns.some(col => col.name === name)) {
      return res.status(400).json({ message: 'Column already exists' });
    }

    form.customColumns.push({ name, type, color });
    await form.save();

    res.json({ message: 'Custom column added', customColumns: form.customColumns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/forms/:formId/custom-columns/:columnName
export const deleteCustomColumn = async (req, res) => {
  try {
    const { formId, columnName } = req.params;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.customColumns = form.customColumns.filter(col => col.name !== columnName);
    await form.save();

    res.json({ message: 'Custom column deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};