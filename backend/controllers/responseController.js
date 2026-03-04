import Response from '../models/Response.js';
import Form from '../models/Form.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AccessRequest from '../models/AccessRequest.js';

/**
 * Internal Helper: Extracts user from cookie and checks form permissions
 * Returns the user object if authorized, otherwise throws an error
 */
const validateAccess = async (req, form) => {
  const token = req.cookies.token;
  if (!token) throw { status: 401, message: 'Unauthorized: No token provided' };

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password -otp -collegeOtp');
  if (!user) throw { status: 404, message: 'User not found' };

  const isAdmin = user.userType === 'admin' || user.userType === 'super-admin';
  const isOwner = form.userId.toString() === user._id.toString();
  const isCollaborator = form.collaborators.some(c => c.user.toString() === user._id.toString());

  if (!isAdmin && !isOwner && !isCollaborator) {
    throw { status: 403, message: 'Access Denied: Insufficient permissions' };
  }
  return user;
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    const token = req.cookies.token;
    if (!token) throw { status: 401, message: 'Unauthorized: No token provided' };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -otp -collegeOtp');
    if (!user) throw { status: 404, message: 'User not found' };
    const isAdmin = user.userType === 'admin' || user.userType === 'super-admin';
    const isOwner = form.userId.toString() === user._id.toString();
    const isCollaborator = form.collaborators.some(c => c.user.toString() === user._id.toString());

    if (!isAdmin && !isOwner && !isCollaborator) {
      const acReq =  await AccessRequest.findOne({ formId: req.params.id, userId :  decoded.id});
      if(acReq) throw { status: 405, message: 'Access Denied: Request Sent' };
      throw { status: 403, message: 'Access Denied: Insufficient permissions' };
    }
    res.json(form);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 50, sort = 'submittedAt', order = 'desc', ...filters } = req.query;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await validateAccess(req, form);

    const query = { formId };
    if (filters.respondentEmail) query.respondentEmail = new RegExp(filters.respondentEmail, 'i');
    if (filters.remark) query.remark = new RegExp(filters.remark, 'i');

    const responses = await Response.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Response.countDocuments(query);
    res.json({ responses, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const createBlankResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await validateAccess(req, form);

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
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { questionId, value } = req.body;

    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });

    const form = await Form.findById(response.formId);
    await validateAccess(req, form);

    const answerIndex = response.answers.findIndex(a => a.questionId === questionId);
    if (answerIndex >= 0) {
      response.answers[answerIndex].value = value;
    } else {
      response.answers.push({ questionId, value });
    }
    await response.save();
    res.json({ message: 'Answer updated', answers: response.answers });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateCoreField = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { fieldName, value } = req.body;

    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });

    const form = await Form.findById(response.formId);
    await validateAccess(req, form);

    const allowedFields = ['remark', 'color'];
    if (!allowedFields.includes(fieldName)) return res.status(400).json({ message: 'Invalid field' });

    response[fieldName] = value;
    await response.save();
    res.json({ message: `${fieldName} updated`, response });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const { responseId } = req.params;
    const response = await Response.findById(responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });

    const form = await Form.findById(response.formId);
    if (!form) return res.status(404).json({ message: 'Parent form not found' });

    await validateAccess(req, form);

    await response.deleteOne();
    res.json({ message: 'Response deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const requestAccess = async (req, res) => {
  try {
    const { id: formId } = req.params;
    const { message } = req.body;
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const form = await Form.findById(formId);

    if (!form) return res.status(404).json({ message: 'Form not found' });

    const acreq = new AccessRequest({
      formId,
      userId: decoded.id,
      message
    });

    await acreq.save();

    res.status(200).json({ message: 'Access request sent successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};