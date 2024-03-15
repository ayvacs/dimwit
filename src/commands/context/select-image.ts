/*

    select-image.ts

    A context menu command file

    Provides the user with a way to select an image (Attachment instance)
    previously sent to Discord that can then be used in a command.



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



import type { MessageContextMenuCommandInteraction } from "discord.js";
const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const createEmbed = require("../../modules/create-embed.js");
const { setUser } = require("../../modules/user-cache.js");


module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Select Image for Next Command")
        .setType(ApplicationCommandType.Message),

    
    async execute(interaction: MessageContextMenuCommandInteraction) {
        // Let Discord know the interaction was received
        await interaction.deferReply({ ephemeral: true });

        // Ensure that the message still exists
        if (interaction.targetMessage == null) {
            await interaction.editReply({
                embeds: [createEmbed.warning("To use this command, you'll need to right-click on an image and click the \"Apps\" button.")]
            });
            return;
        }

        // TODO: add support for multiple attachments
        const attachment = interaction.targetMessage.attachments.at(0);
        if (attachment == null) {
            await interaction.editReply({
                embeds: [createEmbed.error("I can't find an attachment in this message!")]
            });
            return;
        }

        try {
            setUser(interaction.user.id, "savedImage", attachment);
    
            await interaction.editReply({
                embeds: [createEmbed.affirm("Got it! This image will be used for your next message, unless you upload a different one.")]
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                embeds: [createEmbed.error("There was an unknown error while executing this command. If you're self-hosting, check the npm console as more information has been printed there.")]
            });
        }
    }
}