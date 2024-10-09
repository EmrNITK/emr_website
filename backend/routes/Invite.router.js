import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { sendInvitations, acceptedInviteResponse, rejectedInviteResponse } from '../controllers/Invite.controller.js';


const inviteRouter = express.Router();

// invitation routes
inviteRouter.post('/:teamId', verifyJwt, sendInvitations);
inviteRouter.put('/:teamId/invites/accept/:userId', acceptedInviteResponse);
inviteRouter.post('/:teamId/invites/reject/:userId', rejectedInviteResponse);

export default inviteRouter;