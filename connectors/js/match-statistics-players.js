(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "teamCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "teamName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "jumperNumber",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "displayName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "fullname",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statPlural",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "statCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statValue",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statValueDisplay",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "matchStatisticsPlayers",
            alias: "Match statistics (players).",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var wdcParameters = JSON.parse(tableau.connectionData),
        matchId = wdcParameters.matchId,
        zone = wdcParameters.zone,
        period = wdcParameters.period,
        apiURL = "http://localhost:8889/https://api.afl.championdata.io/api/matches/" + matchId + "/statistics/players";

        if (zone || period) {
            apiURL = apiURL + "?";

            if (zone) {
                apiURL = apiURL + "zone=" + zone;
            }

            if (zone && period) {
                apiURL = apiURL + "&";
            }

            if (period) {
                apiURL = apiURL + "period=" + period;
            }
        }

        $.getJSON(apiURL, function(resp) {   

        var squads = resp.squads,
                tableData = [];

                
            // Iterate over the JSON object
            for (var i = 0, len = squads.length; i < len; i++) {
                for (var x = 0, lenx = squads[i].players.length; x < lenx; x++) {
                    for (var y = 0, leny = squads[i].players[x].statistics.length; y < leny; y++) {
                        tableData.push({
                            "teamCode": squads[i].code,
                            "teamName": squads[i].name,

                            "jumperNumber": squads[i].players[x].jumperNumber,
                            "displayName": squads[i].players[x].displayName,
                            "fullname": squads[i].players[x].fullname,

                            "statName": squads[i].players[x].statistics[y].name,
                            "statPlural": squads[i].players[x].statistics[y].namePlural,
                            "statCode": squads[i].players[x].statistics[y].code,
                            "statValue": squads[i].players[x].statistics[y].value,
                            "statValueDisplay": squads[i].players[x].statistics[y].valueDisplay
                        });
                    }
                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $.ajaxSetup({
            headers: { Authorization: 'Basic ZGRhZ2FuQGFmYy5jb20uYXU6MjAyMSFEYWdhbg==' },
          })

        $("#submitButton").click(function() {
            var wdcParameters = {
                matchId: $('#matchId').val().trim(),
                zone: $('#zone').val().trim(),
                period: $('#period').val().trim(),
            };

            tableau.connectionData = JSON.stringify(wdcParameters);
            tableau.connectionName = "Match Statistics - Players"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
