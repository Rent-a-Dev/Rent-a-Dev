const { db } = require('./dbConfig.js');
const { requestStatuses } = require('../enums/requests.js');

const insertNewDeveloper = async ({
  firstName,
  lastName,
  available,
  teamId,
  skills,
}) => {
  if (typeof firstName === undefined || typeof lastName === undefined || typeof available === undefined || typeof teamId === undefined) {
    throw new Error('Values cannot be undefined');
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

  if (!!skills) {

    for (const skill of skills) {

      try {
        const id = await getLastIdForDevelopers();
        const skillId = await getSkillIdByName(skill.skillName);
        const proficiencyId = await getProficiencyIdByName(skill.proficiency);
        
        let sql_skills = `INSERT INTO developers_skills (
          developer_id,
          skill_id,
          proficiency_id)
          VALUES (${id}, ${skillId}, ${proficiencyId})`;

          db.query(
            sql_skills,
            function (err) {
              if (err) {
            throw err;
          }
          
          return;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const getLastIdForDevelopers = async () => {
  return new Promise(resolve => {
    let sql = `SELECT developer_id FROM developers ORDER BY developer_id DESC LIMIT 1`;

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
      return res[0].developer_id;
    })
    .catch((err) => {
      return err;
    });
};

const getSkillIdByName = async (skillName) => {
  return new Promise(resolve => {
    let sql = `SELECT skill_id FROM skills where skill = \"${skillName}\"`;

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
      return res[0].skill_id;
    })
    .catch((err) => {
      return err;
    });
};

const getProficiencyIdByName = async (proficiency) => {
  return new Promise(resolve => {
    let sql = `SELECT proficiency_id FROM proficiencies where proficiency = "${proficiency}"`;

    db.query(sql, (err, res) => {
      if (err) {
        throw err;
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      return res[0].proficiency_id;
    })
    .catch((err) => {
      throw err;
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

const getOwnDevelopersWithTeamInfo = async (loggedInUser) => {

  return new Promise(resolve => {

    let sql = `SELECT developers.developer_id, developers.available, developers.first_name, 
      developers.last_name, developers.team_id, teams.team_name, teams.team_lead_id,
      team_leads.first_name AS lead_first_name, team_leads.last_name AS lead_last_name,
      team_leads.github_username
      FROM developers
      JOIN teams
      ON developers.team_id = teams.team_id
      JOIN team_leads
      ON teams.team_lead_id = team_leads.team_lead_id
      WHERE team_leads.github_username = \"${loggedInUser}\"`;

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

const getDevelopersWithTeamInfo = async (loggedInUser) => {

  return new Promise(resolve => {

    let sql = `SELECT developers.developer_id, developers.available, developers.first_name, 
      developers.last_name, developers.team_id, teams.team_name, teams.team_lead_id,
      team_leads.first_name AS lead_first_name, team_leads.last_name AS lead_last_name,
      team_leads.github_username
      FROM developers
      JOIN teams
      ON developers.team_id = teams.team_id
      JOIN team_leads
      ON teams.team_lead_id = team_leads.team_lead_id
      WHERE team_leads.github_username != \"${loggedInUser}\"
      AND developers.available = 1`;

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

const getDevelopersWithAllInfo = async (loggedInUser) => {

  return new Promise(resolve => {

    let sql = `SELECT d.developer_id, skills.skill, proficiencies.proficiency
    FROM developers d
    JOIN developers_skills
    ON d.developer_id = developers_skills.developer_id
    JOIN skills
    ON developers_skills.skill_id = skills.skill_id
    JOIN proficiencies
    ON developers_skills.proficiency_id = proficiencies.proficiency_id
    JOIN teams t
    ON d.team_id = t.team_id
    JOIN team_leads tl
    ON t.team_lead_id = tl.team_lead_id
    WHERE tl.github_username != \"${loggedInUser}\"
    AND d.available = 1`;

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
      let originalDevelopers = await getDevelopersWithTeamInfo(loggedInUser);

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

const getOwnDevelopersWithAllInfo = async (loggedInUser) => {

  return new Promise(resolve => {

    let sql = `SELECT d.developer_id, skills.skill, proficiencies.proficiency
      FROM developers d
      JOIN developers_skills
      ON d.developer_id = developers_skills.developer_id
      JOIN skills
      ON developers_skills.skill_id = skills.skill_id
      JOIN proficiencies
      ON developers_skills.proficiency_id = proficiencies.proficiency_id
      JOIN teams t
      ON d.team_id = t.team_id
      JOIN team_leads tl
      ON t.team_lead_id = tl.team_lead_id
      WHERE tl.github_username = \"${loggedInUser}\"`;

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
      let originalDevelopers = await getOwnDevelopersWithTeamInfo(loggedInUser);

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
    let sql = `SELECT * FROM team_leads WHERE github_username = "${githubUsername}"`;

    db.query(sql, (err, res) => {
      if (err) {
        throw err;
      } else {
        resolve(res);
      }
    }
    );
  })
    .then((res) => {
      let teamLead = {};

      if (Array.isArray(res) && res.length > 0) {
        
        teamLead = {
          teamLeadId: res[0].team_lead_id,
          firstName: res[0].first_name,
          lastName: res[0].last_name,
          githubUsername: res[0].github_username,
        };
      }

      return teamLead;
    })
    .catch((err) => {
      throw err;
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

const getSkills = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM skills';

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
      return mapSKills(res);
    })
    .catch((err) => {
      return err;
    });
};

const getProficiencies = async () => {

  return new Promise(resolve => {
    let sql = 'SELECT * FROM proficiencies';

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
      return mapProficiencies(res);
    })
    .catch((err) => {
      return err;
    });
};


const getRequestsWithNames = async (loggedInUser) => {

  return new Promise(resolve => {
    let sql = `SELECT r.request_id, r.developer_id, r.team_lead_id, r.start_date, r.end_date, r.amount_of_hours, r.request_status, 
    d.first_name AS devFirstName, d.last_name AS devLastName, tl.first_name AS leadRequestFirstName, tl.last_name AS leadRequestLastName,
    tlb.first_name AS leadFirstName, tlb.last_name AS leadLastName 
    FROM requests r 
    JOIN developers d 
    ON r.developer_id = d.developer_id
    JOIN teams t ON
    d.team_id = t.team_id
    JOIN team_leads tlb
    ON t.team_lead_id = tlb.team_lead_id
    JOIN team_leads tl 
    ON r.team_lead_id = tl.team_lead_id
    WHERE tl.github_username = \"${loggedInUser}\"
     `;

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
      return mapRequestsAll(res);
    })
    .catch((err) => {
      return err;
    });
};

const getOwnRequestsWithNames = async (loggedInUser) => {

  return new Promise(resolve => {
    let sql = `SELECT r.request_id, r.developer_id, r.team_lead_id, r.start_date, r.end_date, r.amount_of_hours, r.request_status, 
    d.first_name AS devFirstName, d.last_name AS devLastName, tl.first_name AS leadRequestFirstName, tl.last_name AS leadRequestLastName,
    tlb.first_name AS leadFirstName, tlb.last_name AS leadLastName 
    FROM requests r 
    JOIN developers d 
    ON r.developer_id = d.developer_id
    JOIN teams t ON
    d.team_id = t.team_id
    JOIN team_leads tlb
    ON t.team_lead_id = tlb.team_lead_id
    JOIN team_leads tl 
    ON r.team_lead_id = tl.team_lead_id
    WHERE tlb.github_username = \"${loggedInUser}\"
     `;

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
      return mapRequestsAll(res);
    })
    .catch((err) => {
      return err;
    });
};

const createTeamLead = async ({
  name,
  surname,
  loggedInUser
}) => {

  let sql = `INSERT INTO team_leads
      (first_name, last_name, github_username) 
      VALUES ("${name}", "${surname}", "${loggedInUser}")`;

  try {

    db.query(sql);
  } catch (error) {
    console.log(error);
    throw error;
  }

  let teamName = name + "'s Team";

  sql = `INSERT INTO teams
  (team_name, team_lead_id) 
  VALUES ("${teamName}", (SELECT team_lead_id FROM team_leads WHERE github_username = "${loggedInUser}"))`;

  try {

  db.query(sql);
  } catch (error) {
  console.log(error);
  throw error;
  }

};


const createRequest = async ({
  developerId,
  startDate,
  endDate,
  amountOfHours,
}, loggedInUser) => {

  if (developerId === undefined || startDate === undefined 
    || endDate === undefined || amountOfHours === undefined) {
    
    throw new Error('Values cannot be undefined');
  }

  let sql = `INSERT INTO requests (
      developer_id,
      team_lead_id,
      start_date,
      end_date,
      amount_of_hours)
      VALUES (${developerId}, (SELECT team_lead_id FROM team_leads WHERE github_username = \"${loggedInUser}\"), "${new Date(startDate).toISOString()}", "${new Date(endDate).toISOString()}", ${amountOfHours})`;

  try {

    db.query(sql);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateAvailability = async ({
  developerId,
  available,
}) => {
  let isAvailable;
  if (available == 'true'){
    isAvailable = 1
  }
  else{
    isAvailable = 0;
  }
  let sql = `UPDATE developers SET available = ${isAvailable} WHERE developer_id = \"${developerId}\"`;

  db.query(
    sql,
    function (err) {
      if (err) {
        throw err;
      }
    });
};

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

const mapRequestsAll = (requests) => {

  let mappedRequests = [];

  for (const req of requests) {

    mappedRequests.push({
      requestId: req.request_id,
      developerId: req.developer_id,
      teamLeadId: req.team_lead_id,
      startDate: (new Date(req.start_date)).toLocaleDateString(),
      endDate: (new Date(req.end_date)).toLocaleDateString(),
      amountOfHours: req.amount_of_hours,
      requestStatus: req.request_status,
      devFirstName: req.devFirstName,
      devLastName: req.devLastName,
      leadFirstName: req.leadFirstName,
      leadLastName: req.leadLastName,
      leadRequestFirstName: req.leadRequestFirstName, 
      leadRequestLastName: req.leadRequestLastName,
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

const mapSKills = (skills) => {

  let mappedSkills = [];

  for (const skill of skills) {

    mappedSkills.push({
      skillId: skill.skill_id,
      skill: skill.skill,
    });
  }

  return mappedSkills;
};

const mapProficiencies = (proficiencies) => {

  let mappedProficiencies = [];

  for (const proficiency of proficiencies) {

    mappedProficiencies.push({
      proficiencyId: proficiency.proficiency_id,
      proficiency: proficiency.proficiency,
    });
  }

  return mappedProficiencies;
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
  getRequestsWithNames,
  getSkills,
  getProficiencies,
  getOwnRequestsWithNames,
  updateAvailability,
  getOwnDevelopersWithAllInfo,
  createTeamLead, 
};