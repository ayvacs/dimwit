/*

    index.js

    Backbone



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/



// Require discord.js classes

const fs = require("node:fs");
const path = require("node:path");
const wait = require("node:timers/promises").setTimeout;
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require("discord.js");

const CONFIG = require("./config.json");
const STATUSES = require("./assets/statuses.json").messages;


// Functions

// Get a random status that is not equal to the parameter and return it as a string
function getRandomStatus(exclude) {
    let status = exclude;

    while (true) {
        if (status != exclude) {
            break;
        }
        status = STATUSES[parseInt(Math.random() * STATUSES.length)];
    }

    return status;
}


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
            console.log(`Successfully added command /${command.data.name}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
        }
    }
}


// ************************************************
// SLASH COMMANDS AND CONTEXT MENU COMMANDS HANDLER
// ************************************************

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
            await interaction.followUp({ content: "There was an error while executing this command.", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error while executing this command.", ephemeral: true });
        }
    }
});



// ********************
// CLIENT READY HANDLER
// ********************

// This function runs when the client is ready, only once
client.once(Events.ClientReady, async readyClient => {
    // Function to change the presence
    function setStatusMessage(text) {
        console.log(`Changing status to ${text}`);
        readyClient.user.setPresence({
            status: "dnd",
            activities: [{
                name: text,
                type: ActivityType.Playing
            }]
        })
    }


    // Let us known when the client is ready
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    // Choose a status
    let currentStatus = getRandomStatus("_");
    setStatusMessage(currentStatus);

    // Cycle through the statuses every so often
    while (true) {
        await wait(60_000); // 1_000 = 1 second
        currentStatus = getRandomStatus(currentStatus);
        setStatusMessage(currentStatus);
    }
});



// Log in to Discord with the bot's token
client.login(CONFIG.token);