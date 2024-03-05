/*

    flush-commands.js (npm run flush-commands)

    Reset guild AND global commands (takes ~1 hour). This removes all registered
    commands from the bot. In order for them to function again, they will need
    to be added back with `npm run deploy-commands-guild` or `npm run
    deploy-commands-global`.



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




const { guildId } = require("../config.json");



// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Flush guild commands (immediate)
client.guilds.cache.get(guildId).commands.set([]);

// Flush application commands (~1 hour)
client.application.commands.set([]);