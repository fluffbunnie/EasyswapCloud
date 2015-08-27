var Mailgun = require('mailgun');
var InviteCode = require('cloud/email-invite-code.js');

/**
 * Get the user email
 * @param userObj
 * @returns {*}
 */
function getUserEmail(inviteCodeObj) {
    return inviteCodeObj.get("email");
}

/**
 * Handle the after save for invitation request code
 */
Parse.Cloud.afterSave("InvitationCode", function(request) {
    if (!(request.object.existed())) {
        var inviteCodeObj = request.object;
        inviteCodeObj.set("code", (Math.floor((Math.random() * 900000) + 100000)).toString());
        inviteCodeObj.set("status", "PENDING");
        inviteCodeObj.save(null, {
            success: function() {
                console.log("request invitation code save");
            },
            error: function(err) {
                console.error("error: " + err);
            }
        });
    } else if (request.object.get("status") == "APPROVED") {
        //we first send the email
        Mailgun.initialize('getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');
        Mailgun.sendEmail({
            to: getUserEmail(request.object),
            from: "Magpie" + "<support@getmagpie.com>",
            subject: "Magpie invitation code",
            html: InviteCode.getInvitationCodeEmailHtml(request.object)
        }, {
            success: function(httpResponse) {
                console.log(httpResponse);
            },
            error: function(httpResponse) {
                console.error(httpResponse);
            }
        });

        var inviteCodeObj = request.object;
        var pushQuery =  new Parse.Query(Parse.Installation);
        pushQuery.equalTo("invitationCode", inviteCodeObj);
        Parse.Push.send({
            where: pushQuery,
            data: {
                where: pushQuery,
                data: {
                    alert: "Your invitation code is ready!! Please check your email inbox.",
                    badge: 'Increment'
                }
            }
        }, {
            success: function() {
                console.log("push successfully");
            },
            error: function(error) {
                console.error("Error: " + error.message);
            }
        });
    }
});