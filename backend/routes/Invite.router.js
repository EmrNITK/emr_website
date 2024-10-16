import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { sendInvitations, acceptInvitation, rejectInvitation } from '../controllers/Invite.controller.js';


const inviteRouter = express.Router();

// invitation routes
inviteRouter.post('/:teamId', verifyJwt, sendInvitations);
inviteRouter.get('/:teamId/invite/:userId/accept', acceptInvitation);
inviteRouter.get('/:teamId/invite/:userId/reject', rejectInvitation);

export default inviteRouter;