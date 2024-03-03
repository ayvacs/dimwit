/*

    deploy-commands-guild.js
        (npm run deploy-commands-guild)

    Register and update slash commands to the development guild. It is necessary to perform these functions in a separate file that is called only when changes to their definition (description, options, etc.) are made since:
    * commands need to be registered only once
    * it is only necessary to update them when changes to their definition (description, options, etc.) are made
    * there is a daily limit on command creation/update



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/



const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];


// Loop through each file in the "commands" folder and its subfolders

const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            let data = command.data;
            if (data.description != null) {
                data.description = "[GUILD] " + data.description;
            }

            commands.push(data.toJSON());
            console.log(`Identified command /${command.data.name}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
        }
    }
}


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);


// Deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} slash commands`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        )

        console.log(`Successfully reloaded ${data.length}/${commands.length} slash commands to guild ${guildId}`);
    } catch (error) {
        console.error(error);
    }
})();