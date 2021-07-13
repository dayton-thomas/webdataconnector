(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "statName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statNamePlural",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statNameCode",
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
            id: "teamId",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "teamName",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "teamCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "order",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "rank",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "value",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "valueDisplay",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "matchStatisticsLeaders",
            alias: "Match statistics (leaders).",
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
        leaders = wdcParameters.leaders,
        apiURL = "http://localhost:8889/https://api.afl.championdata.io/api/matches/" + matchId + "/statistics/leaders";

        if (zone || period || leaders) {
            apiURL = apiURL + "?";

            if (zone) {
                apiURL = apiURL + "zone=" + zone;
                if (period || leaders) {
                    apiURL = apiURL + "&";
                }
            }

            if (period) {
                apiURL = apiURL + "period=" + period;
                if (leaders) {
                    apiURL = apiURL + "&";
                }
            }

            if (leaders) {
                apiURL = apiURL + "n=" + leaders;
            }
        }

        $.getJSON(apiURL, function(resp) {   

        var stats = resp.statistics,
                tableData = [];

                
            // Iterate over the JSON object
            for (var i = 0, len = stats.length; i < len; i++) {
                for (var x = 0, lenx = stats[i].persons.length; x < lenx; x++) {
                    tableData.push({
                        "statName": stats[i].name,
                        "statNamePlural": stats[i].namePlural,
                        "statNameCode": stats[i].code,

                        "jumperNumber": stats[i].persons[x].jumperNumber,
                        "displayName": stats[i].persons[x].displayName,
                        "fullname": stats[i].persons[x].fullname,
                        "teamId": stats[i].persons[x].squadId,
                        "teamName": stats[i].persons[x].squadName,
                        "teamCode": stats[i].persons[x].squadCode,
                        "order": stats[i].persons[x].order,
                        "rank": stats[i].persons[x].rank,
                        "value": stats[i].persons[x].value,
                        "valueDisplay": stats[i].persons[x].valueDisplay
                    });
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
                leaders: $('#leaders').val().trim(),
            };

            tableau.connectionData = JSON.stringify(wdcParameters);
            tableau.connectionName = "Match Statistics - Players"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
