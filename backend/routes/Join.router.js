import express from 'express';
import { verifyJwt } from '../middlewares/auth.middlewares.js';
import { acceptJoinRequest, joinRequest, rejectJoinRequest } from '../controllers/Join.controller.js';

const joinRouter = express.Router();

joinRouter.post('/:teamId/join/', verifyJwt, joinRequest);
joinRouter.put('/:teamId/join/:memberId/accept', verifyJwt, acceptJoinRequest);
joinRouter.post('/:teamId/join/:memberId/reject', rejectJoinRequest);


export default joinRouter;