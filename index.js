const config = require('./config.json');
const TelegramBot = require('node-telegram-bot-api');
const token = config.token;

const bot = new TelegramBot(token, {
  polling: true
});

const CommandParser = require('./CommandParser.js');
const parser = new CommandParser();

const fs = require('fs');
const BELL_CORRECTION_PATH = config.custom['bell correction'];
parser
  .command('ping', '', 'Returns pong')
  .action(function(args, callback) {
    callback(null, 'Pong!');
  });
parser
  .command('time', '', 'Returns current time')
  .action(function(args, callback) {
    callback(null, `${new Date().toString()} = ${Date.now()}`);
  });
parser
  .command('echo', '[string...]', 'Echo the input')
  .action(function(strings, callback) {
    callback(null, strings.join(' '));
  });
parser
  .command('bellAdd', '[number]', 'Change the bell correction')
  .action(function(args, callback) {
    fs.readFile(BELL_CORRECTION_PATH, function(err, data) {
      var correction = parseInt(args[0]) + parseInt(data);
      fs.writeFile(BELL_CORRECTION_PATH, correction, function(err) {
        callback(err, `Saved! Correction is ${correction} ms`);
      });
    });
  });
parser
  .command('bellSet', '[number]', 'Set the bell correction')
  .action(function(args, callback) {
    fs.writeFile(BELL_CORRECTION_PATH, args[0], function(err) {
      callback(err, `Saved! Correction is ${args[0]} ms`);
    });
  });
parser
  .command('bellGet', '', 'Get the bell correction')
  .action(function(args, callback) {
    fs.readFile(BELL_CORRECTION_PATH, callback);
  });

bot.on('message', function(msg) {
  if (msg.from.id != config['admin id']) return;
  parser.parse(msg.text, function(err, res) {
    if (err) return bot.sendMessage(err.message);
    bot.sendMessage(msg.from.id, res);
  });
});