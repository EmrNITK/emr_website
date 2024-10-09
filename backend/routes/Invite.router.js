import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { sendInvitations } from '../controllers/Team.controller.js';
import { handleInvite } from '../controllers/Invite.controller.js';

const inviteRouter = express.Router();

// invitation routes
inviteRouter.post('/:teamId', verifyJwt, sendInvitations);
inviteRouter.put('/:teamId/invites/:inviteId', handleInvite);
// inviteId is the memberId of those who have been invited

export default inviteRouter;