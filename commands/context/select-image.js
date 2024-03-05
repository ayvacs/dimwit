/*

    select-image.js

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


    This file uses code from the "discord.js" library. "discord.js" is licensed
    under the Apache license. Its source code is viewable at
    <https://github.com/discordjs/discord.js>.

*/



const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const createEmbed = require("../../modules/create-embed.js");
const { setUser } = require("../../modules/user-cache.js");


module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Select Image for Next Command")
        .setType(ApplicationCommandType.Message),

    
    async execute(interaction) {
        // Let Discord know the interaction was received
        await interaction.deferReply();

        if (interaction.targetMessage == null) {
            await interaction.editReply({
                ephemeral: true,
                embeds: [createEmbed.message("To use this command, you'll need to right-click on an image and click the \"Apps\" button.")]
            });
            return;
        }

        const senderId = interaction.user.id;
        const attachment = interaction.targetMessage.attachments.at(0);
        if (attachment == null) {
            await interaction.editReply({
                ephemeral: true,
                embeds: [createEmbed.message("I can't find an attachment in this message!")]
            });
            return;
        }

        setUser(senderId, "savedImage", attachment)

        await interaction.editReply({
            ephemeral: true,
            embeds: [createEmbed.message("Got it! This image will be used for your next message, unless you upload a different one.")]
        });
    }
}