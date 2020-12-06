module.exports = {
    name: 'deletechannel',
    args: true,
    perms: true,
    permission: `MANAGE_CHANNELS`,
    description: 'deletes mentioned channel. usage: deletechannel <#channel> for text channels or id of channel',
    usage: '<#channel> or <channelid>',
    execute(message, args) {
        var channelID = args[0].replace(/<|#|>/g, "") //strip snowflake id to reference channel directly
        var channel1 = message.guild.channels.cache.get(channelID)
        message.channel.send("Deleting " + channel1.name)
        channel1.delete().then(message.channel.send("error while deleting channel!"))
    },
};
