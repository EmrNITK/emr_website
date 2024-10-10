import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { sendInvitations, acceptedInviteResponse, rejectedInviteResponse } from '../controllers/Invite.controller.js';


const inviteRouter = express.Router();

// invitation routes
inviteRouter.post('/:teamId', verifyJwt, sendInvitations);
inviteRouter.put('/:teamId/invite/:userId/accept', acceptedInviteResponse);
inviteRouter.post('/:teamId/invite/:userId/reject', rejectedInviteResponse);

export default inviteRouter;