var delimeter = ' ';

var Command = function(name, args, desc) {
  this.name = name;
  this.args = args;
  this.desc = (desc) ? desc : 'No description provided';
};

Command.prototype.action = function(func) {
  this.func = func;
  return this;
};

Command.prototype.help = function() {
  return `${this.name} ${this.args} => ${this.desc}`;
};

var CommandParser = function() {
  this.commands = {};
};

CommandParser.prototype.command = function(name, args, desc) {
  return this.commands[name.toLowerCase()] = new Command(name, args, desc);
};

CommandParser.prototype.parse = function(string, callback) {
  var parts = string.split(delimeter);
  var command = parts[0].toLowerCase();
  var args = parts.slice(1);

  return (this.commands[command]) ? this.commands[command].func(args, callback) : callback(null, 'Unknown command\n' + this.help());
};

CommandParser.prototype.help = function() {
  var out = '';
  for (var cmd in this.commands) {
    out += this.commands[cmd].help() + '\n';
  }
  return out;
};

module.exports = CommandParser;