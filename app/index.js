require('dotenv').config();
const { 
  populateSearchAndFilter, 
  filteringCheck
} = require('./public/js/Helpers/SearchAndFiltering.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const clientId = process.env.CLIENT_ID;
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
  if(!req.session.user){
    res.redirect('/');
  }

  const requests = await get(`requests/view/${req.session.user}`);
  res.render('pages/viewRequests', { data: requests, username: req.session.user, feedback: req.session.popup || {type: undefined, message: undefined, redirect: undefined} });
});

app.get('/approveRequests', async function (req, res) {
  if(!req.session.user){
    res.redirect('/');
  }
  const requests = await get(`requests/approve/${req.session.user}`);
  res.render('pages/approveRequests', { data: requests, username: req.session.user, feedback: req.session.popup || {type: undefined, message: undefined, redirect: undefined} });
});

app.get('/viewDevs', async function (req, res) {

  if(!req.session.user){
    res.redirect('/');
  }
  let developers = await get(`developers/view/${req.session.user}`);

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req, developers);

  res.render('pages/viewDevs', { data: developers || [], populateFilter: populateFilter, feedback: req.session.popup || {type: undefined, message: undefined, redirect: undefined}, username: req.session.user});
});

app.get('/manageDevs', async  function (req, res) {
  
  if(!req.session.user){
    res.redirect('/');
  }
  let developers = await get(`developers/manage/${req.session.user}`);

  let skillsAll = await get('skills/all');

  let populateFilter = populateSearchAndFilter(developers, skillsAll);

  developers = filteringCheck(req,developers);
  res.render('pages/manageDevs', { data: developers || [], populateFilter: populateFilter, feedback: req.session.popup || {type: undefined, message: undefined, redirect: undefined}, username: req.session.user});
});

app.get('/', function (req, res) {
  
  res.render('pages/login', {clientId: clientId, redirect: process.env.REDIRECT_URL});
});

app.get('/handlePopUp', function(req, res) {
  if(req.session.popup){
    delete req.session.popup;
  }
  res.redirect(req?.query?.redirect_url);
});

app.post('/manageDevs/add', async function(req, res) {
  
  if(!req.body?.nameInput || !req.body?.surnameInput || !req.body?.teamInput || !req.body?.skillsInput){
    req.session.popup = {type:'fail', message: 'couldn\'t add the dev', redirect: '/manageDevs'};
    res.redirect('/manageDevs');
    return;
  }

  const allTeams = await get('teams');
  const body = await addDevBody(req.body.nameInput, req.body.surnameInput, req.body.teamInput, req.body.skillsInput, allTeams);
  
  const insertResponse = await post('developers/add', body);

  if(!insertResponse){
    req.session.popup = {type:'fail', message: 'couldn\'t add the dev', redirect: '/manageDevs'};
    res.redirect('/manageDevs');
    return;
  }
  // Success pop up
  req.session.popup = {type:'success', message: 'Added the dev', redirect: '/manageDevs'};

  res.redirect('/manageDevs');

});

app.get('/authenticateUser', async (req, res) => {
  
  const access_token = await getBearerToken(req?.query?.code);
  
  const userData = await getUserInfo(access_token);
  if(!req.session.user){
    req.session.user = userData.login;
  }
  let existingUser = await get(`teamLead/loggedIn/${req.session.user}`);
  if (!existingUser || !existingUser.teamLeadId){
    let name = req.session.user;
    let surname = "External";
    let body = {name, surname, loggedInUser: req.session.user};
    let response = await post(`teamLead/add/`, body);
    if (response.status === 200) {
      res.redirect('/manageDevs');
    } 
    else {
      req.session.popup = {type:'fail', message: 'Failed to logged in', redirect: '/login'};
      res.redirect('/manageDevs');
      delete req.session.user;
    } 
  }
  else{
    res.redirect('/manageDevs');
  }
  
});

/* POSTS FOR API CALLS */
app.post('/requests/add', async (req, res) => {
  let response = await post(`requests/add/${req.session.user}`, req.body);
  if (response.status === 200) {
    req.session.popup = {type:'success', message: 'Request Successful', redirect: '/viewRequests'};
    res.redirect('/viewRequests');
    return;
  } else {
    req.session.popup = {type:'fail', message: 'Request Unuccessful', redirect: '/viewDevs'};
    res.redirect('/viewDevs');
    return;
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/availibility/update', async (req, res) => {
  if (req.body.available){
    let response = await post('availibility/update', req.body);
    if (response.status === 200) {
      req.session.popup = {type:'success', message: 'Request Successful', redirect: '/manageDevs'};

    } else {
      req.session.popup = {type:'fail', message: 'Request Unuccessful', redirect: '/manageDevs'};
    }
  }
  res.redirect('/manageDevs');
});

app.post('/requests/update', async (req, res) => {
  let response = await put('requests/update', req.body);
  if (response.status === 200) {
    req.session.popup = {type:'success', message: 'Request Successful', redirect: '/approveRequests'};
  } else {
    req.session.popup = {type:'fail', message: 'Request Unuccessful', redirect: '/approveRequests'};
  }

  res.redirect('/approveRequests');
});

app.listen(port, function (req, res) {
  console.log(`App listening at port ${port}`);
});

 
