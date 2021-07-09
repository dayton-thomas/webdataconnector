(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "code",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statId",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "statName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statNamePlural",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "statValue",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "statValueDisplay",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "teamStatistics",
            alias: "Team statistics.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://localhost:8889/https://api.afl.championdata.io/api/matches/233202304/statistics/squads", function(resp) {   

        var squads = resp.squads,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = squads.length; i < len; i++) {
                for (var x = 0, leng = squads[i].statistics.length; x < leng; x++) {
                    tableData.push({
                        "name": squads[i].name,
                        "code": squads[i].code,
                        "statId": squads[i].statistics[x].id,
                        "statName": squads[i].statistics[x].name,
                        "statNamePlural": squads[i].statistics[x].namePlural,
                        "statCode": squads[i].statistics[x].code,
                        "statValue": squads[i].statistics[x].value,
                        "statValueDisplay": squads[i].statistics[x].valueDisplay
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
            tableau.connectionName = "Champion Data - Team Statistics"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
