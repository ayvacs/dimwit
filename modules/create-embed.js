/*

    create-embed.js

    Module exporting various functions to create Embeds based on the user's
    specifications. Intended to be an easy way for all embeds created by the bot
    to match a similar style.



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


    This file uses code from the "discord.js" library. "discord.js" is licensed
    under the Apache license. Its source code is viewable at
    <https://github.com/discordjs/discord.js>.

*/



const { EmbedBuilder } = require('discord.js');


const self = {};

self.message = function(text, color) {
    return new EmbedBuilder()
        .setColor(color ? color : "#FFFFFF")
        .setDescription(text ? text : "(empty embed");
}

self.warning = function(text) {
    return self.message(text).setColor("#EB9634");
}

self.error = function(text) {
    return self.message(text).setColor("#EB4034");
}


module.exports = self;