CREATE TABLE team_leads (
  team_lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  github_username TEXT NOT NULL UNIQUE
);

CREATE TABLE teams (
  team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_name TEXT NOT NULL,
  team_lead_id INTEGER,
  FOREIGN KEY (team_lead_id) REFERENCES team_leads (team_lead_id)
);

CREATE TABLE developers (
  developer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  available BOOLEAN,
  team_id INTEGER,
  FOREIGN KEY (team_id) REFERENCES teams (team_id)
);

CREATE TABLE skills (
  skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  skill TEXT NOT NULL
);

CREATE TABLE proficiencies (
  proficiency_id INTEGER PRIMARY KEY AUTOINCREMENT,
  proficiency TEXT NOT NULL
);

CREATE TABLE developers_skills (
  developer_skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  developer_id INTEGER,
  skill_id INTEGER,
  proficiency_id INTEGER,
  FOREIGN KEY (developer_id) REFERENCES developers (developer_id),
  FOREIGN KEY (skill_id) REFERENCES skills (skill_id),
  FOREIGN KEY (proficiency_id) REFERENCES proficiencies (proficiency_id)
);

CREATE TABLE requests (
  request_id INTEGER PRIMARY KEY AUTOINCREMENT,
  developer_id INTEGER,
  team_lead_id INTEGER,
  start_datetime datetime,
  end_datetime datetime,
  status BOOLEAN,
  FOREIGN KEY (developer_id) REFERENCES developers (developer_id),
  FOREIGN KEY (team_lead_id) REFERENCES team_leads (team_lead_id)
);