import Form from '../models/Form.js';
import Response from '../models/Response.js';
import User from '../models/User.js';
import AccessRequest from '../models/AccessRequest.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

export const submitFormResponse = async (req, res) => {
  try {
    const { id: formId } = req.params;
    const { answers, respondentEmail, requestCopy } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    if (!form.settings.acceptingResponses) {
      return res.status(403).json({ message: "This form is no longer accepting responses." });
    }
    const token = req.cookies.token;
    let targetEmail = '';
    if (!token){
      if(respondentEmail){
        targetEmail = targetEmail;
      }
    }{
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password -otp -collegeOtp');
        if(user){
          targetEmail = user.email;
        }
      }
    if (form.settings.limitToOneResponse && targetEmail) {
      const existing = await Response.findOne({ formId, respondentEmail: targetEmail });
      if (existing) return res.status(403).json({ message: "You have already submitted a response." });
    }

    let totalScore = 0;
    let maxScore = 0;
    const allQuestions = form.sections.flatMap(s => s.elements);
    const gradedQuestions = allQuestions.filter(el => el.isGraded);
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));

    let scoredAnswers = answers;

    if (form.settings.isQuiz) {
      scoredAnswers = answers.map(ans => {
        const q = questionMap.get(ans.questionId);
        if (!q) return { ...ans, pointsEarned: 0 };

        let earned = 0;
        if (q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') {
          const selectedOption = q.options.find(opt => opt.id === ans.value);
          if (selectedOption?.isCorrect) earned = q.points;
        } else if (q.type === 'CHECKBOXES') {
          const correctOptionIds = q.options.filter(opt => opt.isCorrect).map(opt => opt.id);
          const selected = ans.value || [];
          const allCorrectSelected = correctOptionIds.every(id => selected.includes(id));
          const noExtra = selected.every(id => correctOptionIds.includes(id));
          if (allCorrectSelected && noExtra) earned = q.points;
        } else if (q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') {
          if (q.correctAnswer?.value && q.correctAnswer.value === ans.value) earned = q.points;
        }
        return { ...ans, pointsEarned: earned, isCorrect: earned > 0 && earned === q.points };
      });

      totalScore = scoredAnswers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
      maxScore = gradedQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
    }

    const newResponse = new Response({
      formId,
      userId: req.user ? req.user.id : null,
      answers: scoredAnswers,
      respondentEmail: form.settings.collectEmails !== 'DO_NOT_COLLECT' ? targetEmail : null,
      totalScore,
      maxScore
    });

    await newResponse.save();

    let sendEmailCopy = form.settings.sendResponderCopy === 'ON_SUBMIT' ||  requestCopy;
    let releaseImmediate = form.settings.isQuiz && form.settings.releaseGrades === 'IMMEDIATELY';
    if ((sendEmailCopy || releaseImmediate) && targetEmail) {
      let html = `<div style="font-family: sans-serif; color: #333;">`;
      html += `<h2 style="color: #0078d4;">${form.title}</h2>`;
      html += `<p>Thank you for your submission.</p>`;
      if (releaseImmediate) {
        html += `<h3 style="background: #f3f2f1; padding: 10px; border-radius: 5px;">Your Score: <strong>${totalScore} / ${maxScore}</strong></h3>`;
      }

      if (sendEmailCopy) {
        html += `<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />`;
        html += `<h3>Your Responses:</h3>`;
        
        scoredAnswers.forEach(ans => {
          const q = questionMap.get(ans.questionId);
          if (!q) return;

          html += `<div style="margin-bottom: 15px;">`;
          html += `<strong>${q.question}</strong>`;
          if (form.settings.showPointValues && form.settings.isQuiz) {
             html += ` <span style="font-size: 12px; color: #666;">(${ans.pointsEarned}/${q.points} pts)</span>`;
          }
          html += `<div style="margin-top: 5px; padding-left: 10px; border-left: 2px solid #ccc;">${Array.isArray(ans.value) ? ans.value.join(', ') : ans.value || '<em>No answer provided</em>'}</div>`;

          if (releaseImmediate) {
             if (form.settings.showMissedQuestions && !ans.isCorrect) {
                 html += `<div style="color: #d13438; font-size: 13px; margin-top: 4px;">❌ Incorrect</div>`;
             }
             if (form.settings.showCorrectAnswers && !ans.isCorrect && q.type !== 'TEXT_ONLY' && q.type !== 'FILE_UPLOAD') {
                 let correctText = "Check form owner for answer.";
                 if (q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN' || q.type === 'CHECKBOXES') {
                     const correctOpts = q.options.filter(o => o.isCorrect).map(o => o.text).join(', ');
                     if (correctOpts) correctText = correctOpts;
                 } else if (q.correctAnswer?.value) {
                     correctText = q.correctAnswer.value;
                 }
                 html += `<div style="color: #107c10; font-size: 13px; margin-top: 4px;">✅ Correct Answer: ${correctText}</div>`;
             }
          }
          html += `</div>`;
        });
      }
      html += `</div>`;
      
      sendEmail(targetEmail, `EmR: Your response to ${form.title}`, html).catch(err => console.error(err));
    }

    res.status(201).json({
      message: form.settings.confirmationMessage || "Your response has been recorded.",
      score: releaseImmediate ? { totalScore, maxScore } : null
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error submitting form" });
  }
};

export const createForm = async (req, res) => {
  try {
    const { title, description, settings, sections, collaborators } = req.body;

    const newForm = new Form({
      title,
      description,
      settings,
      sections,
      collaborators,
      userId: req.user.id
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: "Server error creating form", error: error.message });
  }
};

export const getPublicForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.settings.acceptingResponses) {
      return res.status(403).json({ message: "This form is no longer accepting responses." });
    }

    const formObj = form.toObject();
    delete formObj.userId;

    res.status(200).json(formObj);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching form" });
  }
};

export const updateForm = async (req, res) => {
  try {
    const updatedForm = await Form.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: "Server error updating form", error: error.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findOneAndDelete({ _id: req.params.id });

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting form" });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Response.findById(id);
    if (!response) return res.status(404).json({ message: "Response not found" });

    const form = await Form.findOne({ _id: response.formId });
    if (!form) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await response.deleteOne();
    res.status(200).json({ message: "Response deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find()
      .select('title description createdAt updatedAt settings.acceptingResponses')
      .sort({ updatedAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching forms" });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkExistingSubmission = async (req, res) => {
  try {
    const { formId } = req.params;
    const existing = await Response.findOne({ formId, respondentEmail: req.user.email });
    res.status(200).json({ hasSubmitted: !!existing });
  } catch (error) {
    res.status(500).json({ message: "Error checking submission" });
  }
};

export const getFormResponses2 = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id
    });
    if (!form) return res.status(404).json({ message: "Form not found" });

    const responses = await Response.find({ formId: req.params.id }).sort({ submittedAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAccessRequests = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    });
    if (!form) return res.status(404).json({ message: "Form not found" });

    const requests = await AccessRequest.find({ formId: req.params.id })
      .populate('userId', 'name email profilePhoto');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccessRequest = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const form = await Form.findOne({
      _id: request.formId,
      $or: [
        { userId: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    });
    if (!form) return res.status(403).json({ message: "Unauthorized" });

    await request.deleteOne();
    res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsersForAccess = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { rollNo: new RegExp(q, 'i') }
      ]
    }).limit(20).select('name email rollNo profilePhoto');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};