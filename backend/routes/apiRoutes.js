import express from 'express';
import auth from '../middleware/auth.js';
import * as publicCtrl from '../controllers/publicController.js';
import * as genericCtrl from '../controllers/genericController.js';
import { uploadImage } from '../controllers/uploadController.js';
import uploadMiddleware from '../middleware/upload.js';
import {
  createForm,
  getForms,
  getFormById,
  getPublicForm,
  updateForm,
  deleteForm,
  submitFormResponse,
  getFormResponses2
} from '../controllers/formController.js';

import * as responseController from '../controllers/responseController.js';

const router = express.Router();

// --- Auth Routes ---
import authRoutes from './authRoutes.js';
router.use('/', authRoutes);

// --- Upload Route ---
router.post('/upload', uploadMiddleware.single('file'), uploadImage);

// --- Public Specific Routes ---
router.get('/home-content', publicCtrl.getHomeContent);
router.get('/gallery', publicCtrl.getGallery);
router.get('/options', publicCtrl.getOptions);
router.get('/team/years', publicCtrl.getTeamYears);
router.get('/team', publicCtrl.getTeam);
router.post('/options', auth, genericCtrl.createOption);


// -- Form--
router.get('/forms/public/:id', getPublicForm); 
router.post('/forms/public/:id', submitFormResponse); 

router.route('/forms')
  .post(auth, createForm)
  .get(auth, getForms);

router.route('/forms/:id')
  .get(auth, getFormById)
  .put(auth, updateForm)
  .delete(auth, deleteForm);

// --- Generic CRUD Routes (Must be last to avoid collisions) ---
router.get('/:type', publicCtrl.getAll ? publicCtrl.getAll : genericCtrl.getAll); // Re-use generic getter
router.post('/:type', auth, genericCtrl.createItem);
router.put('/:type/:id', auth, genericCtrl.updateItem);
router.delete('/:type/:id', auth, genericCtrl.deleteItem);

router.get('/responses/form/:id', auth, getFormResponses2);

// router.get('/forms/:id', auth, responseController.getFormById);

// // Responses
router.get('/forms/:formId/responses', auth, responseController.getFormResponses);
// router.post('/forms/:formId/responses', auth, responseController.createBlankResponse);
// router.put('/responses/:responseId/answer', auth, responseController.updateAnswer);
// router.put('/responses/:responseId/custom', auth, responseController.updateCustomField);
// router.delete('/responses/:responseId', auth, responseController.deleteResponse);

// // Custom Columns
// router.get('/forms/:formId/custom-columns', auth, responseController.getCustomColumns);
// router.post('/forms/:formId/custom-columns', auth, responseController.addCustomColumn);
// router.delete('/forms/:formId/custom-columns/:columnName', auth, responseController.deleteCustomColumn);



export default router;