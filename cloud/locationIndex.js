
Parse.Cloud.job("indexLocation", function(request, status) {

    Parse.Cloud.useMasterKey();
    var Property = Parse.Object.extend("Property");

    var query = new Parse.Query(Property);
    query.descending("objectId");
    query.exists("location");
    query.limit(1000);
    query.skip(1000 * request.params.page);

    query.find({
        success:function(results) {
            console.log(results.length);
            indexLocation(results, 0, status);
        },
        error:function(error) {
            status.error("Error index the location. Error: " + error.message);
        }
    });
});

/**
 * Index the first location in the list
 * @param properties
 */
function indexLocation(properties, index, status) {
    Parse.Cloud.useMasterKey();
    var LocationIndex = Parse.Object.extend("LocationIndex");

    if (index < properties.length) {
        var property = properties[index];
        var location = property.get("location");
        var locationIndex = location.toLowerCase();

        var query = new Parse.Query(LocationIndex);
        query.equalTo("location", location);
        query.equalTo("locationIndex", locationIndex);

        query.find({
            success:function(results) {
                if (results.length > 0) {
                    var result = results[0];
                    result.increment("count");
                    result.save(null, {
                        success:function(result) {
                            indexLocation(properties, index + 1, status);
                        },
                        error:function(error) {
                            status.error("Error saving location index. Error: " + error.message);
                        }
                    });
                } else {
                    var newLocationIndex = new LocationIndex();
                    newLocationIndex.set("location", location);
                    newLocationIndex.set("locationIndex", locationIndex);
                    newLocationIndex.set("count", 1);

                    newLocationIndex.save(null, {
                        success:function(result) {
                            indexLocation(properties, index + 1, status);
                        },
                        error:function(error) {
                            status.error("Error adding new location index. Error: " + error.message);
                        }
                    });
                }
            },
            error:function(error) {
                status.error("Error finding location index. Error: " + error.message);
            }
        })
    } else {
        status.success("Index complete");
    }
}