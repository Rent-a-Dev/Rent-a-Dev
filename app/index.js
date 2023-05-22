require('dotenv').config();
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



app.get('/viewRequests', async function (req, res) {
  const requests = await get('requests/all');
  res.render('pages/viewRequests', { data: requests });
});

app.get('/approveRequests', async function (req, res) {
  const requests = await get('requests/all');
  res.render('pages/approveRequests', { data: requests });
});

app.get('/viewDevs', async function (req, res) {
  const developers = await get('developers/all');
  res.render('pages/viewDevs', { data: developers || [] });
});

app.get('/manageDevs', function (req, res) {
  res.render('pages/manageDevs', { data: developers });
});

app.get('/', function (req, res) {
  res.render('pages/index');
});


app.listen(3000, function (req, res) {
  console.log(`App listening at port ${port}`);
});