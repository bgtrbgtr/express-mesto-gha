const { constants } = require('http2');
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Указаны некорректные данные. ${err.message}` });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сревера. ${err.message}` });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE)
      .send({ message: `Ошибка сервера. ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId.likes } },
    { new: true },
  )
    .populate('likes')
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      } else if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Указаны некорректные данные. ${err.message}` });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Указаны некорректные данные. ${err.message}` });
      } else {
        res.status(constants.HTTP_STATUS_SERVICE_UNAVAILABLE).send({ message: `Ошибка сервера. ${err.message}` });
      }
    });
};
