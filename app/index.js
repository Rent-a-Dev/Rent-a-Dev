require('dotenv').config();
const { 
  populateSearchAndFilter, 
  filteringCheck
} = require('./public/js/Helpers/SearchAndFiltering.js');
const express = require('express');
const app = express();
const port = process.env.PORT;
const clientId = process.env.CLIENT_ID;
const bodyParser = require("body-parser");
const { addDevBody } = require( './public/js/Helpers/addingNewRequest.js' );

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
const put = async (url, body) => {
  try {
    const response = await fetch(`${process.env.API}/${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

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
  
  res.render('pages/manageDevs', { data: developers || [], populateFilter: populateFilter, errorFlag: false});
});

app.get('/', function (req, res) {
  res.render('pages/login', {clientId: clientId});
});

app.post('/manageDevs/add', async function(req, res) {
  
  // This is for error handling.
  if(!req.body?.nameInput || !req.body?.surnameInput || !req.body?.teamInput || !req.body?.skillsInput){
    // res.render('pages/manageDevs', { data: [], populateFilter: [], errorFlag: true});
    // Need to render a popup failure here.
  }
  const allTeams = await get('teams');
  const body = await addDevBody(req.body.nameInput, req.body.surnameInput, req.body.teamInput, req.body.skillsInput, allTeams);
  
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

app.get('/authenticateUser', async (req, res) => {
  const body = new URLSearchParams();
  let access_token;
  body.append('client_id', clientId );
  body.append('client_secret', process.env.GIT_SECRET );
  body.append('code', req?.query?.code);
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body:body
    });

    const json = await response.json();
    access_token = json.access_token;
  } catch (error) {
    console.log('ERRORS');
    console.log(error);
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${access_token}`
      },
    });

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log('ERRORS');
    console.log(error);
  }
  res.redirect('/userCredentials');
});

app.get('/userCredentials', async (req, res) => {
  res.redirect('/manageDevs');
});
app.post('/requests/update', async (req, res) => {
  let response = await put('requests/update', req.body);
  if (response.status === 200) {
    console.log('Request Successful');
  } else {
    console.log('Request Unsuccessful');
  }

  res.redirect('/approveRequests');
});



app.listen(3000, function (req, res) {
  console.log(`App listening at port ${port}`);
});

 
