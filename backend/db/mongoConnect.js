const mongoose = require('mongoose');
const { secret } = require("../config/secret");
const chalk = require('chalk');

mongoose.connect(`mongodb+srv://${secret.mongoUser}:${secret.mongoPassword}@onlinestore.wguxa.mongodb.net/onlineStore`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(chalk.greenBright("Mongo Connected to") + " " + chalk.bold.blue("onlineStore"));
  // we're connected!
});

module.exports = db;
