const {
  getDevelopers,
  insertNewDeveloper,
  getDevelopersSkills,
  getRequests,
  getTeamLeads,
  getTeams,
  createRequest,
  getLoggedInTeamLead,
  closeDatabase,
  updateRequestStatus,
  getDevelopersWithAllInfo,
} = require('./db/dbHandler.js');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/developers', function (req, res) {
  getDevelopers().then(data => {
    res.send(data);
  });
});

app.get('/developers/skills', function (req, res) {
  getDevelopersSkills().then(data => {
    res.send(data);
  });
});

app.get('/requests', function (req, res) {
  getRequests().then(data => {
    res.send(data);
  });
});

app.get('/teamLeads', function (req, res) {
  getTeamLeads().then(data => {
    res.send(data);
  });
});

app.get('/teams', function (req, res) {
  getTeams().then(data => {
    res.send(data);
  });
});

app.get('/developers/all', function (req, res) {
  getDevelopersWithAllInfo().then(data => {
    res.send(data);
  });
});

app.get('/teamLead/loggedIn/:githubUsername', function (req, res) {
  getLoggedInTeamLead(req.params.githubUsername).then(data => {
    res.send(data);
  });
});

app.post('/requests/add', function (req, res) {
  try {
    createRequest(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(406).send(error);
  }
});

app.post('/developers/add', function (req, res) {
  try {
    insertNewDeveloper(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(406).send(error);
  }
});

app.put('/requests/update', function (req, res) {
  try {
    updateRequestStatus(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(406).send(error);
  }
});

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("Application running on port: ", port);
});