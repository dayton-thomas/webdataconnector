(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "length",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "width",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "matchVenue",
            alias: "Match venue.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var wdcParameters = JSON.parse(tableau.connectionData),
        matchId = wdcParameters.matchId,
        apiURL = "http://localhost:8889/https://api.afl.championdata.io/api/matches/" + matchId + "/venue";

        $.getJSON(apiURL, function(resp) {   
            var tableData = [];
                
            // Iterate over the JSON object
 
                tableData.push({
                    "name": resp.name,
                    "length": resp.dimensions.length,
                    "width": resp.dimensions.width
                });
            

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
            };

            tableau.connectionData = JSON.stringify(wdcParameters);
            tableau.connectionName = "Match Venue"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
