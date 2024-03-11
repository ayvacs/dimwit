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

*/



const { EmbedBuilder } = require('discord.js');


const self = {};

// WHITE: For general messages
self.message = function(text, title) {
    // Create a blank embed first and replace the values provided by the user after.
    const embed = new EmbedBuilder()
        .setDescription(text ? text : "?")
        .setColor("#FFFFFF");

    if (title != null)
        embed.setTitle(title);

    return embed;
}

// ORANGE: For warnings
self.warning = function(text, title) {
    return self.message(text, title)
        .setColor("#EB9634");
}

// RED: For errors
self.error = function(text, title) {
    return self.message(text)
        .setTitle(title ? title : "Oops, there was an error!")
        .setColor("#EB4034")
        .setFooter({
            "text": "If you didn't do anything wrong, you can report a bug by running /bug"
        });
}

// GREEN: For confirmation
self.affirm = function(text) {
    return self.message(text)
        .setColor("#34EB4C");
}


module.exports = self;