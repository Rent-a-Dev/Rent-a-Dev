import {
  dbHandler,
} from './db/dbHandler.js';

import express from "express";

import bodyParser from 'body-parser';

import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const server = app.listen(process.env.PORT || 8080, function () {
  const port = server.address().port;
  console.log("Application running on port: ", port);
});

const {
  insertNewDeveloper,
  getDevelopers,
} = dbHandler();

insertNewDeveloper();
getDevelopers();