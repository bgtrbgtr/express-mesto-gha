const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const REGEX_FOR_LINK = require('../constants/regexp');
const { UnauthorizedError } = require('../errors');

function checkIfEmail(value) {
  return isEmail(value);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
    required: false,
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
    required: false,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: false,
    validate: {
      validator(link) {
        return REGEX_FOR_LINK.test(link);
      },
      message: 'Некорректная ссылка.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: checkIfEmail,
      message: 'E-mail указан некорректно!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверно указаны данные пользователя.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверно указаны данные пользователя.');
          }

          return user;
        });
    });
});

module.exports = mongoose.model('user', userSchema);
