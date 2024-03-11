/*

    speechbubble.js

    A command file

    Overlays a speech bubble image on top of an image inputted by the user.



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
        .setName("speechbubble")
        .setDescription("Add a speech bubble on top of this image")
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("The background image")
            .setRequired(false)) // because save-image is a thing!
        .addBooleanOption(option => option
            .setName("transparent")
            .setDescription("Make the speech bubble transparent"))
        .addBooleanOption(option => option
            .setName("gif")
            .setDescription("Force the output image to be a GIF")),
    
    async execute(interaction) {
        // Let Discord know the interaction was received
        await interaction.deferReply();

        // Configuration
        const bubbleHeight = (1/5) // the fraction of the image that the speechbubble should take up
        const doTransparent = interaction.options.getBoolean("transparent") 
        const doGif = interaction.options.getBoolean("gif")

        // Get attachment
        let attachment;
        if (interaction.options.getAttachment("image")) {
            // If an attachment was provided by the user in the commandbox
            attachment = interaction.options.getAttachment("image");
        } else {
            // Otherwise, check if the user has used select-image
            let result = getUser(interaction.user.id, "savedImage", true);
            if (result == null) {
                // No image was provided
                await interaction.editReply({
                    embeds: [createEmbed.error("You haven't given me an image! You can also right click on an image you previously sent and click the \"Select Image for Next Command\" button, then resend the command without uploading an image.")]
                });
                return;
            } else {
                // An image is present in the usercache
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

        // Create a blank Canvas
        const canvas = Canvas.createCanvas(attachment.width, attachment.height);
        const context = canvas.getContext("2d");

        // Stretch the given image onto the entire canvas
        const background = await Canvas.loadImage(attachment.url);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Add the speechbubble on top
        const bubble = await Canvas.loadImage(`${__dirname}/../../assets/images/speechbubble.png`);
        context.drawImage(bubble, 0, 0, canvas.width, (canvas.height * bubbleHeight));

        // If necessary, delete pixels inside the speech bubble shape
        if (doTransparent) {
            // Tell Canvas that we want to delete these pixels, not draw them
            context.globalCompositeOperation = "destination-out";

            const mask = await Canvas.loadImage(`${__dirname}/../../assets/images/speechbubble_mask.png`);
            context.drawImage(mask, 0, 0, canvas.width, (canvas.height * bubbleHeight));

            // Tell Canvas to stop deleting pixels
            context.globalCompositeOperation = "source-over";
        }

        // Create a new attachment to reply with
        await interaction.editReply({files: [
            new AttachmentBuilder(
                doGif ? canvasToGIFstream(canvas, doTransparent) : await canvas.encode("png"),
                { name: doGif ? "processed.gif" : "processed.png" }
            )
        ]})
    }
}