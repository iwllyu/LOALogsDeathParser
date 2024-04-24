# LOALogsDeathParser
Death Parser for LOA Logs by @iwllyu on discord. Lost Ark Dev server, #loa-logs channel.

Parse LOA Logs encounters for who died the first/second/etc across multiple pulls:


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