/*

    image-command.ts

    Module exporting types used to construct image-related commands



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
import type { ChatInputCommandInteraction, CommandInteractionOption } from "discord.js";
const { SlashCommandBuilder, AttachmentBuilder, ApplicationCommandOptionBase } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

// Utils
const canvasToGIFstream = require("../modules/canvas-to-gifstream.js");
const createEmbed = require("../modules/create-embed.js");
const { getUser } = require("../modules/user-cache.js");
const print = require("./../modules/print.js");


/**
 * Defines a single option to be included with the command, and its functionality must be written in the command's source file.
 */
export type CommandOption = {
    type: string,
    name: string,
    description: string,
    isRequired?: boolean
};


/**
 * Defines settings for the postProcess function.
 */
export type ImageCommandPostProcessOptions = {
    doEditReply?: boolean
};


/**
 * Defines an image command.
 */
export class ImageCommand {
    builder: typeof SlashCommandBuilder;
    interaction: ChatInputCommandInteraction;


    /**
     * Create a new image command with this name, description, and options.
     */
    constructor(name: string, description: string, options: CommandOption[] = []) {
        this.builder = new SlashCommandBuilder();
        const builder = this.builder;

        builder.setName(name);
        builder.setDescription(description);

        // add default options
        builder.addAttachmentOption(option => option
            .setName("image")
            .setDescription("The background image")
            .setRequired(false)); // because save-image is a thing!

        // add custom options
        options.forEach((option) => {
            // verify the datatype of option actually exists
            const funcName = `add${option.type}Option`;
            if (typeof builder[funcName] !== "function") {
                print.error("Image-Command", `Datatype option command "${funcName}" does not exist for command ${builder.name}`);
                return;
            }

            builder[funcName](
                (o: typeof ApplicationCommandOptionBase) => o.setName(option.name)
                    .setDescription(option.description)
                    .setRequired((typeof option.isRequired == "boolean") ? option.isRequired : false)
            );
        });

        // add default options
        builder.addBooleanOption(option => option
            .setName("gif")
            .setDescription("Force the output image to be a GIF")
            .setRequired(false));
        builder.addBooleanOption(option => option
            .setName("spoiler")
            .setDescription("Send the new image as a spoiler")
            .setRequired(false));
    };

    toBuilder() {
        return this.builder;
    };


    /**
     * Register the interaction.
     */
    async register(interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;

        // Let Discord know the interaction was received
        await this.interaction.deferReply();
    };


    /**
     * Get the image uploaded by the user.
     */
    async getImage() {
        let attachment: NonNullable<CommandInteractionOption['attachment']>;

        if (this.interaction.options.getAttachment("image")) {
            // If an attachment was provided by the user in the commandbox
            attachment = this.interaction.options.getAttachment("image");
        } else {
            // Otherwise, check if the user has used select-image
            let result = getUser(this.interaction.user.id, "savedImage", true);
            if (result === null) {
                // No image was provided at all
                await this.interaction.editReply({
                    embeds: [createEmbed.error("You haven't given me an image! You can also right click on an image you previously sent and click the \"Select Image for Next Command\" button, then resend the command without uploading an image.")]
                });
                return null;
            }

            // An image is present in the usercache
            attachment = result;
        }

        // Make sure the attachment is an image
        if (attachment.width === null || attachment.height === null) {
            await this.interaction.editReply({
                embeds: [createEmbed.error("The attachment you uploaded is not an image.")]
            });
            return null;
        }

        return attachment;
    };


    /**
     * Perform post-process functions such as converting to gif if needed and editing the reply with the new image.
     */
    async postProcess(ppOptions: ImageCommandPostProcessOptions, canvas: typeof Canvas) {
        const doEditReply = ppOptions.doEditReply == true || ppOptions.doEditReply == undefined;

        const doSpoiler = this.interaction.options.getBoolean("spoiler") || false;
        const doGif = this.interaction.options.getBoolean("gif") || false;


        // Create a new attachment to reply with

        const fileName = doGif
            ? "processed.gif"
            : "processed.png";

        const fileStream = doGif
            ? canvasToGIFstream(canvas, false)
            : await canvas.encode("png");

        const attachment = new AttachmentBuilder(
            fileStream, { name: fileName }
        ).setSpoiler(doSpoiler);

        
        if (doEditReply)
            await this.interaction.editReply({files: [ attachment ]});
    };
};