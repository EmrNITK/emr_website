import express from 'express';
import {removeMember,addMember} from '../controllers/Member.controller.js';
import { verifyJwt } from '../middlewares/auth.middlewares.js';

const memberRouter = express.Router();

memberRouter.delete('/:teamId/members/:memberId',verifyJwt, removeMember);
memberRouter.put('/:teamId/members/:memberId',verifyJwt, addMember);

export default memberRouter;