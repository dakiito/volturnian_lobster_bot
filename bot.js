const Discord = require('discord.js');
const fs = require('fs');
const {
    PREFIX,
    TOKEN
} = require('./config.json');

const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.login(TOKEN);
client.commands = new Collection();
client.PREFIX = PREFIX;
client.queue = new Map();

const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


client.once('ready', () => {
    console.log('Ready!');
    client.user.setPresence({ activity: { name: `PREFIX: ${PREFIX}` }, status: 'online' })
        .then(console.log(`activity set, bot is online!`))
        .catch(console.error);
});



for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    //debug(message)

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    var reply;

    if (!command) { //check whether command exists
        console.log("command does not exist" + message.author.username)
    }
    else if (command.perms && !message.member.hasPermission(command.permission)) {
        reply = 'You have insufficent permissions'
    }
    else if (command.args && args.length === 0) {
        reply = `You didn't provide any arguments, ${message.author}!`; // check for no arguments where there should be
        if (command.usage) { //if the command has a specified usage, send to user
            reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }
    }
    else {
        try {
            if (commandName.client) //in the case the command requires client parameter
                command.execute(message, args, client);
            else
                command.execute(message, args); //run command
        }
        catch (error) {
            console.error(error);
            message.reply("There was an issue executing that command!");
        }
    }
    if (reply)
        message.channel.send(reply)
})


process.on('unhandledRejection', error => {
    // Prints "unhandledRejection woops!"
    console.log('unhandledRejection' + error.log, error);

});
