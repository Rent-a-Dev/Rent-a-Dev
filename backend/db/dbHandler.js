import {
  db,
} from './dbConfig.js';

import {
  requestStatuses,
} from '../enums/requests.js';

export const dbHandler = () => {

  const insertNewDeveloper = (firstName, lastName, available, teamId) => {

    let sql = `INSERT INTO developers (
      first_name,
      last_name,
      available,
      team_id
      VALUES (${firstName}, ${lastName}, ${available}, ${teamId})`;

    db.run(
      sql,
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log('Record inserted');
      });

  };

  const getDevelopers = () => {

    let sql = 'SELECT * FROM developers';

    let developers = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      developers.push({
        developerId: row.developer_id,
        firstName: row.first_name,
        lastName: row.last_name,
        available: row.available,
        teamId: row.team_id,
      });
    });

    return developers;
  };

  const getTeamLeads = () => {

    let sql = 'SELECT * FROM team_leads';

    let teamLeads = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      teamLeads.push({
        teamLeadId: row.team_lead_id,
        firstName: row.first_name,
        lastName: row.last_name,
        githubUsername: row.github_username,
      });
    });

    return teamLeads;
  };

  const getLoggedInTeamLead = (githubUsername) => {

    let sql = `SELECT * FROM team_leads WHERE github_username = \"${githubUsername}\"`;

    let teamLead = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      teamLead.push({
        teamLeadId: row.team_lead_id,
        firstName: row.first_name,
        lastName: row.last_name,
        githubUsername: row.github_username,
      });
    });

    return teamLead;
  };

  const getTeams = () => {

    let sql = 'SELECT * FROM teams';

    let teams = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      teams.push({
        teamId: row.team_id,
        teamName: row.team_name,
        teamLeadId: row.team_lead_id,
      });
    });

    return teams;
  };

  const getDevelopersSkills = () => {

    let sql = 'SELECT * FROM developers_skills';

    let developerSkills = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      developerSkills.push({
        developerSkillId: row.developer_skill_id,
        developerId: row.developer_id,
        skillId: row.skill_id,
        proficiencyId: row.proficiency_id,
      });
    });

    return developerSkills;
  };

  const getRequests = () => {

    let sql = 'SELECT * FROM requests';

    let requests = [];

    db.each(sql, function (err, row) {
      if (err) {
        return console.error(err.message);
      }
      requests.push({
        requestId: row.request_id,
        developerId: row.developer_id,
        teamLeadId: row.team_lead_id,
        startDateTime: row.start_datetime,
        endDateTime: row.end_datetime,
        requestStatus: row.request_status,
      });
    });

    return requests;
  };

  const createRequest = (developerId, teamLeadId, startDateTime, endDateTime, requestStatus) => {

    let sql = `INSERT INTO requests (
      developer_id,
      team_lead_id,
      start_datetime,
      end_datetime,
      request_status,
      VALUES (${developerId}, ${teamLeadId}, ${startDateTime}, ${endDateTime}, ${requestStatus})`;

    db.run(
      sql,
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log('Record inserted');
      });
  };

  const updateRequestStatus = (requestId, developerId, requestStatus) => {

    let sql = `UPDATE requests SET request_status = \"${requestStatus}\" WHERE request_id = ${requestId}`;

    db.run(
      sql,
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log('Record updated');
      });

    if (requestStatus === requestStatuses.Accepted) {

      sql = `UPDATE developers SET available = false WHERE developer_id = \"${developerId}\"`;

      db.run(
        sql,
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log('Record updated');
        });
    }

    if (requestStatus === requestStatuses.Denied) {

      sql = `UPDATE developers SET available = true WHERE developer_id = \"${developerId}\"`;

      db.run(
        sql,
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log('Record updated');
        });
    }

    if (requestStatus === requestStatuses.Pending) {

      sql = `UPDATE developers SET available = true WHERE developer_id = \"${developerId}\"`;

      db.run(
        sql,
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log('Record updated');
        });
    }
  };

  const closeDatabase = () => {

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  };

  return {
    insertNewDeveloper,
    getDevelopers,
    getDevelopersSkills,
    getRequests,
    getTeamLeads,
    getTeams,
    createRequest,
    getLoggedInTeamLead,
    closeDatabase,
    updateRequestStatus,
  };
};