const populateSearchAndFilter = (data, skillsAll) => {
  const teamNames = Array.from(new Set(data.map(team => {return team.teamName})));
  const leadNames = Array.from(new Set(data.map(lead => {return `${lead.teamLeadFirstName} ${lead.teamLeadLastName}`})));
  const skillNames = Array.from(new Set(data.map(skill => {return (skill.skills).map(item => {return item.skill})}).flat(1)));

  let skillsInputData = [];
  if(skillsAll){
    skillsInputData = skillsAll.skillNames.map(skill => {
  
      let skillWithProficiencies = [];
      skillsAll.proficiencyNames.forEach(element => {
        skillWithProficiencies.push(`${skill.skill} ${element.proficiency}`);
      });
    
      return skillWithProficiencies;
    });
  }

  return {teams: teamNames,
          leads: leadNames,
          skills: skillNames,
          skillInputData: skillsInputData.flat(1)};
};

const searchData =(data, searchParam) => {
  const searchedData = data.filter(item => {
  if(item['firstName']?.toLowerCase().includes(searchParam.toLowerCase()) || item['lastName']?.toLowerCase().includes(searchParam.toLowerCase())){
    return item;
  }})

  return searchedData;
};

const filterDataTeam = (data, filteredParam) => {
  const sortedData = data.filter(item => {
    if(Object.values(item).indexOf(filteredParam) > -1){
      return item;
    }
  })
  
  return sortedData;
}

const filterDataLead = (data, filteredParam) => {
  const sortedData = data.filter(item => {
    let leadName = `${item['teamLeadFirstName']} ${item['teamLeadLastName']}`;
    if(leadName.toLowerCase().includes(filteredParam.toLowerCase()) || leadName.toLowerCase().includes(filteredParam.toLowerCase())){
      return item;
    }
  })
  
  return sortedData;
};

const filterDataSkills = (data, filteredParam) => {
  const sortedData = data.filter(item => {
    if(item.skills.some(skillItem => skillItem.skill === filteredParam)){
      return item;
    }
  })
  
  return sortedData;
}

const filteringCheck = (req,developers) => {
  
  if(req.query?.searchInput){
    developers = searchData(developers, req.query.searchInput); 
  }

  if(req.query?.TeamFilter){
    developers = filterDataTeam(developers, req.query?.TeamFilter);
  }
  
  if(req.query?.LeadFilter){
    developers = filterDataLead(developers, req.query?.LeadFilter);
  }
  
  if(req.query?.SkillsFilter){
    developers = filterDataSkills(developers, req.query?.SkillsFilter);
  }

  return developers;
};

module.exports = {
  populateSearchAndFilter,
  searchData,
  filterDataTeam,
  filterDataLead,
  filterDataSkills,
  filteringCheck
};