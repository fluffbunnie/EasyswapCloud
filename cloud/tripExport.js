Parse.Cloud.define("tripExport", function(request, response) {
    Parse.Cloud.useMasterKey();
    var Trip = Parse.Object.extend("Trip");

    var query = new Parse.Query(Trip);
    query.ascending("startDate");
    query.include("guest");
    query.include("host");
    query.include("place");
    if (request.params.lastScraped != 0) {
        var lastUpdated = new Date(request.params.lastScraped * 1000);
        query.greaterThan("updatedAt", lastUpdated);
    }
    query.limit(1000);


    query.find({
        success:function(results) {
            response.success(results);
        },
        error:function(error) {
            response.error("Error exporting user information. Error: " + error.message);
        }
    });
});