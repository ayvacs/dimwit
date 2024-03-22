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
        <img alt="Repository Scuritinizer build pass/fail" src="https://scrutinizer-ci.com/g/ayvacs/dimwit/badges/build.png?b=main">
    </p>
</div>

## About

Mess around with images and GIFs on Discord! Dimwit is a Discord bot that introduces numerous funny image-related commands. Written in TypeScript.

## Hosting

### Requirements

* `node.js` (≥ 20.11.1)
* `npm` (≥ 10.2.4)

### Build and run

* Install dependencies: `npm i`
* Build JS files: `npm run build`
* Run: `npm start`

### Configuration

Create a `config.json` file in the root with the following information:

* `token`: Your bot's token
* `clientId`: Your app's application ID (string)
* `guildId`: ID of a testing guild (string)

You may also want to add the following information, which is not required for the bot to run but may be required for certain features:

* `inviteLink`: A URL that people can use to add the bot to the server (it is recommended to use `277025770496` for permissions and `bot+applications.commands` for scope)

## Node scripts

| Command | Details |
| - | - |
| `npm test` | Build and start. |
| `npm run build` | Compile all .ts files in `src/` to .js files in `dist/`. This will clear everything in the `dist/` folder first, and will also copy all non-JS contents of `src/` to `dist/`. |
| `npm run deploy-commands` | **Requires that you compiled to .js with `npm run build`!** Refresh commands for the testing guild (as defined in `config.json`) then all guilds. Should be ran only after testing has been completed in a private guild. |
| `npm run deploy-commands-guild` | **Requires that you compiled to .js with `npm run build`!** Refresh commands for the testing guild (as defined in `config.json`). |
| `npm run deploy-commands-global` | **Requires that you compiled to .js with `npm run build`!** Refresh commands for all guilds. Should be ran only after testing has been completed in a private guild. |
| `npm run flush-commands` | Reset global and guild commands. |