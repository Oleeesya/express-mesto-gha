const Card = require('../models/card');
const {
  NOT_FOUND,
} = require('../utils/errors/not_found');
const {
  FORBIDDEN,
} = require('../utils/errors/forbidden');

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id, // используем req.user
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

// удаляет карточку по идентификатору
module.exports.removeCard = (req, res, next) => {
  Card.findById(req.params.cardsId)
    .then((card) => {
      if (card === null) {
        throw new NOT_FOUND('Передан несуществующий _id карточки');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new FORBIDDEN('Вы не можете удалить чужую карточку');
      }
      return Card.findByIdAndRemove(req.params.cardsId)
        .then((removeCard) => {
          res.send({ data: removeCard });
        });
    })
    .catch(next);
};

// поставить лайк карточке
module.exports.putLikeCard = (req, res, next) => {
  const creatorId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: creatorId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NOT_FOUND('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};

// убрать лайк с карточки
module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NOT_FOUND('Передан несуществующий _id карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};
