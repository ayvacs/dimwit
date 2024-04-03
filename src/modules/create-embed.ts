/**
 *
 * create-embed.ts
 *
 * Module exporting various functions to create Embeds based on the user's
 * specifications. Intended to be an easy way for all embeds created by the bot
 * to match a similar style.
 *
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
const { EmbedBuilder } = require("discord.js");


module.exports = {

    // WHITE: For general messages
    message: function(text: string = "?", title: string = null): typeof EmbedBuilder {
        const embed = new EmbedBuilder()
            .setDescription(text)
            .setColor("#FFFFFF");

        if (title !== null)
            embed.setTitle(title);

        return embed;
    },

    // ORANGE: For warnings
    warning: function(text: string, title: string): typeof EmbedBuilder {
        return this.message(text, title)
            .setColor("#EB9634");
    },

    // RED: For errors
    error: function(text: string, title: string = "Oops, there was an error!"): typeof EmbedBuilder {
        return this.message(text, title)
            .setColor("#EB4034")
            .setFooter({
                "text": "If you didn't do anything wrong, you can report a bug by running /bug"
            });
    },

    // GREEN: For confirmation
    affirm: function(text: string): typeof EmbedBuilder {
        return this.message(text)
            .setColor("#34EB4C");
    }

}