const express = require('express')
const path = require('path');
const bodyParser = require('body-parser'); // To read JSON body data
const app = express();
const pg = require('pg');
const customer = require('./customer.js');

const connectionString = 'postgres://postgres:admin@localhost:5432/kalahari';
const location = path.resolve(__dirname);
const hostname = '127.0.0.1';
const port = 3000;
const client = new pg.Client(connectionString);
const htmlpath = "/public/html";

client.connect();
app.use(bodyParser.json()); // for parsing JSON body

//FIX: this is kind of slow to look at, maybe route grouping would be good
app.get('/admin', (req, res) => {
    console.log("received get request at admin");
    res.sendFile(location + htmlpath + "/admin.html");
});

app.get('/customer', (req,res) => {
    console.log("received get request at customer");
    res.sendFile(location + htmlpath + "/customer.html");
});

app.get('/company', (req,res) => {
    console.log("received get request at company");
    res.sendFile(location + htmlpath + "/company.html");
});

app.get('/', (req, res) => {
    console.log("received get request at /");
    res.sendFile(location + htmlpath + "/index.html");
});

app.get("/api/getItems", (req, res) => {
    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
});

// GETs all shipping methods in the database
app.get("/api/getShippingMethods", (req, res) => {
    customer.getShippingMethods(req, res, client);
});

// GETs all orders associated with the specified user
// Parameters:
// UID - string - User ID to get orders of
app.get("/api/getOrders", (req, res) => {
    customer.getOrders(req, res, client);
});

// TODO: Document this
app.post("/api/makeShippingRequest", (req, res) => {
    customer.makeShippingRequest(req, res, client);
});

// GETs the UserID associated with the given customer
// Parameters: name - string - name of user
app.post("/api/userLogin", (req, res) => {
    customer.userLogin(req, res, client); 
});

// GETs the UserID associated with the given company
// Parameters: name - string - name of company
app.post("/api/companyLogin", (req, res) => {
    customer.compLogin(req, res, client);
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});