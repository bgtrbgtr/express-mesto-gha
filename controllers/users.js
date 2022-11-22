const { constants } = require('http2');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
      .send({ message: `Ошибка сервера. ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Указаны некорректные данные. ${err.message}` });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователя с указанным id не существует.' });
        console.log(req.params);
      } else {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователя с указанным id не существует.' });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err}` });
      }
    });
};

module.exports.changeUserInfo = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Указаны некорректные данные. ${err.message}` });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователя с указанным id не существует.' });
      } else if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Ссылка указана некорректно.' });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};
