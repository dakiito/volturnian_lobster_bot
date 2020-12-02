const Discord = require('discord.js')

module.exports = {
    name: "test1",
    //args: true,
    client: true,
    usage: 'test',
    async execute(message, args, client) {
        const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7 }
        var reactionArray = Object.keys(reactions)
        const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']
                .includes(reaction.emoji.name) && user.id === message.author.id;
        };

        var msg = await message.channel.send("123")
        reactionArray.forEach(reaction => {
            msg.react(reaction);
        });
        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                switch (reaction.emoji.name) {
                    case reactionArray[0]:
                        message.reply("you reacted with a one")
                        break;
                    case reactionArray[1]:
                        message.reply("you reacted with a two")
                        break;
                    case reactionArray[2]:
                        message.reply("you reacted with a three")
                        break;
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            })

    }
}
