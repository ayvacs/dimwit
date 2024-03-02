/*

    flush-commands.js

    Reset guild AND global commands (takes ~1 hour)



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/




const { guildId } = require("./config.json");



// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Flush guild commands (immediate)
client.guilds.cache.get(guildId).commands.set([]);

// Flush application commands (~1 hour)
client.application.commands.set([]);