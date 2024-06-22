/**
 * invite.ts
 *
 * A command file
 *
 * A simple command that replies with a button to invite this instance of the
 * bot to another server
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
import type { ChatInputCommandInteraction } from "discord.js";
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

// Utils
const createEmbed = require("../../modules/create-embed.js");
const settings = require("../../modules/settings.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite Dimwit to another server"),
    
    async execute(interaction: ChatInputCommandInteraction) {
        if (!("inviteLink" in settings)) {
            await interaction.reply({
                ephemeral: true,
                fetchReply: true,
                embeds: [createEmbed.error("I don't have an invite link in my config.json file!")]
            });
            return;
        }

        await interaction.reply({
            ephemeral: true,
            embeds: [createEmbed.message("Here's your invite link!")],
            components: [
                new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setLabel("Invite me to another server")
                        .setURL(settings.inviteLink)
                        .setStyle(ButtonStyle.Link))
            ]
        });
    }
}