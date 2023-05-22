--Create statements
CREATE TABLE team_leads (
  team_lead_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  github_username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE teams (
  team_id INT PRIMARY KEY AUTO_INCREMENT,
  team_name VARCHAR(255) NOT NULL,
  team_lead_id INT,
  FOREIGN KEY (team_lead_id) REFERENCES team_leads (team_lead_id)
);

CREATE TABLE developers (
  developer_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  available BOOLEAN,
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES teams (team_id)
);

ALTER TABLE developers ALTER available SET DEFAULT true;

CREATE TABLE skills (
  skill_id INT PRIMARY KEY AUTO_INCREMENT,
  skill VARCHAR(255) NOT NULL
);

CREATE TABLE proficiencies (
  proficiency_id INT PRIMARY KEY AUTO_INCREMENT,
  proficiency VARCHAR(255) NOT NULL
);

CREATE TABLE developers_skills (
  developer_skill_id INT PRIMARY KEY AUTO_INCREMENT,
  developer_id INT,
  skill_id INT,
  proficiency_id INT,
  FOREIGN KEY (developer_id) REFERENCES developers (developer_id),
  FOREIGN KEY (skill_id) REFERENCES skills (skill_id),
  FOREIGN KEY (proficiency_id) REFERENCES proficiencies (proficiency_id)
);

CREATE TABLE requests (
  request_id INT PRIMARY KEY AUTO_INCREMENT,
  developer_id INT,
  team_lead_id INT,
  start_date DATE,
  end_date DATE,
  amount_of_hours INT,
  request_status VARCHAR(255) NOT NULL,
  FOREIGN KEY (developer_id) REFERENCES developers (developer_id),
  FOREIGN KEY (team_lead_id) REFERENCES team_leads (team_lead_id)
);

ALTER TABLE requests ALTER request_status SET DEFAULT "Pending";

--Adding mock data
INSERT INTO team_leads (first_name, last_name, github_username)
VALUES ('Nicholas', 'Joannou', 'NicholasJoannouBBD');

INSERT INTO team_leads (first_name, last_name, github_username)
VALUES ('Anne-Mien', 'Carr', 'AnneMienBBD');

INSERT INTO team_leads (first_name, last_name, github_username)
VALUES ('Steven', 'Pinto', 'StevenPintoBBD');

INSERT INTO team_leads (first_name, last_name, github_username)
VALUES ('Jared', 'Swanzen', 'JaredSwanzen');

INSERT INTO team_leads (first_name, last_name, github_username)
VALUES ('Charon', 'Kongolo', 'CharonK24');

INSERT INTO teams (team_name, team_lead_id)
VALUES ('Ozow', 1);

INSERT INTO teams (team_name, team_lead_id)
VALUES ('ATC', 2);

INSERT INTO teams (team_name, team_lead_id)
VALUES ('Vodacom', 3);

INSERT INTO teams (team_name, team_lead_id)
VALUES ('Shyft', 4);

INSERT INTO teams (team_name, team_lead_id)
VALUES ('SARS', 5);

INSERT INTO proficiencies (proficiency)
VALUES ('Beginner');

INSERT INTO proficiencies (proficiency)
VALUES ('Intermediate');

INSERT INTO proficiencies (proficiency)
VALUES ('Expert');

INSERT INTO skills (skill)
VALUES
('Java'),
('JavaScript'),
('C#'),
('C++'),
('React'),
('React Native'),
('Angular'),
('Python'),
('SQL'),
('NoSQL'),
('HTML'),
('CSS'),
('Node'),
('PHP'),
('Ruby'),
('Swift'),
('TypeScript'),
('Kotlin');

INSERT INTO developers (first_name,last_name,available,team_id)
VALUES
("Amelia", "Garcia", true, 1),
("Oliver", "Smith", true, 1),
("Evelyn", "Johnson", true, 1),
("Noah", "Brown", true, 1),
("Ava", "Taylor", true, 1),
("William", "Miller", true, 1),
("Sophia", "Anderson", true, 1),
("James", "Clark", true, 1),
("Isabella", "Martinez", true, 1),
("Liam", "Johnson", true, 2),
("Emma", "Smith", true, 2),
("Noah", "Brown", true, 2),
("Olivia", "Jones", true, 2),
("William", "Davis", true, 2),
("Sophia", "Anderson", true, 3),
("Ethan", "Martinez", true, 3),
("Isabella", "Garcia", true, 3),
("James", "Taylor", true, 3),
("Ava", "Clark", true, 3),
("Oliver", "Brown", true, 4),
("Charlotte", "Johnson", true, 4),
("Mason", "Smith", true, 4),
("Amelia", "Davis", true, 4),
("Lucas", "Wilson", true, 4),
("Liam", "Harris", true, 5),
("Charlotte", "King", true, 5),
("Benjamin", "Roberts", true, 5),
("Sophia", "Bell", true, 5),
("Mason", "Parker", true, 5);

INSERT INTO developers_skills (developer_id, skill_id, proficiency_id)
VALUES
(1, 7, 2),
(1, 10, 1),
(1, 3, 1),
(1, 15, 3),
(2, 7, 2),
(2, 10, 1),
(2, 3, 1),
(2, 15, 3),
(3, 12, 3),
(3, 5, 2),
(3, 9, 1),
(3, 18, 2),
(4, 13, 3),
(4, 2, 1),
(4, 6, 1),
(4, 8, 3),
(5, 16, 1),
(5, 11, 3),
(5, 4, 2),
(5, 17, 3),
(6, 14, 2),
(6, 1, 3),
(6, 7, 2),
(6, 10, 3),
(7, 3, 1),
(7, 15, 3),
(7, 12, 3),
(7, 5, 1),
(8, 18, 1),
(8, 13, 2),
(8, 2, 2),
(8, 6, 1),
(9, 16, 2),
(9, 11, 2),
(9, 4, 3),
(9, 17, 2),
(10, 14, 2),
(10, 1, 1),
(10, 7, 2),
(10, 10, 2),
(11, 3, 2),
(11, 15, 1),
(11, 12, 3),
(11, 5, 1),
(12, 18, 2),
(12, 13, 2),
(12, 2, 3),
(12, 6, 3),
(13, 16, 1),
(13, 11, 3),
(13, 4, 1),
(13, 17, 3),
(14, 14, 3),
(14, 1, 1),
(14, 7, 2),
(14, 10, 3),
(15, 3, 1),
(15, 15, 3),
(15, 12, 1),
(15, 5, 1),
(16, 18, 3),
(16, 13, 2),
(16, 2, 1),
(16, 6, 1),
(17, 16, 3),
(17, 11, 1),
(17, 4, 3),
(17, 17, 1),
(18, 14, 2),
(18, 1, 2),
(18, 7, 1),
(18, 10, 3),
(19, 3, 2),
(19, 15, 2),
(19, 12, 2),
(19, 5, 3),
(20, 18, 1),
(20, 13, 1),
(20, 2, 1),
(20, 6, 2),
(21, 16, 3),
(21, 11, 2),
(21, 4, 2),
(21, 17, 3),
(22, 14, 1),
(22, 1, 3),
(22, 7, 2),
(22, 10, 2),
(23, 3, 1),
(23, 15, 1),
(23, 12, 2),
(23, 5, 3),
(24, 18, 2),
(24, 13, 3),
(24, 2, 2),
(24, 6, 1),
(25, 16, 1),
(25, 11, 1),
(25, 4, 2),
(25, 17, 1),
(26, 14, 3),
(26, 1, 2),
(26, 7, 3),
(26, 10, 1),
(27, 3, 3),
(27, 15, 2),
(27, 12, 1),
(27, 5, 2),
(28, 18, 3),
(28, 13, 1),
(28, 2, 2),
(28, 6, 3),
(29, 16, 1),
(29, 11, 3),
(29, 4, 3),
(29, 17, 3);

INSERT INTO requests (developer_id, team_lead_id, start_date, end_date, amount_of_hours, request_status)
VALUES
(1, 1, '2023-05-22', '2023-05-22', 5,'Pending'),
(22, 2, '2023-05-24', '2023-05-28', 6,'Pending'),
(5, 3, '2023-05-24', '2023-05-28', 8,'Denied');