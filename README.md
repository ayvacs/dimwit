# Dimwit

Mess around with images and GIFs on Discord!


## Hosting

### Configuration

Create a `config.json` file in the root directory with the following information:

* `token`: Your bot's token
* `clientId`: Your app's application ID (as a string, not a number)
* `guildId`: ID of a testing guild (as a string, not a number)
* `inviteLink`: A URL that people can use to add the bot to the server (it is recommended to use `277025770496` for permissions and `bot+applications.commands` for scope)

### Refresh slash commands

* Run `npm run deploy-commands-guild` to refresh commands only for the testing guild (as defined in `config.json`)
* Run `npm run deploy-commands-global` to refresh commands for all guilds (only after testing has been completed in a private guild)
* Run `npm run flush-commands` if you want to reset guild and global commands (do not run this if you do not know what you are doing; takes ~1 hour for changes to reflect on Discord's side)

## Acknowledgements

* This repository uses code from `discord.js`, which is licensed under the Apache license. Its source code is viewable at [https://github.com/discordjs/discord.js](https://github.com/discordjs/discord.js).