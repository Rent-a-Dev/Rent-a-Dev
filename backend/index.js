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

(async () => {

  const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port;
    console.log("Application running on port: ", port);
  });
})();