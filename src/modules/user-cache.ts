/*

    user-cache.ts

    Provides methods for scripts to access and mutate a UserCache

    The UserCache is an object stored in memory that can be used to communicate
    information across scripts. Values are stored and retrieved using both a
    "userId" (the ID of the Discord user) and a "scope" (the name of the field
    you wish to retrieve; sort of like the key in an object).



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
const fs = require('fs');

// Utils
const print = require("./print.js");


let cacheObject: {
    [userId: number]: {
        [scope: string]: any
    }
};


// save when console closed and load when reopened

const saveFilePath = "./recent-user-cache.json"; // why does this go to the root? I have no fucking clue.

// only do this if the file does not exist!
if (!fs.existsSync(saveFilePath)) {
    print.detail("User-Cache", `Cache log ${saveFilePath} does not exist. Creating an empty cache.`);
    cacheObject = {};
} else {
    try {
        const saveFileData = fs.readFileSync(saveFilePath);
        cacheObject = JSON.parse(saveFileData);
    
        print.affirm("User-Cache", `Loaded the previous cache from file: ${saveFilePath}.`)
    } catch (err) {
        print.error("User-Cache", `An error occured while reading file: ${String(err)}.`)
        cacheObject = {};
    }
}


process.on("SIGINT", () => {
    print.warn("User-Cache", `Saving cache to file ${saveFilePath}`);

    let wasError = false;
    try {
        fs.writeFileSync(saveFilePath, JSON.stringify(cacheObject) || "{}");
    } catch (err) {
        wasError = true;
        print.error("User-Cache", `An error occured while saving to file: "${String(err)}". Exiting program without saving.`);
    }

    if (!wasError)
        print.affirm("User-Cache", "Saving complete.");

    process.exit(0);
});

print.detail("User-Cache", "Created global cache object");



// getters/setters
module.exports = {

    getUser: function(userId: number, scope: string, clearAfter: boolean): any {
        // Verify input
        if (userId.toString() === null)
            return null;

        // Make sure the data exists
        if (!(userId in cacheObject) || !(scope in cacheObject[userId]))
            return null;

        // Get the data
        const result = cacheObject[userId][scope];
        print.log("User-Cache", `Got ${String(result)} at "${String(scope)}" scope for user ${String(userId)}`)

        // If necessary, clear scope after use
        if (clearAfter)
            cacheObject[userId][scope] = null;
        
        return result;
    },

    setUser: function (userId: number, scope: string, data: any): null {
        // Verify input
        if (userId.toString() === null)
            return null;

        // Make sure an empty object exists for this user
        if (!(userId in cacheObject)) {
            print.detail("User-Cache", `Creating cache object for ${String(userId)}`);
            cacheObject[userId] = {};
        }

        // Set the data
        cacheObject[userId][scope] = data;
        print.log("User-Cache", `Put ${String(data)} at "${String(scope)}" scope for user ${String(userId)}`);

        return null;
    }
};