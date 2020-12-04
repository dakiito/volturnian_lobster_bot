const Discord = require('discord.js') //need this for embeds


module.exports = {
    name: "roulette",
    args: true,
    description: "russian roulette game",
    usage: "<@person to verse>",
    async execute(message, args) {
        const embed = new Discord.MessageEmbed(),
            filter = (reaction, user) => {
                return ['1️⃣', '2️⃣']
                    .includes(reaction.emoji.name) && (user.id === players[currentPlayer].id)
            },
            reactions = { "1️⃣": 1, "2️⃣": 2, } //its an object for ease of converting between number and array
        var players = {
                0: message.author
            },
            userlist = message.mentions.users.array(),
            maxplayers = userlist.length,
            currentPlayer = 0,
            reactionArray = Object.keys(reactions), //turns reactions into an array
            currentAction,
            gameOver,
            chamber,
            msg,
            playerDescription = ''

        console.log(`setting up roulette...`)
        setupRoulette()

        async function setupRoulette() {
            for (var i = 0; i < userlist.length; i++) {
                players[i + 1] = userlist[i]
            }
            let randomnumber = random(0, 6)
            chamber = Array(6)
            chamber[randomnumber] = true //make random cylinder contain the bullet
            currentPlayer = random(0, userlist.length + 1)

            for (var i = 0; i < userlist.length + 1; i++) {
                if (i == currentPlayer) {
                    playerDescription += `\n ${players[i]}🔫`
                }
                else {
                    playerDescription += `\n ${players[i]}`
                }
            }

            console.log(`current player: ${currentPlayer} \n bullet is in no.${randomnumber} cylinder`)

            embed.setTitle("Russian Roulette")
            embed.addFields({ name: `1️⃣️`, value: `to spin the chamber, press 1️`, inline: true }, { name: `2️⃣`, value: `to pull the trigger as is, press 2`, inline: true })
            embed.setFooter(`${players[currentPlayer].username}'s turn`)
            embed.setDescription(playerDescription);

            msg = await message.channel.send(embed)
            reactionArray.forEach(reaction => {
                msg.react(reaction);
            });
            waitForReaction()
        }

        async function handleTurn() {

            switch (currentAction) {
                case 1:
                    if (chamber[0])
                        sendDelete(`${players[currentPlayer]} dodged a bullet by spinning the chamber!`)
                    else
                        sendDelete(`the bullet was ${chamber.findIndex((b) => b==true)} chambers away`)

                    chamber = Array(6) //clear the chamber and get a random bullet
                    chamber[random(0, 6)] = true
                    if (chamber[0]) { //bullet is in the chamber
                        message.channel.send(`${players[currentPlayer]} has lost.`)
                        gameOver = true;
                    }
                    else {
                        //*click*
                        sendDelete(`${players[currentPlayer]} pulls the trigger. Everyone hears a *click*.`)
                        chamber[6] = chamber.shift()
                    }
                    break;
                case 2:
                    if (chamber[0]) {
                        sendDelete(`${players[currentPlayer]} has lost. Game over.`)
                        gameOver = true;
                    }
                    else { //moves the first chamber to the last
                        sendDelete(` ${players[currentPlayer]}pulls the trigger. Everyone hears a *click*.`)
                        chamber[6] = chamber.shift()
                    }
                    break;
            }
            if (currentPlayer + 1 > maxplayers) { //rotate players
                currentPlayer = 0
            }
            else {
                currentPlayer++
            }
            updateMessage()
        }

        function closeGame() {
            embed.setTitle("Game Over")
            embed.setDescription(`${players[currentPlayer]} has lost.`)
            msg.edit(embed)
        }

        function updateMessage() {
            if (gameOver) {
                closeGame()
            }
            else {
                console.log(`current player: ${currentPlayer}`)
                playerDescription = '' //clear the description
                for (var i = 0; i < userlist.length + 1; i++) {
                    if (i == currentPlayer) {
                        playerDescription += `\n ${players[i]}🔫`
                    }
                    else {
                        playerDescription += `\n ${players[i]}`
                    }
                };
                embed.setFooter(`${players[currentPlayer].username}'s turn`)
                embed.setDescription(playerDescription)
                msg.edit(embed)
                waitForReaction()
            }
        }
        async function waitForReaction() {
            await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    reactionArray.forEach(emoji => {
                        if (reaction.emoji.name === emoji) {
                            currentAction = reactions[emoji] //save the number selected
                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(players[currentPlayer].id));
                            //find the reaction made by current player
                            for (const uReaction of userReactions.values()) {
                                uReaction.users.remove(players[currentPlayer].id); //remove current player's reaction
                            }
                        }
                    });
                    handleTurn()
                })
                .catch(collected => {
                    message.channel.send(`${players[currentPlayer]} timed out. Game over.`);
                    gameOver = true;
                })
        }

        async function sendDelete(text) {
            message.channel.send(text)
                .then(msg => {
                    msg.delete({ timeout: 5000 })
                })
                .catch(console.error);
        }

        function random(min, max) {
            return Math.floor(Math.random() * max) + min
        }
    }
}
