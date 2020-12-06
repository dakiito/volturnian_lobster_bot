module.exports = {
    name: 'cleartextchats',
    args: true,
    perms: true,
    permission: `MANAGE_CHANNELS`,
    description: 'clears desired amount of text chats created by the bot. ',
    usage: '<amount> <channel topic>',
    execute(message, args) {
        var channelAmount = Number(args[0]);
        var channelTopic = args[1]

        var textChats = message.guild.channels.cache //filter from all channels in the server
            .filter((ch) => ch.type === 'text' && ch.topic === channelTopic) //to see whether they have the specific topic
            .array()

        for (var i = 0; i < channelAmount; i++) {
            textChats[i].delete()
        }
        message.channel.send("channels cleared!")
    }

}
