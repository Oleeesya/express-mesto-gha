const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const {
  NOT_FOUND,
} = require('./utils/errors/not_found');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use('/users', auth, require('./routes/users'));

// сначала вызовется auth, а затем,
app.use('/cards', auth, require('./routes/cards'));

app.use('/', require('./routes/index'));

app.use(auth, (req, res, next) => next(new NOT_FOUND('Передан неправильный путь')));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // не поддерживаются:
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
