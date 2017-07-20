/*
  A bot, PLEASE FILL ME IN! WHAT IS MY PURPOSE?
*/

const Discord = require('discord.js');
const config = require('./config.json');
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
  // Exit and stop event if the prefix is not present OR if message from bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // If the message starts with "!ping"
  if (message.content.startsWith(config.prefix + 'ping')) {
  // Send "pong" to the same channel
  message.channel.send('pong');
  }

  if(message.content.startsWith(config.prefix + "prefix")) {
    // Gets the prefix from the command (eg. '!prefix +' it will take the '+' from it). Will only accept length of 1 and symbols.
    let newPrefix = message.content.split(' ').slice(1, 2)[0];
    // Set regex pattern to allow symbols
    const pattern = /^[!@#$%^&*(()_+\-=\[\]{};':"\\|,.<>\/?]*$/ 
    // If prefix is not 1 in length...
    if (newPrefix.length != 1) {
      message.channel.send('Prefix must be length of 1 ' + config.expletive);
    }
    // ...or not a symbol don't change
    else if (!newPrefix.match(pattern)) {
      message.channel.send('Prefix must be a symbol ' + config.expletive);
    }
    
    // If prefix is same, inform user
    else if (newPrefix === config.prefix) {
      message.channel.send('Prefix is already "' + config.prefix + '"' + config.expletive);
    }
    else {
      // Change configuration in memory
      config.prefix = newPrefix;

      // Now we have to save to file.
      fs.writeFile('./config.json', JSON.stringify(config), (err) => console.error);
      message.channel.send('Prefix changed to "' + config.prefix + '"');
    }
  }
  
  if(message.content.startsWith(config.prefix + 'setrole')) {
    // Gets the supplied role ID from command
    let newRoleID = message.content.split(' ').slice(1, 2)[0];
    // Ensure newRoleID is length 18 (standard role length)
    if (newRoleID.length != 18) {
      message.channel.send('Role IDs should be of length 18! To find a role\'s ID type: \\ @role into discord, make sure the role is mentionable first however ' + config.expletive);
    }
    // Ensure newRoleID exists on server
    else if (!message.guild.roles.has(newRoleID)){
      message.channel.send('Role ID doesn\'t exist on this server! To find a role\'s ID type \\ @role into discord, make sure the role is mentionable first however ' + config.expletive);
    }
    else {
      config.roleID = newRoleID;

      fs.writeFile('./config.json', JSON.stringify(config), (err) => console.error);
      message.channel.send('roleID changed to "' + config.roleID + '"');
    } 
  }

  if(message.content.startsWith(config.prefix + 'moofle')) {
    if(permissions.isMoofle(message)) {
        message.channel.send('Yes you are Moofle');
    }
    else message.channel.send('No you are not Moofle');
  }
});

// Log our bot in
client.login(config.token);
