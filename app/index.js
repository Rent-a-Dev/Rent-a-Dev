require('dotenv').config();
const { 
  populateSearchAndFilter, 
  filteringCheck
} = require('./public/js/Helpers/SearchAndFiltering.js');
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const { addDevBody } = require( './public/js/Helpers/addingNewRequest.js' );

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
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

const post = async (url, body ) => {
  try {
    const response = await fetch(`${process.env.API}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }
}

const authFunc = async () => {
  const authResponse = await fetch("https://github.com/login/oauth/authorize")
  return authResponse;
}

const requests = [
  { id: 0, name: 'James', teamLead: 'Anne', requestStatus: 'Pending', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
  { id: 1, name: 'James', teamLead: 'Anne', requestStatus: 'Approved', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
  { id: 2, name: 'James', teamLead: 'Anne', requestStatus: 'Rejected', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03' },
];

app.get('/viewRequests', async function (req, res) {
  const requests = await get('requests/all');
  res.render('pages/viewRequests', { data: requests });
});

app.get('/approveRequests', async function (req, res) {
  const requests = await get('requests/all');
  res.render('pages/approveRequests', { data: requests });
});

app.get('/viewDevs', async function (req, res) {

  let developers = await get('developers/all');

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req, developers);

  res.render('pages/viewDevs', { data: developers || [], populateFilter: populateFilter, errorFlag: false});
});

app.get('/manageDevs', async function (req, res) {
  // authFunc(); 

  let developers = await get('developers/all');

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req,developers);
  
  res.render('pages/manageDevs', { data: developers, populateFilter: populateFilter, errorFlag: false});
});

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.post('/manageDevs/add', async function(req, res) {
  
  // This is for error handling.
  if(!req.body?.nameInput || !req.body?.surnameInput || !req.body?.teamInput || !req.body?.skillsInput){
    // res.render('pages/manageDevs', { data: [], populateFilter: [], errorFlag: true});
    // Need to render a popup failure here.
  }
  const body = await addDevBody(req.body.nameInput, req.body.surnameInput, req.body.teamInput, req.body.skillsInput)
  console.log(body);
  // call the appropriate post function to /developers/add
  const insertResponse = await post('developers/add', body);
  console.log(insertResponse);
  if(!insertResponse){
    //Fail pop up
  }
  // Success pop up
  res.redirect('/manageDevs');
});




app.listen(port, function (req, res) {
  console.log(`App listening at port ${port}`);
});

 
