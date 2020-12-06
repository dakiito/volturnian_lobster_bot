module.exports = {
    name: 'clearcategory',
    args: true,
    perms: true,
    permission: `MANAGE_CHANNELS`,
    description: 'clears a category of any voice chats ',
    usage: '<category ID>',
    execute(message, args) {
        var parentID = args[0]
            .replace(/<|#|>/g, "") //strip snowflake id of any obstructive characters

        const parent = message.guild.channels.cache.get(parentID)
        message.channel.send("Deleting voice channels in category " + parent.name)
        parent.children.filter(cha => cha.type === "voice").forEach(cha => {
            cha.delete()
        });
    }
}
