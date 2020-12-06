const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const {
    prefix,
    token
} = require('./config.json');
client.once('ready', () => {
    console.log('Ready!');
});



for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //debug(message)

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const commandObj = client.commands.get(command)
    var reply;
    if (!client.commands.has(command)) { //check whether command exists
        console.log("command does not exist" + message.author.username)
    }
    else if (commandObj.perms && !message.member.hasPermission(commandObj.permission)) {
        reply = 'You have insufficent permissions'
    }
    else if (commandObj.args && args.length === 0) {
        reply = `You didn't provide any arguments, ${message.author}!`; // check for no arguments where there should be
        if (commandObj.usage) { //if the command has a specified usage, send to user
            reply += `\nThe proper usage would be: \`${prefix}${commandObj.name} ${commandObj.usage}\``;
        }
    }
    else {
        try {
            if (command.client) //in the case the command requires client parameter
                commandObj.execute(message, args, client);
            else
                commandObj.execute(message, args); //run command
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

client.login(token);
