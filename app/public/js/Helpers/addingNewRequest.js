
const addDevBody = async(name, surname, skillsInput, team) =>{
  let skills = [];
  let proficiencyNames = [];
  let skillArray = [];

  if(Array.isArray(skillsInput)){
    skills = skillsInput.map(item => {return item.split(" ")[0]});
    proficiencyNames = skillsInput.map(item => {return item.split(" ")[1]});
    skillArray = skills.map((skill, index) => {

      return {skillName: skill, proficiency: proficiencyNames[index]};
    })
  
  } else{
    skills = skillsInput.split(" ")[0];
    proficiencyNames = skillsInput.split(" ")[1];
    skillArray = [{skillName: skills, proficiency: proficiencyNames}];
  }

  if(!team) {
    team = {
      teamId: null
    };
  }

  const body = {
    firstName: name,
    lastName: surname,
    available: true, 
    teamId: team.teamId,
    skills: skillArray
  }
  return body;
}

module.exports = {
  addDevBody
}