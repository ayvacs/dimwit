/*

    image-command.ts

    Module exporting a type used to construct image-related commands



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
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

const canvasToGIFstream = require("../modules/canvas-to-gifstream.js");
const createEmbed = require("../modules/create-embed.js");
const { getUser } = require("../modules/user-cache.js");


export type CommandOption = {
    type: string,
    name: string,
    description: string,
    isRequired?: boolean
};

export type ImageCommandPostProcessOptions = {
    doEditReply?: boolean
};


export class ImageCommand {
    builder: typeof SlashCommandBuilder;
    interaction: ChatInputCommandInteraction;

    constructor(name: string, description: string, options?: CommandOption[]) {
        this.builder = new SlashCommandBuilder();
        this.builder.setName(name);
        this.builder.setDescription(description);

        // add default options
        this.builder.addAttachmentOption(option => option
            .setName("image")
            .setDescription("The background image")
            .setRequired(false)); // because save-image is a thing!

        // add custom options
        if (options) {
            options.forEach((option) => {
                this.builder[`add${option.type}Option`](
                    (o) => o.setName(option.name)
                        .setDescription(option.name)
                        .setRequired((typeof option.isRequired == "boolean") ? option.isRequired : false)
                );
            });
        };

        // add default options
        this.builder.addBooleanOption(option => option
            .setName("gif")
            .setDescription("Force the output image to be a GIF")
            .setRequired(false));
    };

    toBuilder() {
        return this.builder;
    };

    async register(interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;

        // Let Discord know the interaction was received
        await this.interaction.deferReply();
    };

    async getImage() {
        let attachment;

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

    async postProcess(options: ImageCommandPostProcessOptions, canvas: typeof Canvas) {
        const doGif = this.interaction.options.getBoolean("gif");

        // Create a new attachment to reply with
        const attachment = new AttachmentBuilder(
            doGif ? canvasToGIFstream(canvas, false) : await canvas.encode("png"),
            { name: doGif ? "processed.gif" : "processed.png" }
        );

        if (options.doEditReply == true || options.doEditReply == undefined)
            await this.interaction.editReply({files: [ attachment ]});
    };
};