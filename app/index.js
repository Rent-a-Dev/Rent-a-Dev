require('dotenv').config();
const { 
  populateSearchAndFilter, 
  searchData, 
  filterDataLead, 
  filterDataTeam,
  filterDataSkills
} = require('./public/js/Helpers/SearchAndFiltering.js');
const express = require('express');
const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');

app.use(express.static('public'));

const get = async url => {
  try {
    const response = await fetch(`${process.env.API}/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }
};

const authFunc = async () => {
  const authResponse = await fetch("https://github.com/login/oauth/authorize")
  return authResponse;
}

const requests = [
  { id: 0, name: 'James', teamLead: 'Anne', requestStatus: 'Pending', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
  { id: 1, name: 'James', teamLead: 'Anne', requestStatus: 'Approved', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
  { id: 2, name: 'James', teamLead: 'Anne', requestStatus: 'Rejected', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
];

app.get('/viewRequests', function (req, res) {
  res.render('pages/viewRequests', { data: requests });
});

app.get('/approveRequests', function (req, res) {
  res.render('pages/approveRequests', { data: requests });
});

app.get('/viewDevs', async function (req, res) {
  let developers = await get('developers/all');

  let populateFilter = populateSearchAndFilter(developers);

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
  res.render('pages/viewDevs', { data: developers || [], populateFilter: populateFilter });
});

app.get('/manageDevs', async function (req, res) {
  // authFunc(); 

  let developers = await get('developers/all');

  let populateFilter = populateSearchAndFilter(developers);

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
  res.render('pages/manageDevs', { data: developers, populateFilter: populateFilter });
});

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.post('/manageDevs/add', function(req, res) {
  res.redirect('/manageDevs');
});

app.listen(port, function (req, res) {
  console.log(`App listening at port ${port}`);
});

 
