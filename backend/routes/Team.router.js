import express from 'express';
import { getAllTeams, getTeamById, createTeam, updateTeam } from '../controllers/Team.controller.js';
import { verifyJwt } from '../middlewares/auth.middlewares.js';

const teamRouter = express.Router();

teamRouter.get('/', verifyJwt, getAllTeams);
teamRouter.get('/:teamId', verifyJwt, getTeamById);
teamRouter.post('/', verifyJwt, createTeam);
teamRouter.put('/:teamId/', verifyJwt, updateTeam);


export default teamRouter;
