<div align="center">
    <br>
    <!-- Wordmark -->
    <p>
        <a href="https://github.com/ayvacs/dimwit"><img alt="Dimwit logo" width="550" src="https://raw.githubusercontent.com/ayvacs/dimwit/main/assets/logos/wordmark-min.png"></a>
    </p>
    <br>
    <!-- Badges -->
    <p>
        <img alt="Repository license" src="https://img.shields.io/github/license/ayvacs/dimwit">
        <img alt="Repository commit activity" src="https://img.shields.io/github/commit-activity/w/ayvacs/dimwit">
        <img alt="Repository Scrutinizer quality" src="https://img.shields.io/scrutinizer/quality/g/ayvacs/dimwit">
    </p>
</div>

## About

Mess around with images and GIFs on Discord! Dimwit is a Discord.js bot that introduces numerous funny image-related commands.

## Packages

* `discord.js` ([source](https://github.com/discordjs/discord.js)) - A powerful Node.js module for interacting with the Discord API
* `gifencoder` ([source](https://www.npmjs.com/package/gifencoder)) - A serveer-side gif generation module for Node.js
* `@napi-rs/canvas` ([source](https://github.com/Brooooooklyn/canvas)) - An image manipulation tool that enables many of Dimwit's image commands

## Hosting

### Configuration

Create a `config.json` file in the root with the following information:

* `token`: Your bot's token
* `clientId`: Your app's application ID (string)
* `guildId`: ID of a testing guild (string)

You may also want to add the following information, which is not required for the bot to run but may be required for certain features:

* `inviteLink`: A URL that people can use to add the bot to the server (it is recommended to use `277025770496` for permissions and `bot+applications.commands` for scope)

### Node commands

| Command | Details |
| - | - |
| `npm run deploy-commands` | Refresh commands for the testing guild (as defined in `config.json`) then all guilds. Should be ran only after testing has been completed in a private guild. |
| `npm run deploy-commands-guild` | Refresh commands for the testing guild (as defined in `config.json`). |
| `npm run deploy-commands-global` | Refresh commands for all guilds. Should be ran only after testing has been completed in a private guild.
| `npm run flush-commands` | Reset global and guild commands. Don't run this if you don't know what you're doing. It takes around an hour for the changes to reflect on Discord's end.