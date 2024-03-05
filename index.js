/*

    index.js

    Backbone



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



// Require node classes
const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;

// Require discord.js classes
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require("discord.js");

// Require bot classes and methods
const config = require("./config.json");
const statuses = require("./assets/statuses.json").messages;
const createEmbed = require("./modules/create-embed.js");


// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// Set up all of the commands in the "commands" folder and its subfolders

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Loop through each file in the "commands" folder and its subfolders
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the client.commands Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            console.log(`Successfully added command "${command.data.name}"`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
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

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                embeds: [createEmbed.error("There was an error while executing this command.")],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                embeds: [createEmbed.error("There was an error while executing this command.")],
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
    // Function to change the presence
    function setStatusMessage(previous) {
        let current = previous;

        while (current == previous) {
            current = statuses[parseInt(Math.random() * statuses.length)];
        }

        console.log(`Changing status to "Playing ${current}"`);
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
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // Choose a status
    let currentStatus = setStatusMessage();

    // Cycle through the statuses every so often
    while (true) {
        await wait(120_000); // 1_000 = 1 second
        currentStatus = setStatusMessage(currentStatus);
    }
});



// Log in to Discord with the bot's token
client.login(config.token);