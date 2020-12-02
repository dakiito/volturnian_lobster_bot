module.exports = {
    name: 'me',
    description: 'say the users name, usage: me',
    usage: ' ',
    execute(message, args) {
        message.channel.send(`your name is ` + message.author.username);
    },
};
