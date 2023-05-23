require('dotenv').config();
const { 
  populateSearchAndFilter, 
  filteringCheck
} = require('./public/js/Helpers/SearchAndFiltering.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
const bodyParser = require("body-parser");
const { addDevBody } = require( './public/js/Helpers/addingNewRequest.js' );
const { getBearerToken, getUserInfo } = require( './public/js/Helpers/authentication.js' );
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: "sosecret",
  saveUninitialized: false,
  resave: true,
  cookie: {
    expires: 600000
  }
}));

app.use(cookieParser());

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

const post = async (url, body) => {
  try {
    const response = await fetch(`${process.env.API}/${url}`, {
      method: 'POST',
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
  console.log(req.session);
  if(!req.session.user){
    res.redirect('/');
  }

  const requests = await get('requests/all');
  res.render('pages/viewRequests', { data: requests, username: req.session.user });
});

app.get('/approveRequests', async function (req, res) {
  console.log(req.session);
  if(!req.session.user){
    res.redirect('/');
  }
  const requests = await get('requests/all');
  res.render('pages/approveRequests', { data: requests, username: req.session.user });
});

app.get('/viewDevs', async function (req, res) {

  console.log(req.session);
  if(!req.session.user){
    res.redirect('/');
  }
  let developers = await get('developers/all');

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req, developers);

  res.render('pages/viewDevs', { data: developers || [], populateFilter: populateFilter, errorFlag: false, username: req.session.user});
});

app.get('/manageDevs', async  function (req, res) {
  
  console.log(req.session);
  if(!req.session.user){
    res.redirect('/');
  }
  let developers = await get('developers/all');

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req,developers);
  
  res.render('pages/manageDevs', { data: developers || [], populateFilter: populateFilter, errorFlag: false, username: req.session.user});
});

app.get('/', function (req, res) {
  
  res.render('pages/login', {clientId: clientId});
});

app.post('/manageDevs/add', async function(req, res) {
  
  if(!req.body?.nameInput || !req.body?.surnameInput || !req.body?.teamInput || !req.body?.skillsInput){
  }

  const allTeams = await get('teams');
  const body = await addDevBody(req.body.nameInput, req.body.surnameInput, req.body.teamInput, req.body.skillsInput, allTeams);
  
  const insertResponse = await post('developers/add', body);

  if(!insertResponse){
    //Fail pop up
  }
  // Success pop up
  res.redirect('/manageDevs');
});

app.get('/authenticateUser', async (req, res) => {
  
  const access_token = await getBearerToken(req?.query?.code);
  
  const userData = await getUserInfo(access_token);
  console.log(userData);
  if(!req.session.user){
    req.session.user = userData.login;
  }
  res.redirect('/userCredentials');
});

app.get('/userCredentials', async (req, res) => {
  res.redirect('/manageDevs');
});

/* POSTS FOR API CALLS */
app.post('/requests/add', async (req, res) => {
  let response = await post('requests/add', req.body);
  if (response.status === 200) {
    console.log('Request Successful');
  } else {
    console.log('Request Unsuccessful');
  }

  res.redirect('/viewRequests');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
/* POSTS FOR API CALLS */
app.post('/requests/add', async (req, res) => {
  let response = await post('requests/add', req.body);
  if (response.status === 200) {
    console.log('Request Successful');
  } else {
    console.log('Request Unsuccessful');
  }

  res.redirect('/viewRequests');
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

app.listen(port, function (req, res) {
  console.log(`App listening at port ${port}`);
});

 
