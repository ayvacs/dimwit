<div align="center">
    <br>
    <!-- Wordmark -->
    <p>
        <a href="https://github.com/ayvacs/dimwit"><img alt="Dimwit logo" width="550" src="https://raw.githubusercontent.com/ayvacs/dimwit/main/res/logos/wordmark-min.png"></a>
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

* Multiple image-related commands, and a small set of useful utility commands
  * All features fully work with all widely-used image formats, including GIFs
* A cache that allows users to select an already-uploaded image to use in their command without re-uploading it
  * The cache automatically saves, persisting between sessions

## Hosting

### Requirements

* `node.js` (≥ 20.11.1)
* `npm` (≥ 10.2.4)

### Build and run

* Install dependencies: `npm i`
* Build JS files: `npm run build`
* Run: `npm start`

### Configuration

Create a `config.json` file in `.config/` with the following information:

#### Required

| Name       | Details                            |
| ---------- | ---------------------------------- |
| `token`    | Your bot's token                   |
| `clientId` | Your app's application ID (string) |
| `guildId`  | ID of a testing guild (string)     |

#### Only required for certain features

You may also want to add the following information, which is not required for the bot to run but may be required for certain features:

| Name                | Default | Details                                                                                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doAdvancedLogging` | `false` | Suppress outputs that are usually unnecessary                                                                                                              |
| `inviteLink`        |         | A URL that people can use to add the bot to the server (it is recommended to use `277025770496` for permissions and `bot+applications.commands` for scope) |

## Node scripts

| Command                   | Details                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `npm test`                | Build and start.                                                                                                  |
| `npm run build`           | Compile all .ts files in `src/` to .js files in `dist/`. This will delete everything in the `dist/` folder first. |
| `npm run update-commands` | **Requires that you compiled to .js with `npm run build`!** Allows you to refresh and flush commands.             |