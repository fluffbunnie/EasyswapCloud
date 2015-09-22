require(JSON);
var Mailgun = require('mailgun');

/**
 * Handle the after save for the feedback
 */
Parse.Cloud.afterSave("Feedback", function(request) {
    Mailgun.initialize('support.getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');

    var User = Parse.Object.extend("Users");
    var userPointer = request.object.get("user");
    if (userPointer == undefined) {
        var name = "Magpie User";
        var iosVersion = request.object.get("iosVersion");
        if (iosVersion == undefined) iosVersion = "undefined";
        var device = request.object.get("device");
        if (device == undefined) device = "undefined";
        var appVersion = request.object.get("appVersion");
        if (appVersion == undefined) appVersion = "undefined";
        var feeling = request.object.get("feeling");
        if (feeling == undefined) feeling = "undefined";
        var message = request.object.get("content");
        if (message == undefined) message = "undefined";
        var date = request.object.createdAt;

        Mailgun.sendEmail({
            to: "support@getmagpie.com",
            from: name + " <noreply@support.getmagpie.com>",
            subject: "App Feedback from " + name,
            html: "<b>App Version: </b>" + appVersion + "<br>"
            + "<b>iOS Version: </b>" + iosVersion + "<br>"
            + "<b>Device: </b>" + device + "<br>"
            + "<b>Date Sent: </b>" + date + "<br><br><br>"
            + "<b>Feeling: </b>" + feeling + "<br>"
            + "<b>Message: </b><br>" + message
        }, {
            success: function(httpResponse) {
                console.log("email sent");
                console.log(httpResponse);
            },
            error: function(httpResponse) {
                console.error(httpResponse);
            }
        });
    } else {
        var userQuery = new Parse.Query(User);
        userQuery.equalTo("objectId", userPointer.id);
        userQuery.find({
            success:function(results) {
                if (results.length > 0) {
                    var user = results[0];
                    var name = getSenderName(user);
                    var email = user.get("email");
                    if (email == undefined) email = "undefined";
                    var gender= user.get("gender");
                    if (gender == undefined) gender = "undefined";
                    var uid = userPointer.id;
                    var location = user.get("location");
                    if (location == undefined) location = "undefined";
                    var iosVersion = request.object.get("iosVersion");
                    if (iosVersion == undefined) iosVersion = "undefined";
                    var device = request.object.get("device");
                    if (device == undefined) device = "undefined";
                    var appVersion = request.object.get("appVersion");
                    if (appVersion == undefined) appVersion = "undefined";
                    var feeling = request.object.get("feeling");
                    if (feeling == undefined) feeling = "undefined";
                    var message = request.object.get("content");
                    if (message == undefined) message = "undefined";
                    var date = request.object.createdAt;

                    var replyTo = email;
                    if (replyTo == "undefined") replyTo = "noreply@getmagpie.com";

                    Mailgun.sendEmail({
                        'h:Reply-To': replyTo,
                        to: "support@getmagpie.com",
                        from: name + " <noreply@support.getmagpie.com>",
                        subject: "App Feedback from " + name,
                        html: "<b>Name: </b>" + name + "<br>"
                        + "<b>Email: </b>" + email + "<br>"
                        + "<b>gender </b>" + gender + "<br>"
                        + "<b>User ID: </b>" + uid + "<br>"
                        + "<b>Location: </b>" + location + "<br>"
                        + "<b>App Version: </b>" + appVersion + "<br>"
                        + "<b>iOS Version: </b>" + iosVersion + "<br>"
                        + "<b>Device: </b>" + device + "<br>"
                        + "<b>Date Sent: </b>" + date + "<br><br><br>"
                        + "<b>Feeling: </b>" + feeling + "<br>"
                        + "<b>Message: </b><br>" + message
                    }, {
                        success: function(httpResponse) {
                            console.log(httpResponse);
                        },
                        error: function(httpResponse) {
                            console.error(httpResponse);
                        }
                    });
                }
            },
            error: function(httpResponse) {
                console.error(httpResponse);
            }
        });
    }
});

function getSenderName(mSender) {
    var name = mSender.get("firstname");
    if (name == undefined || name.length == 0) {
        name = mSender.get("username");
        if (name == undefined || name.length == 0) {
            name = mSender.get("email");
            if (name == undefined) {
                name = "";
            }
            if (name.length > 0) {
                var nameIndex = name.indexOf("@");
                name = name.substring(0, nameIndex);
            }
        }
    }

    return name;
}