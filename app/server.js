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

const requests = [
  { id: 0, name: 'James', teamLead: 'Anne', requestStatus: 'Pending', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'},
  { id: 1, name: 'James', teamLead: 'Anne', requestStatus: 'Approved', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'},
  { id: 2, name: 'James', teamLead: 'Anne', requestStatus: 'Rejected', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'},
];
 
app.get('/viewRequests', function(req, res) {  
  res.render('pages/viewRequests', {data: requests});
});

app.get('/approveRequests', function(req, res) {  
  res.render('pages/approveRequests', {data: requests});
});

app.get('/viewDevs', async function (req, res) {
  const developers = await get('developers/all');
  console.log(developers);
  res.render('pages/viewDevs', { data: developers || [] });
});

app.get('/viewDevs', function(req, res) {
  res.render('pages/viewDevs', {data: developers});
});

app.get('/manageDevs', function(req, res) {
  res.render('pages/manageDevs', {data: developers});
});

app.get('/', function(req, res) {  
  res.render('pages/index');
});


app.listen(port, function(req, res) {
  console.log(`App listening at port ${port}`);
});