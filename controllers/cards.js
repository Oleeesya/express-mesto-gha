const mongoose = require('mongoose');
const Card = require('../models/card');
const { NOT_FOUND, BAD_REQUEST, INTERNAL_ERROR } = require('../utils/consts');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const creatorId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: creatorId })
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
  if (!mongoose.isValidObjectId(req.params.cardsId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные id' });
    return;
  }
  Card.findByIdAndRemove(req.params.cardsId)
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// поставить лайк карточке
module.exports.putLikeCard = (req, res) => {
  const creatorId = req.user._id;
  if (!mongoose.isValidObjectId(req.params.cardsId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные id для постановки лайка' });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: creatorId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// убрать лайк с карточки
module.exports.deleteLikeCard = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.cardsId)) {
    res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные id для постановки лайка' });
    return;
  }
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
    });
};
