/*

    user-cache.js

    Provides methods for scripts to access and mutate a user cache



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/



const userCache = {};

module.exports = {

    getUser: function(id, scope, clearAfter) {
        if (userCache[id] == null || userCache[id][scope] == null)
            return null;

        const result = userCache[id][scope];

        if (clearAfter)
            userCache[id][scope] = null;
        
        return result;
    },

    setUser: function (id, scope, data) {
        if (userCache[id] == null)
            userCache[id] = {};

        userCache[id][scope] = data
    }
};