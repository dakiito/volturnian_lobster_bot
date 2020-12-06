module.exports = {
    name: 'createtextchannel',
    args: true,
    perms: true,
    permission:`MANAGE_CHANNELS`,
    description: 'creates a text channel, usage: createtextchannel <name>',
    usage: '<channel name>',
    execute(message, args) {
        var name = args.join(" ")
        message.guild.channels.create(name, {
            name: name,
            type: "text",
            topic: 'volturnbot'
        })
        message.channel.send("channel created!")
    },
};
