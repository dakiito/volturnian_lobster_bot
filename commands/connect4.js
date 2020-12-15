const Discord = require('discord.js')


module.exports = {
    name: "connect4",
    args: true,
    description: 'connect 4 game',
    usage: '<@ of person to verse>',
    aliases: ["c4"],
    async execute(message, args) {
        var board = [],
            boardStr = '',
            msg,
            currentPlayer = false, //false = player1 true = player2
            currentColumn,
            gameOver = false,
            spacer = " ​ ​ ​ ​ ​ ​ ​";

        const players = {
            false: message.author,
            true: message.mentions.users.first()
        }
        const embed = new Discord.MessageEmbed()
        const tiles = {
            empty: ':white_circle:',
            false: '🔵',
            true: '🔴',
            winTile: `🟡`
        }
        const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']
                .includes(reaction.emoji.name) && (user.id === players[currentPlayer].id)
        };
        const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7 }
        var reactionArray = Object.keys(reactions)

        setupBoard();
        sendEmbed();


        function setupBoard() {
            for (var i = 0; i < 6; i++) {
                board.push([]); // Creates an empty line
                board[i].push(new Array(7)); // Adds array with size of 7 to the empty line:
                for (var j = 0; j < 7; j++) {
                    board[i][j] = tiles.empty;
                    boardStr += board[i][j] + spacer
                }
                boardStr += "\n \n" //add line break
            }
            embed.setTitle(`${players[currentPlayer].username}'s turn`)
            embed.setDescription(boardStr)
            embed.setFooter(`Player one: ${players[false].username} Player two: ${players[true].username}`)

        }

        async function sendEmbed() {
            msg = await message.channel.send(embed)
            reactionArray.forEach(reaction => {
                msg.react(reaction);
            });
            waitForReaction()
        }

        async function waitForReaction() {
            await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    reactionArray.forEach(emoji => {
                        if (reaction.emoji.name === emoji) {
                            currentColumn = reactions[emoji] //save the row selected by user
                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(players[currentPlayer].id));
                            //find the reaction made by current player
                            for (const uReaction of userReactions.values()) {
                                uReaction.users.remove(players[currentPlayer].id); //remove current player's reaction
                            }
                        }
                    });

                    handleTurn(reaction)
                })
                .catch(collected => {
                    message.channel.send(`${players[currentPlayer]} timed out. Game over.`);
                    gameOver = true;
                })
        }

        async function handleTurn(reaction) {

            for (var i = 5; i > -1; i--) {
                if (board[i][currentColumn - 1] === tiles.empty) {
                    board[i][currentColumn - 1] = tiles[currentPlayer] //add check for ceiling
                    if (!checkForWinner()) {
                        currentPlayer = !currentPlayer //change players
                        updateBoard()
                        waitForReaction() //if game is not over, continue
                    }
                    else {
                        updateBoard()
                        closeGame()
                    }
                    i = -1 //stop looping if tile has been placed
                }
                else if (board[0][currentColumn - 1] != tiles.empty) {
                    sendDelete(`${players[currentPlayer]} stop trying to put a tile there, the row is full!`)
                    waitForReaction()
                    i = -1
                }
            }
        }

        function updateBoard() {
            boardStr = "";
            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    boardStr += board[i][j] + spacer
                }
                boardStr += "\n \n" //add line break
            }
            embed.setTitle(`${players[currentPlayer].username}'s turn`)
            embed.setDescription(boardStr)
            msg.edit(embed)
        }

        function closeGame() {
            embed.setTitle(`Game Over, ${players[currentPlayer].username} has won`)
            msg.edit(embed)
        }

        function checkForWinner() {
            var win = false,
                HEIGHT = 6,
                WIDTH = 7;

            for (var r = 0; r < HEIGHT; r++) { // iterate rows, bottom to top
                for (var c = 0; c < WIDTH; c++) { // iterate columns, left to right
                    var tile = board[r][c];
                    if (tile == tiles.empty)
                        continue; // don't check empty slots

                    if (c + 3 < WIDTH && //check to not go further than the board
                        tile == board[r][c + 1] && // look right
                        tile == board[r][c + 2] &&
                        tile == board[r][c + 3]) {
                        board[r][c] = tiles.winTile
                        board[r][c + 1] = tiles.winTile
                        board[r][c + 2] = tiles.winTile
                        board[r][c + 3] = tiles.winTile
                        win = true
                    }
                    if (r + 3 < HEIGHT) {
                        if (tile == board[r + 1][c] && // look up
                            tile == board[r + 2][c] &&
                            tile == board[r + 3][c]) {
                            board[r][c] = tiles.winTile
                            board[r + 1][c] = tiles.winTile
                            board[r + 2][c] = tiles.winTile
                            board[r + 3][c] = tiles.winTile
                            win = true
                        }
                        if (c + 3 < WIDTH &&
                            tile == board[r + 1][c + 1] && // look up & right
                            tile == board[r + 2][c + 2] &&
                            tile == board[r + 3][c + 3]) {
                            board[r][c] = tiles.winTile
                            board[r + 1][c + 1] = tiles.winTile
                            board[r + 2][c + 2] = tiles.winTile
                            board[r + 3][c + 3] = tiles.winTile
                            win = true
                        }
                        if (c - 3 >= 0 &&
                            tile == board[r + 1][c - 1] && // look up & left
                            tile == board[r + 2][c - 2] &&
                            tile == board[r + 3][c - 3]) {
                            board[r][c] = tiles.winTile
                            board[r + 1][c - 1] = tiles.winTile
                            board[r + 2][c - 2] = tiles.winTile
                            board[r + 3][c - 3]
                            win = true
                        }
                    }
                }
            }
            return win;
            //this iterates through every tile by checking if the same tile repeats itself
            //unless the tile is an empty tile, in which case it skips the loop
            //I think this algorithm is less efficent than a check for every direction from where the tile is placed in the case
            // that the board is less than 1/3ds full
            //I really like this algorithm because it can check every win without looking in all 8 directions
        }
        async function sendDelete(text) {
            message.channel.send(text)
                .then(msg => {
                    msg.delete({ timeout: 5000 })
                })
                .catch(console.error);
        }

    }
}
