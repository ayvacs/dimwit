/**
 * user-cache.ts
 *
 * Provides methods for scripts to access and mutate a UserCache
 *
 * The UserCache is an object stored in memory that can be used to communicate
 * information across scripts. Values are stored and retrieved using both a
 * "userId" (the ID of the Discord user) and a "scope" (the name of the field
 * you wish to retrieve; sort of like the key in an object).
 *
 *
 * This file is part of Dimwit.
 *
 * Dimwit is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * Dimwit is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Dimwit. If not, see <https://www.gnu.org/licenses/>.
 */



// Node imports
const fs = require('fs');

// Utils
const print = require("./print.js");


const saveFilePath = "./.config/recent-user-cache.json";

type UserCache = {
    [userId: number]: {
        [scope: string]: any
    }
}



// Functions

// Load and return a cache from file if it exists, or create and return an empty cache
function buildCache(): UserCache {
    if (!fs.existsSync(saveFilePath)) {
        print.detail("User-Cache", `Cache log ${saveFilePath} does not exist. Creating an empty cache.`);
        return {};
    };

    try {
        const obj = JSON.parse(fs.readFileSync(saveFilePath));
        print.detail("User-Cache", `Loaded the previous cache from file: ${saveFilePath}.`)
        return obj;
    } catch (err) {
        print.error("User-Cache", `An error occured while reading file: ${String(err)}. Creating an empty cache.`)
        return {};
    }
}

// Save the cache to disk, returns if success
function saveCache(cacheObject: UserCache): boolean {
    print.warn("User-Cache", `Saving cache to file ${saveFilePath}`);

    let wasError = false;
    try {
        fs.writeFileSync(saveFilePath, JSON.stringify(cacheObject, null, 4) || "{}");
    } catch (err) {
        wasError = true;
        print.error("User-Cache", `An error occured while saving to file: "${String(err)}". Exiting program without saving.`);
    }

    if (!wasError)
        print.affirm("User-Cache", "Saving complete.");

    return wasError;
}




// Build cache
const cacheObject: UserCache = buildCache();


// Save to disk when process ends
process.on("SIGINT", () => {
    console.log(); //ctrl+c shows "^C" in the terminal
    saveCache(cacheObject);
    process.exit(0);
});


// Return accessor and mutator functions

export function getUser (userId: number, scope: string, clearAfter: boolean): any {
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
};

export function setUser (userId: number, scope: string, data: any): null {
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
};