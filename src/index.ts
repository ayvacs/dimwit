/*

    index.ts

    The bot's main script that registers a Client, finds, builds, and registers
    each command to the Client, handles command parsing, and manages statuses.



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the
    terms of the GNU General Public License as published by the Free Software
    Foundation, either version 3 of the License, or (at your option) any later
    version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY
    WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
    details.

    You should have received a copy of the GNU General Public License along with
    Dimwit. If not, see <https://www.gnu.org/licenses/>.

*/



// Requires

const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;

const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require("discord.js");

const config = require("../config.json");
const statuses = require("./assets/statuses.json").messages;
const createEmbed = require("./modules/create-embed.js");
const print = require("./modules/print.js");


// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// Set up all of the commands in the "commands" folder and its subfolders
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Create a Collection consisting of each command
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the client.commands Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            print.log("Command-Collector", `Successfully collected command: ${command.data.name}`);
        } else {
            print.warn("Command-Collector", `The command at ${filePath} is mising a required "data" and/or "execute" property and has been skipped.`);
        }
    }
}


//*************************************************
// SLASH COMMANDS AND CONTEXT MENU COMMANDS HANDLER
//*************************************************

client.on(Events.InteractionCreate, async interaction => {
    // Do not reply to interactions that are not slash commands or context menu commands
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    // This should probably never happen
    if (!command) {
        print.error("Command-Handler", `No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                embeds: [createEmbed.error("There was an unknown error while executing this command. If you're self-hosting, check the npm console as more information has been printed there.")],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                embeds: [createEmbed.error("There was an unknown error while executing this command. If you're self-hosting, check the npm console as more information has been printed there.")],
                ephemeral: true
            });
        }
    }
});



//*********************
// CLIENT READY HANDLER
//*********************

// This function runs when the client is ready, only once
client.once(Events.ClientReady, async readyClient => {

    // Function to change the presence, returning the choice, and optionally providing a specific status to ignore.
    function setStatusMessage(exclude = "") {
        let current = exclude;

        while (current == exclude) {
            current = statuses[Math.floor(Math.random() * statuses.length)];
        }
        print.log("Client", `Changing status to "Playing ${current}"`);
        readyClient.user.setPresence({
            status: "dnd",
            activities: [{
                name: current,
                type: ActivityType.Playing
            }]
        })

        return current;
    }

    // Log when the client is ready
    print.log("Client", `Ready! Logged in as ${readyClient.user.tag}`);

    // Choose an initial status
    let currentStatus = setStatusMessage();

    // Cycle through the statuses every so often
    while (true) {
        await wait(120_000); // 1_000 = 1 second
        currentStatus = setStatusMessage(currentStatus);
    }

});



// Log in to Discord with the bot's token
client.login(config.token);