module.exports = {
    name: 'clearservervc',
    args: false,
    perms: true,
    permission: `MANAGE_CHANNELS`,
    description: 'clears a server of any voice chats ',
    usage: '<category ID>',
    execute(message, args) {
        message.channel.send("Deleting voice channels in server " + message.guild.name)

        var textChats = message.guild.channels.cache
            .filter((ch) => ch.type === 'voice')
            .array()
            .forEach(ch => {
                ch.delete()
            });
    }
}
