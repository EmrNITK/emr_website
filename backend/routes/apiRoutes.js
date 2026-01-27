import express from 'express';
import auth from '../middleware/auth.js';
import * as publicCtrl from '../controllers/publicController.js';
import * as genericCtrl from '../controllers/genericController.js';
import { uploadImage } from '../controllers/uploadController.js';
import uploadMiddleware from '../middleware/upload.js';

const router = express.Router();

// --- Auth Routes ---
import authRoutes from './authRoutes.js';
router.use('/', authRoutes);

// --- Upload Route ---
router.post('/upload', auth, uploadMiddleware.single('file'), uploadImage);

// --- Public Specific Routes ---
router.get('/home-content', publicCtrl.getHomeContent);
router.get('/gallery', publicCtrl.getGallery);
router.get('/options', publicCtrl.getOptions);
router.get('/team/years', publicCtrl.getTeamYears);
router.get('/team', publicCtrl.getTeam);

// --- Protected Specific Routes ---
router.post('/options', auth, genericCtrl.createOption);

// --- Generic CRUD Routes (Must be last to avoid collisions) ---
router.get('/:type', publicCtrl.getAll ? publicCtrl.getAll : genericCtrl.getAll); // Re-use generic getter
router.post('/:type', auth, genericCtrl.createItem);
router.put('/:type/:id', auth, genericCtrl.updateItem);
router.delete('/:type/:id', auth, genericCtrl.deleteItem);

export default router;