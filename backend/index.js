import {
  dbHandler,
} from '../db/dbHandler.js';

import express from "express";

import bodyParser from 'body-parser';

import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const {
  insertNewDeveloper,
  getDevelopers,
  getDevelopersSkills,
  getRequests,
  getTeamLeads,
  getTeams,
  createRequest,
  getLoggedInTeamLead,
} = dbHandler();

const developers = getDevelopers();
console.log(developers);

const developerSkills = getDevelopersSkills();
console.log(developerSkills);

const requests = getRequests();
console.log(requests);

const teamLeads = getTeamLeads();
console.log(teamLeads);

const teams = getTeams();
console.log(teams);

const loggedIn = getLoggedInTeamLead("NicholasJoannouBBD");
console.log(loggedIn);

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("Application running on port: ", port);
});