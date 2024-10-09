import express from 'express';

const memberRouter = express.Router();

memberRouter.delete('/:memberId');

export default memberRouter;