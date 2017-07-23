/*
  Contains all the commands you can feed into the bot
*/

const permissions = require('./permissions');
const config = require('./config.json');
const fs = require('fs');
const sql = require('sqlite');
sql.open('./user.sqlite');

exports.commandCenter = (message) => {

  sql.get('SELECT * FROM user WHERE user_id ="${message.author.id}"').then(row => {
    if (!row) {
      // Insert user if it doesn't exist
      sql.run('INSERT INTO user (user_id, name) VALUES (?, ?)', [message.author.id, message.author.username]);
    }
  }).catch(() => {
    // Create USER table if it doesn't exist, insert person using command into USER table.
    console.error;
    sql.run('CREATE TABLE IF NOT EXISTS user (user_id INTEGER, name TEXT)').then(() => {
      sql.run('INSERT INTO user (user_id, name) VALUES (?, ?)', [message.author.id, message.author.username]);
    });
  });

  // !ping
  // This command responds to a ping
  // Required Permissions: Moofle or Admin
  if (message.content.startsWith(config.prefix + 'ping')) { 
    // Check permissions
    if (!permissions.isMoofle(message) && !permissions.isAdmin(message)) {
      return;
    }
    // Send "pong" to the same channel 
    message.channel.send('pong'); 
  }

  // !addfilm
  // This command adds a film to the database
  // Required Permissions: Moofle
  if (message.content.startsWith(config.prefix + 'addfilm')) {
    // Check permissions
    if (!permissions.isMoofle(message)) {
      return;
    }

    let newFilm = message.content.split(' ').slice(1).join(' ') || '';
    sql.get('SELECT * FROM film WHERE name=?', [newFilm]).then(row => {
      console.log(row);
      if (!row) {
      // Insert film if it doesn't exist
      sql.run('INSERT INTO film (name) VALUES (?)', [newFilm]);
      }
    }).catch(() => {
      // Create FILM table if it doesn't exist, insert film
      console.error;
      sql.run('CREATE TABLE IF NOT EXISTS film (name TEXT)').then(() => {
        sql.run('INSERT INTO film (name) VALUES (?)', [newFilm]);
      }); 
    });
  }

  // !setprefix
  // This command sets the prefix for all commands
  // Required Permissions: Moofle or Admin
  if(message.content.startsWith(config.prefix + 'setprefix')) {
    // Check permissions
    if(!permissions.isMoofle(message) && !permissions.isAdmin(message)) {
      return 
    }

    // Gets the prefix from the command (eg. '!setprefix +' it will take the '+' from it). Will only accept length of 1 and symbols.
    let newPrefix = message.content.split(' ').slice(1, 2)[0] || '';
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
      fs.writeFile('./config.json', JSON.stringify(config, null, '\t'), (err) => console.error);
      message.channel.send('Prefix changed to "' + config.prefix + '"');
    }
  }

  // !setroleuser
  // This command sets the role that is able to use the bot at user level
  // Required Permissions: Moofle or Admin
  if(message.content.startsWith(config.prefix + 'setroleuser')) {
    // Check permissions
    if(!permissions.isMoofle(message) && !permissions.isAdmin(message)) {
      return 
    }

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

      fs.writeFile('./config.json', JSON.stringify(config, null, "\t"), (err) => console.error);
      message.channel.send('roleID changed to "' + config.roleID + '"');
    }
  }

  // !setroleadmin
  // This command sets the role that is able to use the bot at admin level
  // Required Permissions: Moofle or Admin
  if(message.content.startsWith(config.prefix + 'setroleadmin')) { 
    // Check permissions
    if(!permissions.isMoofle(message) && !permissions.isAdmin(message)) {
      return 
    }

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
      config.adminID = newRoleID;

      fs.writeFile('./config.json', JSON.stringify(config, null, "\t"), (err) => console.error);
      message.channel.send('AdminID changed to "' + config.adminID + '"');
    }
  }

  if(message.content.startsWith(config.prefix + 'moofle')) {
    if(permissions.isMoofle(message)) {
        message.channel.send('Yes you are Moofle');
    }
    else message.channel.send('No you are not Moofle');
  }

  if(message.content.startsWith(config.prefix + 'test')) {
    if(permissions.isUser(message)) {
        message.channel.send('Yes you are permitted');
    }
    else message.channel.send('No you are not permitted');
  }

}
