/*

    settings.ts

    Module exporting a table of user configuration. Allows the program to
    override certain settings, i.e. those that are not required but need a
    default variable to be set.



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



const settings = structuredClone(require("./../../config.json"));

// override certain settings
settings.doAdvancedLogging = (settings.doAdvancedLogging == undefined) ? true : settings.doAdvancedLogging;

module.exports = settings;