# Dimwit

Mess around with images and GIFs on Discord!

## Acknowledgements

* This repository uses code from `discord.js`, which is licensed under the Apache license. Its source code is viewable at [https://github.com/discordjs/discord.js](https://github.com/discordjs/discord.js).

## Hosting

### Set up bot

Create a `config.json` file in the root directory with the following information:

* `token`: Your bot's token
* `clientId`: Your app's application ID (as a string, not a number)
* `guildId`: ID of a testing guild (as a string, not a number)
* `inviteLink`: A URL that people can use to add the bot to the server (it is recommended to use `277025770496` for permissions and `bot+applications.commands` for scope)

### Refresh slash commands

* Run `node scripts/deploy-commands-guild.js` to refresh commands only for the testing guild (as defined in `config.json`)
* Run `node scripts/deploy-commands-global.js` to refresh commands for all guilds (only after testing has been completed in a private guild)
* Run `node scripts/flush-commands.js` to reset guild and global commands (takes ~1 hour)