/*

    bug.ts

    A command file

    Provides the user with a link to report a bug on GitHub



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



import type { ChatInputCommandInteraction } from "discord.js";
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const createEmbed = require("../../modules/create-embed.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("Found a bug? Report it here!"),
    
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            ephemeral: true,
            embeds: [createEmbed.message("We're trying our best to build a high-quality bot. Your bug reports are greatly appreciated!", "Found a bug?")],
            components: [
                new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setLabel("Open GitHub")
                        .setURL("https://github.com/ayvacs/dimwit/issues/new")
                        .setStyle(ButtonStyle.Link))
            ]
        });
    }
}