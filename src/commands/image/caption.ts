/*

    caption.ts

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



// Node imports
import type { ChatInputCommandInteraction } from "discord.js";
import { ImageCommand } from "../../templates/image-command.js";
const Canvas = require("@napi-rs/canvas");

// Utils
const createEmbed = require("../../modules/create-embed.js");


const cmd = new ImageCommand(
    "caption",
    "Add a caption to this image",
    [
        { type: "String", name: "text", description: "The caption text", isRequired: false }
    ]
);


module.exports = {
    data: cmd.toBuilder(),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // Get the current context
        const thisContext =  await cmd.register(interaction);

        // Parse options
        const attachment = await thisContext.getImage();
        if (attachment == null)
            return;



        // Begin command-specific code

        
        // Get text (this is so hacky and stupid but whatever)
        const userText = interaction.options.getString("text");
        if (userText === null || userText.length === 0) {
            await interaction.editReply({
                embeds: [createEmbed.error("You haven't input any text!")]
            });
            return;
        }

        // Configuration
        const textBoxHeight = 200;
        const fontSize = Math.sqrt(attachment.width * textBoxHeight / userText.length) * 1; // TODO: maybe fix this up

        // Create a blank Canvas
        Canvas.GlobalFonts.registerFromPath(`${__dirname}/../../assets/limerickserial-xbold.ttf`, "LimerickSerial");
        const canvas = Canvas.createCanvas(attachment.width, attachment.height + textBoxHeight);
        const context = canvas.getContext("2d");

        // Fill the canvas with white
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, textBoxHeight)

        // Draw text
        context.font = `${fontSize}px LimerickSerial`;
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText(userText, canvas.width / 2, textBoxHeight / 2 + fontSize / 2);

        // Stretch the given image onto the canvas under the caption
        const background = await Canvas.loadImage(attachment.url);
        context.drawImage(background, 0, 0, attachment.width, attachment.height, 0, textBoxHeight, attachment.width, attachment.height);



        // End command-specific code
        

        // Post-process command
        thisContext.postProcess({}, canvas);
    }
}