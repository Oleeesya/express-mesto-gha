const Card = require('../models/card');
const { NOT_FOUND, BAD_REQUEST, INTERNAL_ERROR } = require('./consts');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// удаляет карточку по идентификатору
module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardsId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);

      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id карточки' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// поставить лайк карточке
module.exports.putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      console.log(card);
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// убрать лайк с карточки
module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.name === 'ValidationError') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
