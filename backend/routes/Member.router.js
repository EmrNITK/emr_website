import express from 'express';
import removeMember from '../controllers/Member.controller.js';

const memberRouter = express.Router();

memberRouter.delete('/:memberId',removeMember);

export default memberRouter;