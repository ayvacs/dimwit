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



// I am so sorry to anyone who has to read this

module.exports = {

    // print (white)
    log: function(serviceName: string = "Global", text: string = "", doColors: boolean = true) {
        console.log(`\x1b[0m  ${new Date().toLocaleString()}  |  ${serviceName}  |  ${text}${doColors ? "\x1b[0m" : ""}`);
    },

    // warn (yellow)
    warn: function(serviceName: string = "Global", text: string = "", doColors: boolean = true) {
        console.warn(`\x1b[0m${doColors ? "\x1b[31m" : ""}? ${new Date().toLocaleString()}  |  ${serviceName}  |  ${text}`);
    },

    // error (red)
    error: function(serviceName: string = "Global", text: string = "", doColors: boolean = true) {
        console.error(`\x1b[0m${doColors ? "\x1b[33m" : ""}! ${new Date().toLocaleString()}  |  ${serviceName}  |  ${text}`);
    },

    // affirm (green)
    affirm: function(serviceName: string = "Global", text: string = "", doColors: boolean = true) {
        console.error(`\x1b[0m${doColors ? "\x1b[32m" : ""}✓ ${new Date().toLocaleString()}  |  ${serviceName}  |  ${text}`);
    }

}