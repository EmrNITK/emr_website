import express from 'express';
import removeMember from '../controllers/Member.controller.js';
import { verifyJwt } from '../middlewares/auth.middlewares.js';

const memberRouter = express.Router();

memberRouter.delete('/:teamId/members/:memberId',verifyJwt, removeMember);

export default memberRouter;