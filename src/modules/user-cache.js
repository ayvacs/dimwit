/*

    user-cache.js

    Provides methods for scripts to access and mutate a UserCache

    The UserCache is an object stored in memory that can be used to communicate
    information across scripts. Values are stored and retrieved using both an
    "id" (the ID of the Discord user) and a "scope" (the name of the field you
    wish to retrieve; sort of like the key in an object).



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



const cacheObject = {};


module.exports = {

    getUser: function(id, scope, clearAfter) {
        // Verify input
        if (id.toString() === null)
            return null;

        id = id.toString();

        // Make sure the data exists
        if (cacheObject[id] === null || cacheObject[id][scope] === null)
            return null;

        // Get the data
        const result = cacheObject[id][scope];

        // If necessary, clear scope after use
        if (clearAfter)
            cacheObject[id][scope] = null;
        
        return result;
    },

    setUser: function (id, scope, data) {
        // Verify input
        if (id.toString() === null)
            return null;

        // Make sure an empty object exists for this user
        if (cacheObject[id] === null)
            cacheObject[id] = {};

        // Set the data
        cacheObject[id][scope] = data;
    }
};