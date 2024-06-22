/**
 * update-commands.js
 *
 * A utility script
 *
 * Provides options to deploy and flush commands
 *
 * This file is part of Dimwit.
 *
 * Dimwit is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Dimwit. If not, see <https://www.gnu.org/licenses/>.
 */



// Node imports
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const rls = require("readline-sync"); // should probably switch this for something else

const { clientId, guildId, token } = require("../dist/modules/settings.js");


// Initialize REST API
const rest = new REST().setToken(token);


// Function to flush guild commands
async function flushGuildCommands() {
    console.log(`\nFlushing guild commands (guildId: ${guildId})...`);
    await rest.put( Routes.applicationGuildCommands(clientId, guildId), { body: [] } )
        .then( () => console.log("Successsfully flushed guild commands.") )
        .catch( console.error );
};

// Function to flush global commands
async function flushGlobalCommands() {
    console.log("Flushing global commands...");
    await rest.put( Routes.applicationCommands(clientId), { body: [] } )
        .then( () => console.log("Successfully flushed global commands.") )
        .catch( console.error );
};

// Get an array of all commands
function getCommands(prefixGuildCommands) {
    const commands = [];

    const foldersPath = path.join(__dirname, "../dist/commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {
                let data = command.data;
                if (prefixGuildCommands && data.description != null)
                    data.description = "[GUILD] " + data.description;

                commands.push(data.toJSON());
                console.log(`Identified command "${command.data.name}"`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
            }
        }
    }

    return commands;
}

// Deploy commands
async function deployCommands(cmds, toGuild) {
    // which function should we use
    const deployFunc = toGuild
        ? Routes.applicationGuildCommands
        : Routes.applicationCommands

    try {
        console.log(`Reloading ${commands.length} commands...`);

        const data = await rest.put(
            deployFunc(clientId, guildId),
            { body: commands }
        )

        console.log(
            `Successfully reloaded ${data.length}/${commands.length} commands ${
                toGuild
                    ? `to guild ${guildId}`
                    : "globally"
            }`
        );
    } catch (error) {
        console.error(error);
    }
}

// Get commands
const commands = getCommands();

// Use an async function so that we can await
(async () => {

console.log(
`


Please ensure that you have built with 'npm run build'!

Choose an option:
    1. Deploy commands globally
    2. Deploy commands to guild
    3. Deploy commands globally and to guild
    4. Flush commands
    5. Exit without doing anything`
);

// Ask the user to select an option
let choice = -1;
while (choice < 1 || choice > 5)
    choice = parseInt(rls.question("\nSelect an option from the above choices.\n> "));

console.log();

// Perform the desired operation
switch (choice) {
    case 1:
        await deployCommands(commands, false);
        break;
    case 2:
        await deployCommands(commands, true);
        break;
    case 3:
        await deployCommands(commands, false);
        await deployCommands(commands, true);
        break;
    case 4:
        await flushGlobalCommands();
        await flushGuildCommands();
        break;
    case 5:
        break;

};

} )();