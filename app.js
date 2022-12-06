require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(routes);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);

mongoose.connect('mongodb://localhost:27017/mestodb');
