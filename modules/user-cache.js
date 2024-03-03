/*

    user-cache.js

    Provides methods for scripts to access and mutate a user cache



    This file is part of Dimwit.

    Dimwit is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Dimwit. If not, see <https://www.gnu.org/licenses/>. 


    This file uses code from the "discord.js" library. "discord.js" is licensed under the Apache license. Its source code is viewable at <https://github.com/discordjs/discord.js>.

*/



var self = {
    userCache: {},

    getUser: function(id, scope) {
        console.log(self.userCache);
        if (self.userCache[id] == null || self.userCache[id][scope] == null)
            return null;

        return self.userCache[id][scope];
    },

    setUser: function (id, scope, data) {
        console.log(self.userCache);
        if (self.userCache[id] == null)
            self.userCache[id] = {};

        self.userCache[id][scope] = data
        console.log(self.userCache);
    }
}


module.exports = self;