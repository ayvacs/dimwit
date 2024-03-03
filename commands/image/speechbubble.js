/*

    speechbubble.js

    A command file



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/



const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("speechbubble")
        .setDescription("Add a speech bubble on top of this image")
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("The background image")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("transparent")
            .setDescription("Make the speech bubble transparent")
            .setRequired(true)),
    
    async execute(interaction) {
        // Let Discord know the interaction was received
        await interaction.deferReply();

        // Create a Canvas
        const attachment = interaction.options.getAttachment("image");
        const canvas = Canvas.createCanvas(attachment.width, attachment.height);
        const context = canvas.getContext("2d");

        // Stretch the given image onto the entire canvas
        const background = await Canvas.loadImage(attachment.url);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Add the speechbubble on top
        const bubble = await Canvas.loadImage(`${__dirname}/../../images/speechbubble.png`);
        context.drawImage(bubble, 0, 0, canvas.width, (canvas.height / 5));

        // If necessary, delete pixels inside the speech bubble shape
        if (interaction.options.getBoolean("transparent")) {
            context.globalCompositeOperation = "destination-out";

            const mask = await Canvas.loadImage(`${__dirname}/../../images/speechbubble_mask.png`);
            context.drawImage(mask, 0, 0, canvas.width, (canvas.height / 5));

            context.globalCompositeOperation = "source-over";
        }

        // Create a new attachment to reply with
        const newAttachment = new AttachmentBuilder(
            await canvas.encode("png"),
            { name: "processed.png" }
        );

        await interaction.editReply({ files: [newAttachment] })
    }
}