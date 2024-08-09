# LOALogsDeathParser
Death Parser for [LOA Logs](https://github.com/snoww/loa-logs) by @iwllyu on discord.

Parse LOA Logs encounters for who died the first/second/etc across multiple pulls:

Note: Multiple same deaths may not be counted properly (ex: thaemine safe spot mech)

## Sample Output
```
Runs: 15 (4325-4339) // Number of runs (Starting encounter ID to end encounter ID)

1st death // People who died first
Crocodile     deaths: 3  timeOfDeath: (4325: 1m28s),(4327: 3m45s),(4338: 1m29s)  // deaths: how many deaths, timeOfDeath: (encounter ID: time of death since start of fight) 
Badger        deaths: 3  timeOfDeath: (4326: 1m17s),(4336: 8m15s),(4337: 5m33s)
Salamander    deaths: 3  timeOfDeath: (4328: 4m55s),(4332: 1m52s),(4334: 12m1s)
Wildcat       deaths: 3  timeOfDeath: (4329: 4m47s),(4333: 2m5s),(4339: 5m7s)
Mongoose      deaths: 1  timeOfDeath: (4330: 1m20s)
Racoon        deaths: 1  timeOfDeath: (4331: 7m2s)

2nd death
Badger        deaths: 2  timeOfDeath: (4325: 1m29s),(4331: 7m31s)
Wildcat       deaths: 1  timeOfDeath: (4328: 4m55s)
Mongoose      deaths: 1  timeOfDeath: (4334: 12m1s)
Wombat        deaths: 1  timeOfDeath: (4336: 8m15s)

3th death
Wombat        deaths: 2  timeOfDeath: (4328: 4m55s),(4334: 12m1s)
Mongoose      deaths: 1  timeOfDeath: (4331: 7m39s)
Chinchilla    deaths: 1  timeOfDeath: (4336: 8m15s)

4th death
Chinchilla    deaths: 2  timeOfDeath: (4328: 4m55s),(4334: 12m1s)
Mongoose      deaths: 1  timeOfDeath: (4336: 8m15s)

5th death
Badger        deaths: 1  timeOfDeath: (4328: 4m55s)
Crocodile     deaths: 1  timeOfDeath: (4334: 12m1s)

6th death
Mongoose      deaths: 1  timeOfDeath: (4328: 4m55s)
Badger        deaths: 1  timeOfDeath: (4334: 12m5s)
```

## To run: 
1. [Download](https://nodejs.org/en) and install Node.js.
2. [Download](https://github.com/iwllyu/LOALogsDeathParser/archive/refs/heads/main.zip) this project as a ZIP file (top right green button > Download ZIP).
3. Open command prompt and navigate to the project directory and enter `npm install`,
4. Open `parse.js` in a text editor.
5. Configure the script:
    1. Populate `startId` and `endId` fields with the encounter ID of the first/last pull. Use a large number for `endId` if you just want up to the last pull.
    2. Set `showEncounterId` to true/false if you want to show the encounter ID or not (default: true).
    3. To exclude encounters, configure the `excludeIds` lines.
    5. Set `dbPath` to the LOA Logs DB Path.
6. Enter `node parse.js` in the command prompt to run the script.

## Common errors:
If you see "TypeError: Cannot read properties of undefined (reading '...'), check that your startId and endId are valid.