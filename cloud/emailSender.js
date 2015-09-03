var Mailgun = require('mailgun');
var PasswordReset = require('cloud/email-forgot-password.js');

/**
 * Get the user password
 */

Parse.Cloud.afterSave("Email", function(request) {
    Parse.Cloud.useMasterKey();
    var User = Parse.Object.extend("Users");

    var emailObj = request.object;
    var userObj = emailObj.get("user");

    var userQuery = new Parse.Query(User);
    userQuery.equalTo("objectId", userObj.id);
    userQuery.find({
        success:function(results) {
            if (results.length > 0) {
                var user = results[0];

                var type = emailObj.get("type");
                if (type == 'password reset') {
                    PasswordReset.sendPasswordResetToUser(user);
                }
            }
        },
        error:function(error) {
            console.error("Error: " + error);
        }
    });
});

