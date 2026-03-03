import Form from '../models/Form.js'; // Adjust path to your model
import Response from '../models/Response.js';
import User from '../models/User.js';


export const submitFormResponse = async (req, res) => {
  try {
    const { id: formId } = req.params;
    const { answers, respondentEmail } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.settings.acceptingResponses) {
      return res.status(403).json({ message: "This form is no longer accepting responses." });
    }
    if (form.settings.limitToOneResponse && req.user) {
      const existing = await Response.findOne({ formId, respondentEmail: req.user.email });
      if (existing) {
        return res.status(403).json({ message: "You have already submitted a response." });
      }
    }

    // Calculate scores if quiz mode is on
    let totalScore = 0;
    let maxScore = 0;

    if (form.settings.isQuiz) {
      // Flatten all graded questions
      const allQuestions = form.sections.flatMap(s => s.elements).filter(el => el.isGraded);

      // Build a map of questionId -> question object for quick lookup
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      // For each answer, compute pointsEarned
      const scoredAnswers = answers.map(ans => {
        const q = questionMap.get(ans.questionId);
        if (!q) return { ...ans, pointsEarned: 0 };

        let earned = 0;
        // Logic depends on question type
        if (q.type === 'MULTIPLE_CHOICE' || q.type === 'DROPDOWN') {
          // answer.value is the selected option id
          const selectedOption = q.options.find(opt => opt.id === ans.value);
          if (selectedOption?.isCorrect) earned = q.points;
        } else if (q.type === 'CHECKBOXES') {
          // answer.value is array of selected option ids
          const correctOptionIds = q.options.filter(opt => opt.isCorrect).map(opt => opt.id);
          const selected = ans.value || [];
          // All correct options must be selected, no extra
          const allCorrectSelected = correctOptionIds.every(id => selected.includes(id));
          const noExtra = selected.every(id => correctOptionIds.includes(id));
          if (allCorrectSelected && noExtra) earned = q.points;
        } else if (q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') {
          // Simple exact match (or regex if you want)
          if (q.correctAnswer?.value && q.correctAnswer.value === ans.value) {
            earned = q.points;
          }
        }
        return { ...ans, pointsEarned: earned };
      });

      // Replace answers with scored ones
      answers.splice(0, answers.length, ...scoredAnswers);

      // Calculate totals
      totalScore = scoredAnswers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
      maxScore = allQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
    }

    const newResponse = new Response({
      formId,
      answers,
      respondentEmail: form.settings.collectEmails !== 'DO_NOT_COLLECT' ? respondentEmail : null,
      totalScore,
      maxScore
    });

    await newResponse.save();

    res.status(201).json({ 
      message: form.settings.confirmationMessage || "Your response has been recorded." 
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ message: "Server error submitting form" });
  }
};

// @desc    Create a new form
// @route   POST /api/forms
// @access  Private
export const createForm = async (req, res) => {
  try {
    const { title, description, settings, sections, collaborators } = req.body;

    const newForm = new Form({
      title,
      description,
      settings,
      sections,
      collaborators,
      userId: req.user.id // Assuming your auth middleware sets req.user
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ message: "Server error creating form", error: error.message });
  }
};

// @desc    Get all forms for the logged-in user (For the Dashboard)
// @route   GET /api/forms
// @access  Private
export const getForms = async (req, res) => {
  try {
    // We use .select() to only grab the fields needed for a list view to save bandwidth
    const forms = await Form.find({ userId: req.user.id })
                            .select('title description createdAt updatedAt settings.acceptingResponses')
                            .sort({ updatedAt: -1 });
    
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching forms" });
  }
};

// @desc    Get a single form by ID (For the Builder)
// @route   GET /api/forms/:id
// @access  Private
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!form) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    res.status(200).json(form);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(500).json({ message: "Server error fetching form" });
  }
};

// @desc    Get a public form for responding (No Auth Required)
// @route   GET /api/forms/public/:id
// @access  Public
export const getPublicForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.settings.acceptingResponses) {
      return res.status(403).json({ message: "This form is no longer accepting responses." });
    }

    // Strip out the userId before sending to the public frontend
    const formObj = form.toObject();
    delete formObj.userId;

    res.status(200).json(formObj);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching form" });
  }
};

// @desc    Update a form (Full Replace of nested data)
// @route   PUT /api/forms/:id
// @access  Private
export const updateForm = async (req, res) => {
  try {
    // findOneAndUpdate with { new: true } returns the updated document.
    // By passing req.body, Mongoose will completely overwrite the 'sections' array,
    // which handles all the drag-and-drop reordering natively.
    const updatedForm = await Form.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    res.status(200).json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ message: "Server error updating form", error: error.message });
  }
};

// @desc    Delete a form
// @route   DELETE /api/forms/:id
// @access  Private
export const deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting form" });
  }
};

export const getFormResponses2 = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Optional: check if the user owns the form
    const form = await Form.findOne({ _id: id });
    // console.log(form)
    if (!form) {
      return res.status(404).json({ message: "Form not found or unauthorized" });
    }

    const responses = await Response.find({formId: id }).sort({ submittedAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Response.findById(id);
    if (!response) return res.status(404).json({ message: "Response not found" });

    // Verify form ownership
    const form = await Form.findOne({ _id: response.formId, userId: req.user.id });
    if (!form) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await response.deleteOne();
    res.status(200).json({ message: "Response deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsersForAccess = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);
    
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ name: regex }, { rollNo: regex }, { email: regex }]
    })
      .limit(20)
      .select('name email rollNo profilePhoto');
      
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error searching users" });
  }
};
export const checkExistingSubmission = async (req, res) => {
    try {
        const { formId } = req.params;
        // Check if the current authenticated user has a response for this form
        const existingResponse = await Response.findOne({ formId, userId: req.user.id });
        
        res.status(200).json({ hasSubmitted: !!existingResponse });
    } catch (error) {
        res.status(500).json({ message: "Error checking submission status" });
    }
};