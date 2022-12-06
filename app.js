require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { constants } = require('http2');
const { celebrate, errors, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(http)?s?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+\-[\].$'*,;!~#?&//=]*)/),
  }).unknown(true),
}), createUser);

app.use(cookieParser());
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', require('./routes/not-found'));

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = constants.HTTP_STATUS_SERVICE_UNAVAILABLE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера.'
        : message,
    });
});

app.listen(PORT);

mongoose.connect('mongodb://localhost:27017/mestodb');
