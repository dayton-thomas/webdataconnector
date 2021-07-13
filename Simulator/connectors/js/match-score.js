(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "teamId",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "teamName",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "teamCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "margin",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "goals",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "behinds",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "points",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "period",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodGoalsCumulative",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodBehindsCumulative",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodPointsCumulative",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodMarginCumulative",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodMargin",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodResult",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "periodResultCode",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "periodGoals",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodBehinds",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "periodPoints",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "matchScore",
            alias: "Match score.",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        var wdcParameters = JSON.parse(tableau.connectionData),
        matchId = wdcParameters.matchId,
        apiURL = "http://localhost:8889/https://api.afl.championdata.io/api/matches/" + matchId + "/score";

        $.getJSON(apiURL, function(resp) {   
            var tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = resp.home.periods.length; i < len; i++) {
                tableData.push({
                    "teamId": resp.home.id,
                    "teamName": resp.home.name,
                    "teamCode": resp.home.code,
                    "margin": resp.home.margin,
                    "goals": resp.home.goals,
                    "behinds": resp.home.behinds,
                    "points": resp.home.points,

                    "period": resp.home.periods[i].period,
                    "periodGoalsCumulative": resp.home.periods[i].goalsCumulative,
                    "periodBehindsCumulative": resp.home.periods[i].behindsCumulative,
                    "periodPointsCumulative": resp.home.periods[i].pointsCumulative,
                    "periodMarginCumulative": resp.home.periods[i].marginCumulative,
                    "periodMargin": resp.home.periods[i].margin,
                    "periodResult": resp.home.periods[i].result,
                    "periodResultCode": resp.home.periods[i].resultCode,
                    "periodGoals": resp.home.periods[i].goals,
                    "periodBehinds": resp.home.periods[i].behinds,
                    "periodPoints": resp.home.periods[i].points
                });
            }

            for (var i = 0, len = resp.away.periods.length; i < len; i++) {
                tableData.push({
                    "teamId": resp.away.id,
                    "teamName": resp.away.name,
                    "teamCode": resp.away.code,
                    "margin": resp.away.margin,
                    "goals": resp.away.goals,
                    "behinds": resp.away.behinds,
                    "points": resp.away.points,

                    "period": resp.away.periods[i].period,
                    "periodGoalsCumulative": resp.away.periods[i].goalsCumulative,
                    "periodBehindsCumulative": resp.away.periods[i].behindsCumulative,
                    "periodPointsCumulative": resp.away.periods[i].pointsCumulative,
                    "periodMarginCumulative": resp.away.periods[i].marginCumulative,
                    "periodMargin": resp.away.periods[i].margin,
                    "periodResult": resp.away.periods[i].result,
                    "periodResultCode": resp.away.periods[i].resultCode,
                    "periodGoals": resp.away.periods[i].goals,
                    "periodBehinds": resp.away.periods[i].behinds,
                    "periodPoints": resp.away.periods[i].points
                });
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
            };

            tableau.connectionData = JSON.stringify(wdcParameters);
            tableau.connectionName = "Match Statistics - Players"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
