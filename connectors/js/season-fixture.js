(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "roundName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "roundNumber",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "roundOrder",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "matchId",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "teams",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "seasonFixture",
            alias: "Season Fixture.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://localhost:8889/https://api.afl.championdata.io/api/leagues/1/levels/1/seasons/2021/fixture", function(resp) {   

        var rounds = resp.phases[0].rounds,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, leni = rounds.length; i < leni; i++) {
                for (var x = 0, lenx= rounds[i].matches.length; x < lenx; x++) {
                    var homeTeam = rounds[i].matches[x]['squads']['home'];
                    var awayTeam = rounds[i].matches[x]['squads']['away'];

                    if (rounds[i].matches[x].type.code != "BYE") {
                        if (homeTeam['code'] === "ADEL" || awayTeam['code'] === "ADEL" ) {

                            tableData.push({
                                "roundName": rounds[i].name,
                                "roundNumber": rounds[i].number,
                                "roundOrder": rounds[i].matches[x].roundOrder,
                                "matchId": rounds[i].matches[x].id,
                                "teams": homeTeam['code'] + " v " + awayTeam['code']
                            });

                        }
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
            tableau.connectionName = "Season Fixture"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
