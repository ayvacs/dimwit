/*

    caption.js

    A command file

    Add a caption to the top of an image inputted by the user.



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



const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

const canvasToGIFstream = require("../../modules/canvas-to-gifstream.js");
const createEmbed = require("../../modules/create-embed.js");
const { getUser } = require("../../modules/user-cache.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("caption")
        .setDescription("Add a caption to this image")
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("The background image")
            .setRequired(false)) // because save-image is a thing!
        .addStringOption(option => option
            .setName("text")
            .setDescription("The caption text")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("gif")
            .setDescription("Force the output image to be a GIF")),
    
    async execute(interaction) {
        // Let Discord know the interaction was received
        await interaction.deferReply();

        // Configuration
        const userText = interaction.options.getString("text");
        const doGif = interaction.options.getBoolean("gif");

        // Get attachment
        let attachment;
        if (interaction.options.getAttachment("image")) {
            attachment = interaction.options.getAttachment("image");
        } else {
            let result = getUser(interaction.user.id, "savedImage", true);
            if (result == null) {
                await interaction.editReply({
                    embeds: [createEmbed.error("You haven't given me an image! You can also right click on an image you previously sent and click the \"Select Image for Next Command\" button, then resend the command without uploading an image.")]
                });
                return;
            } else {
                attachment = result;
            }
        }

        // Make sure the attachment is an image
        if (attachment.width == null || attachment.height == null) {
            await interaction.editReply({
                embeds: [createEmbed.error("The attachment you uploaded is not an image.")]
            });
            return;
        }

        // Preparations
        const textBoxHeight = 200;
        const fontSize = Math.sqrt(attachment.width * textBoxHeight / userText.length) * 1; // TODO: maybe fix this up
        Canvas.GlobalFonts.registerFromPath(`${__dirname}/../../assets/limerickserial-xbold.ttf`, "LimerickSerial");

        // Create a blank Canvas
        const canvas = Canvas.createCanvas(attachment.width, attachment.height + textBoxHeight);
        const context = canvas.getContext("2d");

        // Draw white
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, textBoxHeight)

        // Draw text
        context.font = `${fontSize}px LimerickSerial`;
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText(userText, canvas.width / 2, textBoxHeight / 2 + fontSize / 2);

        // Stretch the given image onto the entire canvas
        const background = await Canvas.loadImage(attachment.url);
        context.drawImage(background, 0, 0, attachment.width, attachment.height, 0, textBoxHeight, attachment.width, attachment.height);
        
        // Create a new attachment to reply with
        await interaction.editReply({files: [
            new AttachmentBuilder(
                doGif ? canvasToGIFstream(canvas, false) : await canvas.encode("png"),
                { name: doGif ? "processed.gif" : "processed.png" }
            )
        ]})
    }
}