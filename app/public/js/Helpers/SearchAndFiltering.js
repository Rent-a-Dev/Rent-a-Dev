const populateSearchAndFilter = (data) => {
  const teamNames = Array.from(new Set(data.map(item => {return item.teamName})));
  const leadNames = Array.from(new Set(data.map(item => {return `${item.teamLeadFirstName} ${item.teamLeadLastName}`})));
  const skillNames = Array.from(new Set(data.map(item => {return (item.skills).map(item => {return item.skill})}).flat(1)));

  return {teams: teamNames,
          leads: leadNames,
          skills: skillNames};
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

module.exports = {
  populateSearchAndFilter,
  searchData,
  filterDataTeam,
  filterDataLead,
  filterDataSkills
};