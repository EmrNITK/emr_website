import express from 'express';
import auth from '../middleware/auth.js';
import * as publicCtrl from '../controllers/publicController.js';
import * as genericCtrl from '../controllers/genericController.js';
import { uploadFile } from '../controllers/uploadController.js';
import uploadMiddleware from '../middleware/upload.js';
import {
  createForm,
  getForms,
  getFormById,
  getPublicForm,
  updateForm,
  deleteForm,
  submitFormResponse,
  getFormResponses2,
  searchUsersForAccess,
  checkExistingSubmission
} from '../controllers/formController.js';
import * as teamCtrl from '../controllers/teamController.js';
import * as responseController from '../controllers/responseController.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/', authRoutes);

router.post('/upload', uploadMiddleware.single('file'), uploadFile);

router.get('/home-content', publicCtrl.getHomeContent);
router.get('/gallery', publicCtrl.getGallery);
router.get('/options', publicCtrl.getOptions);
router.post('/options', auth, genericCtrl.createOption);

router.get('/team/years', publicCtrl.getTeamYears);
router.get('/team', teamCtrl.getTeam);
router.get('/team/search-users', auth, teamCtrl.searchUsers);
router.post('/team', auth, teamCtrl.createTeamMember);
router.put('/team/:id', auth, teamCtrl.updateTeamMember);

router.get('/responses/check/:id', checkExistingSubmission); 
router.get('/forms/public/:id', getPublicForm); 
router.post('/forms/public/:id', submitFormResponse); 
router.route('/forms')
  .post(auth, createForm)
  .get(auth, getForms);

router.route('/forms/:id')
  .get(auth, getFormById)
  .put(auth, updateForm)
  .delete(auth, deleteForm);

router.get('/responses/form/:id', auth, getFormResponses2);
router.get('/forms/users/search', auth, searchUsersForAccess);
router.get('/forms/:formId/responses', auth, responseController.getFormResponses);
router.post('/forms/:formId/responses', auth, responseController.createBlankResponse);
router.put('/responses/:responseId/answer', auth, responseController.updateAnswer);
router.put('/responses/:responseId/core', auth, responseController.updateCoreField);
router.delete('/responses/:responseId', auth, responseController.deleteResponse);

router.get('/:type', publicCtrl.getAll ? publicCtrl.getAll : genericCtrl.getAll);
router.post('/:type', auth, genericCtrl.createItem);
router.put('/:type/:id', auth, genericCtrl.updateItem);
router.delete('/:type/:id', auth, genericCtrl.deleteItem);

export default router;