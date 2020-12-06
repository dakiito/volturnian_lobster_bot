module.exports = {
    name: 'createvcs',
    args: true,
    argsLength: 4,
    perms: true,
    permission: `MANAGE_CHANNELS`,
    description: 'creates multiple channels that are numbered 0 to amount',
    usage: '<starting number> <amount> <category id> <name of channels>',
    execute(message, args) {
        var server = message.guild
        var startnumber = parseInt(args[0]),
            amount = parseInt(args[1]),
            categoryID = args[2],
            name = args[3]


        for (var i = 0; i <= amount; i++) {
            var number = (startnumber + i);
            server.channels.create(`${name} ${number}`, {
                    type: "voice"
                })
                .then(channel => {
                    let category = server.channels.cache.find(c => c.id == categoryID && c.type == "category");
                    if (!category) throw new Error("Category channel does not exist");

                    channel.setParent(category.id);
                }).catch(console.error);
        }
        message.channel.send("channels " + startnumber + " to " + amount + " created!")
    },
};
