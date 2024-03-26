/*

    print.ts

    Module exporting various functions to output messages along with timestamps
    and debug information to the console.



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



const colorette = require("colorette");
const settings = require("./settings.js");


function timestamp(): string {
    return new Date().toLocaleString();
}

function colorStr(str: string, color: string): string {
    return colorette[color](str) || str;
}



module.exports = {

    // print (white)
    log: function(serviceName: string = "Global", text: string = "") {
        console.log(`  ${timestamp()}  |  ${serviceName}  |  ${text}`);
    },

    // warn (yellow)
    warn: function(serviceName: string = "Global", text: string = "") {
        console.warn(colorStr(
            `? ${timestamp()}  |  ${serviceName}  |  ${text}`,
            "yellow"
        ));
    },

    // error (red)
    error: function(serviceName: string = "Global", text: string = "") {
        console.error(colorStr(
            `! ${timestamp()}  |  ${serviceName}  |  ${text}`,
            "red"
        ));
    },

    // affirm (green)
    affirm: function(serviceName: string = "Global", text: string = "") {
        console.log(colorStr(
            `✓ ${timestamp()}  |  ${serviceName}  |  ${text}`,
            "green"
        ));
    },

    // detail (gray) - for details that are not necessary for the end user to know. This can be disabled in config, so do not use it to log important information.
    detail: function(serviceName: string = "Global", text: string = "") {
        if (settings.doAdvancedLogging) {
            console.log(colorStr(
                `  ${timestamp()}  |  ${serviceName}  |  ${text}`,
                "gray"
            ));
        }
    }

}