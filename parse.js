/*
Parse LOA Logs encounters for who died the first/second/etc across multiple pulls:
By @iwllyu on discord. Lost Ark Dev server, #loa-logs channel.

See README.md for instructions
*/
const sqlite3 = require('sqlite3').verbose();

// # Populate these fields
let startId = 3111                                        // ID of the first encounter in the range
let endId = 9999                                          // ID of the last encounter in the range
var excludeIds = []
// excludeIds = [3111, 3112, 3114]                      // Uncomment if you want to list IDs individually
// excludeIds = createExcludeIdsRange(3111, 3113)       // Uncomment if you want to exclude a range of IDs
let showEncounterId = true

// # Configure DB Path
let dbPath = "C:\\Users\\Username\\\\AppData\\Local\\LOA Logs\\encounters.db"      // Path to your LOA Logs database file


let entitySql = `SELECT *
            FROM entity where encounter_id <= ${endId}
            AND encounter_id >= ${startId}`;

let encounterSql = `SELECT *
            FROM encounter where id <= ${endId}
            AND id >= ${startId}`;

// let dbPath = "C:\Installs\LOA Logs"

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
});



/*
var encounters = {
    3028: {
        fight_start: 1713588802982
        players: []
    }
}
*/
var encounters = {}

/*
var deathCount = {
    1: [
        'Eskanor': {
            count: 1,
            encounters: [
                {
                    encounter_id: 3028,
                    deathTime: 111.295,
                    dps: 4119465,
                }
            ]
        },
    ]
}
*/
var deathCount = {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
}
var totalSortedDeathCount = {}

var excludeIdsSet
if (excludeIds.length != 0) {
    excludeIdsSet = new Set(excludeIds);
}

var firstRunId = Number.MAX_SAFE_INTEGER
var lastRunId = 0
parseEncounter()

function parseEncounter() {
    db.all(encounterSql, function (err, rows) {
        rows.forEach(function (row) {
            if (excludeIdsSet != undefined) {
                if (excludeIdsSet.has(row.id)) {
                    return;
                }
            }

            firstRunId = Math.min(firstRunId, row.id)
            lastRunId = Math.max(lastRunId, row.id)

            if (encounters[row.id] == undefined) {
                encounters[row.id] = {
                    fight_start: row.fight_start,
                    fight_end: row.last_combat_packet,
                    players: []
                }
            }
            // if (encounters[eid] == undefined) {
            //     encounters[eid] = []
            // } else {
            //     encounters[eid].push({
            //         encounter_id: eid,
            //         name: row.name
            //         deathTime: pojo.deathTime
            //         dps: pojo.dps

            //     })
            // }
            // encounters[row.encounter_id] = {}
        })
        parseEntity()
    });
}

function parseEntity() {
    let firstRun = true
    db.all(entitySql, function (err, rows) {
        rows.forEach(function (row) {
            if (row.entity_type != 'PLAYER') { return }
            if (excludeIdsSet != undefined) {
                if (excludeIdsSet.has(row.encounter_id)) {
                    return;
                }
            }

            let eid = row.encounter_id.toString()
            let pojo = JSON.parse(row.damage_stats)
            let fight_start = encounters[eid].fight_start
            let fight_end = encounters[eid].fight_end
            let fight_length = fight_end - fight_start
            encounters[eid].fight_length = fight_length / 1000
            if (encounters[eid].fight_end - pojo.deathTime > 0) {
                let deathTime = pojo.deathTime - fight_start
                if (deathTime > 0) {
                    encounters[eid].players.push({
                        encounter_id: eid,
                        name: row.name,
                        deathTime: (pojo.deathTime - fight_start) / 1000,
                        dps: pojo.dps
                    })
                }
            }
        })

        Object.keys(encounters).forEach((key) => {
            encounters[key].players.sort((a, b) => { return a.deathTime - b.deathTime })
        })

        Object.keys(encounters).forEach((key) => {
            let players = encounters[key].players
            for (let i = 0; i < players.length; i++) {
                let name = players[i].name
                if (deathCount[i + 1][name] == undefined) {
                    deathCount[i + 1][name] = {
                        count: 0,
                        encounters: []
                    }
                }
                var encounterString = "("
                deathCount[i + 1][name].count += 1
                let minutes = Math.floor(players[i].deathTime / 60)
                let seconds = Math.floor(players[i].deathTime % 60)
                let deathTimeReadable = `${minutes}m${seconds}s`

                if (showEncounterId) {
                    encounterString = encounterString.concat(`${players[i].encounter_id}: `)
                }
                encounterString = encounterString.concat(`${deathTimeReadable})`)
                deathCount[i + 1][name].encounters.push(encounterString)
            }
        })

        Object.keys(deathCount).forEach((key) => {
            let sortedDeathCount = Object.keys(deathCount[key]).map((person) => {
                deathCount[key][person].person = person
                return deathCount[key][person]
            })
            sortedDeathCount.sort((a, b) => {
                return b.count - a.count
            })
            totalSortedDeathCount[key] = sortedDeathCount
        })
        formatOutput()
    });
}

function formatOutput() {
    var longestPlayerNameLength = 0
    var longestDeathLength = 0
    var longestEncounters 
    var outputArray = []
    /* 
        [{ 
            header:"1st",
            body: [
                Falconpunchlol,
                deaths: 7,
                timeOfDeath: 3m3s,4m24s,4m39s,2m58s,3m45s,1m26s,4m27s
            ]
        }]
    */
    var numCols = 0
    Object.keys(totalSortedDeathCount).forEach((cardinal) => {
        var cardinalSuffix = "th"
        switch (cardinal) {
            case "1":
                cardinalSuffix = "st"
                break
            case "2":
                cardinalSuffix = "nd"
                break
        }
        var outputStringHeader = `${cardinal}${cardinalSuffix} death`
        var outputPersonObject = {
            header: outputStringHeader,
            body: []
        }
        
        totalSortedDeathCount[cardinal].forEach((person) => {
            let playerName = person.person
            let numDeaths = `${person.count}`
            let deathTimes = person.encounters.join()
            let bodyItem = [
                playerName,
                `deaths: ${numDeaths}`,
                `timeOfDeath: ${deathTimes}`
            ]
            outputPersonObject.body.push(bodyItem)
            numCols = bodyItem.length
        })
        outputArray.push(outputPersonObject)
    })

    var maxLengths = Array(numCols).fill(0)
    outputArray.forEach((item) => {
        item.body.forEach((item) => {
            item.forEach((item, i) => {
                maxLengths[i] = Math.max(item.length, maxLengths[i])
            })
        })
    })

    logOutput(outputArray, maxLengths)
}

function logOutput(outputArray, maxLengths) {
    console.log(`Runs: ${lastRunId - firstRunId + 1} (${firstRunId}-${lastRunId})\n`)
    outputArray.forEach((item) => {
        console.log(item.header)
        item.body.forEach((bodyItem) => {
            var outputString = ""
            bodyItem.forEach((item, i) => { 
                outputString = outputString.concat(`${item.padEnd(maxLengths[i] + 2)}`)
            })
            console.log(outputString)
        })
        console.log()
    })
}

function createExcludeIdsRange(startId, endId) {
    const result = [];
    for (let i = startId; i <= endId; i++) {
        result.push(i);
    }
    return result;
}