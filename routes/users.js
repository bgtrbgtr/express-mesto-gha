const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const REGEX_FOR_LINK = require('../constants/regexp');
const {
  getUsers, getUserById, getUserInfo, changeUserInfo, changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEX_FOR_LINK),
  }),
}), changeAvatar);

module.exports = router;
