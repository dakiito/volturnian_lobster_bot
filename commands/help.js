const Discord = require('discord.js') //need this for embeds


module.exports = {
    name: "help",
    description: "describes available commands",
    execute(message, args) {
        const embed = new Discord.messageEmbed()
        embed.setTitle(`Available Commands:`)
        embed.addField(`connect4, usage: <@person to verse>`)
        embed.addField(`roulette, usage: @ as many people as you want, the one using the command is added by default.`)
    }
}
