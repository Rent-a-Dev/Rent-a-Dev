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

app.post('/requests/create', function (req, res) {
  createRequest(req.body);
});

app.post('/developers/add', function (req, res) {
  insertNewDeveloper(req.body);
});

app.put('/requests/update', function (req, res) {
  updateRequestStatus(req.body);
});

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("Application running on port: ", port);
});