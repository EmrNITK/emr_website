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
  searchUsersForAccess,
  checkExistingSubmission,
  getAccessRequests,
  deleteAccessRequest,
  getFormResponses2
} from '../controllers/formController.js';
import * as teamCtrl from '../controllers/teamController.js';
import * as responseController from '../controllers/responseController.js';
import authRoutes from './authRoutes.js';
import { getAdmins, searchUsersForAdmin, updateAdminRole, removeAdminRole, createSetupSuperAdmin } from '../controllers/adminController.js';
import superAuth from '../middleware/superAuth.js';

const router = express.Router();

router.use('/', authRoutes);

// Public routes (no auth)
router.post('/upload', uploadMiddleware.single('file'), uploadFile);
router.get('/home-content', publicCtrl.getHomeContent);
router.get('/gallery', publicCtrl.getGallery);
router.get('/options', publicCtrl.getOptions);
router.get('/team/years', publicCtrl.getTeamYears);
router.get('/team', teamCtrl.getTeam);
router.get('/forms/public/:id', getPublicForm);
router.post('/forms/public/:id', submitFormResponse);

router.post('/options',auth, genericCtrl.createOption);
router.get('/team/search-users', teamCtrl.searchUsers);
router.post('/team',auth, teamCtrl.createTeamMember);
router.put('/team/:id',auth, teamCtrl.updateTeamMember);
router.delete('/team/:id',auth, teamCtrl.deleteTeamMember);

router.route('/forms')
  .post(auth,createForm)
  .get(auth,getForms);

router.route('/forms/:id')
  .get(getPublicForm)
  .put(auth, updateForm)
  .delete(auth, deleteForm);

router.get('/admin',superAuth, getAdmins);
router.get('/admin/search', searchUsersForAdmin);
router.put('/admin/:id',superAuth, updateAdminRole);
router.put('/admin/remove/:id',superAuth, removeAdminRole);
router.get('/admin/setup', createSetupSuperAdmin);


// Access requests
router.get('/forms/:id/access-requests',auth, getAccessRequests);
router.delete('/forms/access-requests/:requestId',auth, deleteAccessRequest); // fixed param name
router.post('/forms/:id/request-access', responseController.requestAccess);
router.get('/forms/users/search', searchUsersForAccess); // now protected
router.get('/responses/form/:id',auth, getFormResponses2); // now protected

// Responses
router.get('/responses/check/:formId', checkExistingSubmission); // fixed param
router.get('/forms/:formId/responses', responseController.getFormResponses);
router.post('/forms/:formId/responses', responseController.createBlankResponse);
router.put('/responses/:responseId/answer', responseController.updateAnswer);
router.put('/responses/:responseId/core', responseController.updateCoreField);
router.delete('/responses/:responseId', responseController.deleteResponse);
router.get('/responsepage/form/:id', responseController.getFormById);

// Generic CRUD (must be last)
router.get('/:type', publicCtrl.getAll || genericCtrl.getAll);
router.post('/:type',auth, genericCtrl.createItem);
router.put('/:type/:id',auth, genericCtrl.updateItem);
router.delete('/:type/:id',auth, genericCtrl.deleteItem);

export default router;