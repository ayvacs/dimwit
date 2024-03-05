/*

    canvas-to-gifstream.js

    Module exporting a single function that converts a Canvas instance into a
    GIF stream that can be then uploaded to Discord or saved to disk.



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



const Canvas = require("@napi-rs/canvas");
const GIFEncoder = require('gifencoder');


module.exports = function(canvas, enableTransparency) {
    // Create a GIFEncoder with the same width and height as the Canvas; and create a read stream for it
    const encoder = new GIFEncoder(canvas.width, canvas.height);
    const stream = encoder.createReadStream();

    // Begin encoding with these settings
    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    if (enableTransparency)
        encoder.setTransparent(true);

    // Read the frame to the encoder and close it
    encoder.addFrame(canvas.getContext("2d"));
    encoder.finish();

    return stream;
}