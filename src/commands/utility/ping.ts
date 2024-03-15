/*

    ping.ts

    A command file

    A simple command that reports the user's latency. It also functions as a
    quick test to ensure the bot is working properly.



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
const { SlashCommandBuilder } = require("discord.js");
const createEmbed = require("../../modules/create-embed.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Measure your latency"),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const message = await interaction.reply({
            ephemeral: true,
            fetchReply: true,
            embeds: [createEmbed.message("🏓 Pong?")]
        });

        await interaction.editReply({
            embeds: [createEmbed.affirm(`🏓 Pong! Your latency is ${Date.now() - interaction.createdTimestamp}ms.`)]
        });
    }
}