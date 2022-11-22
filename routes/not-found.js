const router = require('express').Router();
const { constants } = require('http2');

router.all('*', (req, res) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемой страницы не существует' });
});

module.exports = router;
