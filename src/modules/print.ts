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



module.exports = {

    // print (equal to console.log)
    log: function(serviceName = "Global", text = "") {
        console.log(`  ${new Date().toLocaleString()}  |  ${serviceName}  |  ${text}`);
    },

    // print (equal to console.warn)
    warn: function(serviceName = "Global", text = "") {
        console.warn(`? ${new Date().toLocaleString()}  |  ${serviceName}  |  [WARNING] ${text}`);
    },

    // print (equal to console.error)
    error: function(serviceName = "Global", text = "") {
        console.error(`! ${new Date().toLocaleString()}  |  ${serviceName}  |  [ERROR] ${text}`);
    }

}