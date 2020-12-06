const Discord = require('discord.js') //need this for embeds


module.exports = {
    name: "help",
    description: "describes available commands",
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`Available Commands:`)
        embed.addField(
            `Utility commands included in the bot are:`,
            `clearcategory <catergory id> \n clearservervc  \n cleartextchats <amount> <channel topic>  - channels created by the bot have the topic volturnbot`
        )
        embed.addField(
            `Utility commands continued`,
            `createtextchannel <name> \n createvcs <starting number> <amount> <category id> <name of channels>  \n - makes up to 50 channels in a category (name 1+starting number, name 2+starting number, name 3+starting number etc) \n deletechannel <#channel or channelid>`
        )
        embed.addField(` Game commands:`,
            `\nrussian roulette < @people you want to verse > -@ as many as you want, you also have the option to spin the chamber
                    \n connect4 < @opponent > -use reactions to play.`
        )

        message.channel.send(embed)
    }
}
