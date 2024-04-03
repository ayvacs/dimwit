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

const { clientId, guildId, token } = require("../.config/config.json");


// Initialize REST API
const rest = new REST().setToken(token);


// Ask a question
function ask(query = "") {
    return rls.question("\n" + query + "\n> ");
}


// Flush guild and global commands
function flushCommands() {
    // Flush guild commands
    console.log("Flushing guild commands");
    rest.put(
        Routes.applicationGuildCommands(clientId, guildId), {
            body: []
        }
    ).then(
        () => console.log("Successfully deleted all guild commands")
    ).catch(
        console.error
    );

    // Flush global commands
    console.log("Flushing global commands");
    rest.put(
        Routes.applicationCommands(clientId, guildId), {
            body: []
        }
    ).then(
        () => console.log("Successfully deleted all global commands")
    ).catch(
        console.error
    );
}

// Return an array of all commands
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

console.log(
`Choose an option:
    1. Deploy commands globally
    2. Deploy commands to guild
    3. Deploy commands globally and to guild
    4. Flush commands
    5. Exit without doing anything`
);

let choice = -1;
while (choice < 1 || choice > 5) {
    choice = ask("Select an option from the above choices.");
}


if (choice == 1) {

    deployCommands(commands, false);

} else if (choice == 2) {

    deployCommands(commands, true);

} else if (choice == 3) {

    deployCommands(commands, false);
    deployCommands(commands, true);

} else if (choice == 4) {

    flushCommands();

} else if (choice == 5) {

}