import express from 'express';
import { getAllTeams, getTeamById, createTeam, updateTeam , rejectTeamRequest, acceptTeamRequest, JoinTeamRequest} from '../controllers/Team.controller.js';
import { verifyJwt } from '../middlewares/auth.middlewares.js';

const teamRouter = express.Router();

teamRouter.get('/', verifyJwt, getAllTeams);
teamRouter.get('/:teamId', verifyJwt, getTeamById);
teamRouter.post('/', verifyJwt, createTeam);
teamRouter.put('/:teamId/', verifyJwt, updateTeam);
teamRouter.post('/:teamId/join_request/:userId', verifyJwt, rejectTeamRequest);
teamRouter.put('/:teamId/join_request/:userId', verifyJwt, acceptTeamRequest);
teamRouter.post('/:teamId/join_request', verifyJwt, JoinTeamRequest);


export default teamRouter;
