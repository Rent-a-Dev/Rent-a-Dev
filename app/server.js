const express = require('express'); 
const app = express(); 
const port = 3000;
    
app.set('view engine', 'ejs'); 
 
app.use('/public', express.static(__dirname + '/public'));

app.get("/viewRequests", function(req, res) {  
    res.render("pages/viewRequests", {data: [{id: 0, name: 'James', teamLead: 'Anne', requestStatus: 'Pending', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}, 
                                            {id: 1,name: 'James', teamLead: 'Anne', requestStatus: 'Approved', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}, 
                                            {id: 2, name: 'James', teamLead: 'Anne', requestStatus: 'Rejected', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}]});
  });

app.get("/approveRequests", function(req, res) {  
    res.render("pages/approveRequests", {data: [{id: 0,name: 'James', teamLead: 'Anne', requestStatus: 'Pending', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}, 
                                                {id: 1,name: 'James', teamLead: 'Anne', requestStatus: 'Approved', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}, 
                                                {id: 2,name: 'James', teamLead: 'Anne', requestStatus: 'Rejected', hours: 5, startDate: '2023/05/01', endDate: '2023/05/03'}]});
  });

app.get("/", function(req, res) {  
  res.render("pages/index");
});


app.listen(port, function(req, res) {
  console.log(`App listening at port ${3000}`);
});