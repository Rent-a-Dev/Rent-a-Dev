const { db } = require('./dbConfig.js');
const { requestStatuses } = require('../enums/requests.js');

const insertNewDeveloper = async ({
  firstName,
  lastName,
  available,
  teamId,
}) => {
  if (typeof firstName === undefined || typeof lastName === undefined || typeof available === undefined || typeof teamId === undefined) {
    throw new Error('Values cannot be undefined')
  }

  let sql = `INSERT INTO developers (
      first_name,
      last_name,
      available,
      team_id)
      VALUES (\"${firstName}\", \"${lastName}\", ${available}, ${teamId})`;

  db.query(
    sql,
    function (err) {
      if (err) {
        throw err;
      }
      
      return;
    });
};

const getDevelopers = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM developers';

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapDevelopers(res);
    })
    .catch((err) => {
      return err;
    });
};

const getDevelopersWithTeamInfo = async () => {

  return new Promise(resolve => {

    let sql = `SELECT developers.developer_id, developers.available, developers.first_name, 
      developers.last_name, developers.team_id, teams.team_name, teams.team_lead_id,
      team_leads.first_name AS lead_first_name, team_leads.last_name AS lead_last_name,
      team_leads.github_username
      FROM developers
      JOIN teams
      ON developers.team_id = teams.team_id
      JOIN team_leads
      ON teams.team_lead_id = team_leads.team_lead_id`;

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapDevelopersWithTeamInfo(res);
    })
    .catch((err) => {
      return err;
    });
};

const getDevelopersWithAllInfo = async () => {

  return new Promise(resolve => {

    let sql = `SELECT developers.developer_id, skills.skill, proficiencies.proficiency
      FROM developers
      JOIN developers_skills
      ON developers.developer_id = developers_skills.developer_id
      JOIN skills
      ON developers_skills.skill_id = skills.skill_id
      JOIN proficiencies
      ON developers_skills.proficiency_id = proficiencies.proficiency_id`;

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then(async (res) => {
      let devWithSkills = mapDevelopersWithSkills(res);
      let originalDevelopers = await getDevelopersWithTeamInfo();

      for (let developer of originalDevelopers) {

        let skills = [];

        for (let devSkill of devWithSkills) {

          if (devSkill.developerId === developer.developerId) {
            skills.push({
              skill: devSkill.skill,
              proficiency: devSkill.proficiency,
            });
          }
        }
        developer['skills'] = skills;
      }
      return originalDevelopers;
    })
    .catch((err) => {
      return err;
    });
};

const getTeamLeads = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM team_leads';

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapTeamLeads(res);
    })
    .catch((err) => {
      return err;
    });
};

const getLoggedInTeamLead = async (githubUsername) => {

  return new Promise(resolve => {
    let sql = `SELECT * FROM team_leads WHERE github_username = \"${githubUsername}\"`;

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      let teamLead = {
        teamLeadId: res[0].team_lead_id,
        firstName: res[0].first_name,
        lastName: res[0].last_name,
        githubUsername: res[0].github_username,
      };

      return teamLead;
    })
    .catch((err) => {
      return err;
    });
};

const getTeams = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM teams';

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapTeams(res);
    })
    .catch((err) => {
      return err;
    });
};

const getDevelopersSkills = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM developers_skills';

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapDevSkills(res);
    })
    .catch((err) => {
      return err;
    });
};

const getRequests = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM requests';

    db.query(sql, (err, res) => {
      if (err) {
        return console.error(err.message);
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return mapRequests(res);
    })
    .catch((err) => {
      return err;
    });
};

const createRequest = async ({
  developerId,
  teamLeadId,
  startDate,
  endDate,
  amountOfHours,
  requestStatus,
}) => {

  if (typeof developerId === undefined || typeof teamLeadId === undefined || typeof startDate === undefined 
    || typeof endDate === undefined || typeof amountOfHours === undefined || typeof requestStatus === undefined) {
    
    throw new Error('Values cannot be undefined');
  }

  let sql = `INSERT INTO requests (
      developer_id,
      team_lead_id,
      start_date,
      end_date,
      amount_of_hours,
      request_status)
      VALUES (${developerId}, ${teamLeadId}, \"${startDate}\", \"${endDate}\", ${amountOfHours}, \"${requestStatus}\")`;

  db.query(
    sql,
    function (err) {
      if (err) {
        throw err;
      }

      return;
    });
};

const updateAvailability = async ({
  developerId,
  available,
}) => {
  return;
}

const updateRequestStatus = async ({
  requestId,
  developerId,
  requestStatus,
}) => {

  if (typeof requestId === undefined || typeof developerId === undefined || typeof requestStatus === undefined) {

    throw new Error('Values cannot be undefined');
  }

  let sql = `UPDATE requests SET request_status = \"${requestStatus}\" WHERE request_id = ${requestId}`;

  db.query(
    sql,
    function (err) {
      if (err) {
        throw err;
      }
    });

  if (requestStatus === requestStatuses.Accepted) {

    sql = `UPDATE developers SET available = false WHERE developer_id = ${developerId}`;

    db.query(
      sql,
      function (err) {
        if (err) {
          throw err;
        }
        return;
      });
  }

  if (requestStatus === requestStatuses.Denied) {

    sql = `UPDATE developers SET available = true WHERE developer_id = ${developerId}`;

    db.query(
      sql,
      function (err) {
        if (err) {
          return err;
        }
        return;
      });
  }

  if (requestStatus === requestStatuses.Pending) {

    sql = `UPDATE developers SET available = true WHERE developer_id = ${developerId}`;

    db.query(
      sql,
      function (err) {
        if (err) {
          return err;
        }
        return;
      });
  }
};

const closeDatabase = () => {

  db.end((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
};

const mapDevelopers = (developers) => {

  let mappedDevelopers = [];

  for (const dev of developers) {

    mappedDevelopers.push({
      developerId: dev.developer_id,
      firstName: dev.first_name,
      lastName: dev.last_name,
      available: dev.available,
      teamId: dev.team_id,
    });
  }

  return mappedDevelopers;
};

const mapDevelopersWithSkills = (devWithSkills) => {

  let mappedDevsWithSkills = [];

  for (const dev of devWithSkills) {
    mappedDevsWithSkills.push({
      developerId: dev.developer_id,
      skill: dev.skill,
      proficiency: dev.proficiency,
    });
  }

  return mappedDevsWithSkills;
};

const mapDevelopersWithTeamInfo = (devWithTeam) => {

  let mappedDevsWithTeam = [];

  for (const dev of devWithTeam) {
    mappedDevsWithTeam.push({
      developerId: dev.developer_id,
      firstName: dev.first_name,
      lastName: dev.last_name,
      available: dev.available,
      teamId: dev.team_id,
      teamName: dev.team_name,
      teamLeadId: dev.team_lead_id,
      teamLeadFirstName: dev.lead_first_name,
      teamLeadLastName: dev.lead_last_name,
      teamLeadGithubUsername: dev.github_username,
    });
  }

  return mappedDevsWithTeam;
};

const mapRequests = (requests) => {

  let mappedRequests = [];

  for (const req of requests) {

    mappedRequests.push({
      requestId: req.request_id,
      developerId: req.developer_id,
      teamLeadId: req.team_lead_id,
      startDate: req.start_date,
      endDate: req.end_date,
      amountOfHours: req.amount_of_hours,
      requestStatus: req.request_status,
    });
  }

  return mappedRequests;
};

const mapDevSkills = (devSkills) => {

  let mappedDevSkills = [];

  for (const devSkill of devSkills) {
    mappedDevSkills.push({
      developerSkillId: devSkill.developer_skill_id,
      developerId: devSkill.developer_id,
      skillId: devSkill.skill_id,
      proficiencyId: devSkill.proficiency_id,
    });
  }

  return mappedDevSkills;
};

const mapTeamLeads = (teamLeads) => {

  let mappedTeamLeads = [];

  for (const teamLead of teamLeads) {
    mappedTeamLeads.push({
      teamLeadId: teamLead.team_lead_id,
      firstName: teamLead.first_name,
      lastName: teamLead.last_name,
      githubUsername: teamLead.github_username,
    });
  }

  return mappedTeamLeads;
};

const mapTeams = (teams) => {

  let mappedTeams = [];

  for (const team of teams) {
    mappedTeams.push({
      teamId: team.team_id,
      teamName: team.team_name,
      teamLeadId: team.team_lead_id,
    });
  }

  return mappedTeams;
};

module.exports = {
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
  getLoggedInTeamLead,
};