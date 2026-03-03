import Response from '../models/Response.js';
import Form from '../models/Form.js';

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 50, sort = 'submittedAt', order = 'desc', ...filters } = req.query;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const query = { formId };

    if (filters.respondentEmail) {
      query.respondentEmail = new RegExp(filters.respondentEmail, 'i');
    }
    if (filters.remark) {
      query.remark = new RegExp(filters.remark, 'i');
    }

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
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBlankResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const newResponse = new Response({
      formId,
      answers: [],
      respondentEmail: '',
      remark: '',
      color: 'bg-white'
    });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

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
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCoreField = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { fieldName, value } = req.body;

    const allowedFields = ['remark', 'color'];
    if (!allowedFields.includes(fieldName)) {
      return res.status(400).json({ message: 'Invalid field' });
    }

    const response = await Response.findByIdAndUpdate(
      responseId,
      { $set: { [fieldName]: value } },
      { new: true, runValidators: false } 
    );

    if (!response) return res.status(404).json({ message: 'Response not found' });

    res.json({ message: `${fieldName} updated`, response });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    console.log('hi')
    const response = await Response.findById(responseId);
        console.log('hi')

    if (!response) return res.status(404).json({ message: 'Response not found' });
    console.log('hi')

    const form = await Form.findById(response.formId);
        console.log('hi')

    if (!form) {
          console.log('hi')

      return res.status(403).json({ message: 'Unauthorized' });
          console.log('hi')

    }

    await response.deleteOne();
        console.log('hi')

    res.json({ message: 'Response deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};