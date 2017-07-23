/*
  A bot, PLEASE FILL ME IN! WHAT IS MY PURPOSE?
*/

const Discord = require('discord.js');
const config = require('./config.json');
const commands = require('./commands');
const permissions = require('./permissions');

const fs = require('fs');

// Create an instance of a Discord clientshare
const client = new Discord.Client();

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // Exit and stop event if the prefix is not present OR if message from bot OR if dm
  if (
    !message.content.startsWith(config.prefix) 
    || message.author.bot 
    || message.channel.type == 'dm'
  ) return;
  // If user isn't on user list or admin list or Moofle ignore their message
  else if (!permissions.isMoofle(message) && !permissions.isAdmin(message) && !permissions.isUser(message)) {
    message.channel.send('This bot only responds to Users/Admins or Moofle... The exception is this message ' + config.expletive);
    return
  }

  // Feed message into commandCenter function which will determine what code to run based on
  // content
  commands.commandCenter(message)

});

// Log our bot in
client.login(config.token);
