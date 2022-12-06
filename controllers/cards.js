const Card = require('../models/card');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/index');

module.exports.createCard = (req, res, next) => {
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
        next(new ValidationError('Указаны некорректные данные.'));
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString().indexOf(req.user._id) === -1) {
        throw new ForbiddenError('Удаление карточки другого пользователя невозможно.');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then((deletedCard) => res.send({
          likes: deletedCard.likes,
          _id: deletedCard._id,
          name: deletedCard.name,
          link: deletedCard.link,
          owner: deletedCard.owner,
        }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new ValidationError('Указаны некорректные данные'));
          }
        });
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.cardId.likes } },
    { new: true },
  )
    .populate('likes')
    .orFail(() => {
      next(new NotFoundError('Карточка с указанным id не найдена.'));
    })
    .then((card) => {
      res.send({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные.'));
      }
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Карточка с указанным id не найдена.'));
    })
    .then((card) => {
      res.send({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные.'));
      }
    });
};
