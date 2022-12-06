const router = require('express').Router();
const { NotFoundError } = require('../errors');

router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемой страницы не сушествует'));
});

module.exports = router;
