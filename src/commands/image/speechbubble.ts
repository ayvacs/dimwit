/**
 * speechbubble.ts
 *
 * A command file
 *
 * Overlays a speech bubble image on top of an image inputted by the user.
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
const Canvas = require("@napi-rs/canvas");

// Utils
import { ImageCommand } from "../../templates/image-command.js";


const cmd = new ImageCommand(
    "speechbubble",
    "Add a speech bubble on top of this image",
    [
        { type: "Boolean", name: "transparent", description: "Make the speech bubble transparent" }
    ]
)


module.exports = {
    data: cmd.getData(),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // Get the current context
        const thisContext = await cmd.register(interaction);
        
        // Parse options
        const attachment = await thisContext.getImage();
        if (attachment == null)
            return;



        // Begin command-specific code


        // Configuration
        const bubbleHeight = (1/5) // the fraction of the image that the speechbubble should take up
        const doTransparent = interaction.options.getBoolean("transparent");

       
        // Create a blank Canvas
        const canvas = Canvas.createCanvas(attachment.width, attachment.height);
        const context = canvas.getContext("2d");

        // Tell Canvas to draw instead of delete
        context.globalCompositeOperation = "source-over";

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
        };



        // End command-specific code
        

        // Post-process command
        thisContext.postProcess({}, canvas);
    }
}