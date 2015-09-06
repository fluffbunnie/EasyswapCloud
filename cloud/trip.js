var EmailBooking = require('cloud/email-booking.js');

/**
 * post save on trip object
 */

Parse.Cloud.afterSave("Trip", function(request) {
    Parse.Cloud.useMasterKey();
    var Trip = Parse.Object.extend("Trip");

    var tripQuery = new Parse.Query(Trip);
    tripQuery.equalTo("objectId", request.object.id);
    tripQuery.include("guest");
    tripQuery.include("host");
    tripQuery.include("place");
    tripQuery.find({
        success:function(results) {
            if (results.length > 0) {
                var tripObj = results[0];
                EmailBooking.sendTripInfoContent(tripObj);
            }
        },
        error:function(error) {
            console.error("Error: " + error);
        }
    });
});

