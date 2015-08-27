var inviteCodeHtml = require('cloud/email-invite-code.js');

var Mailgun = require('mailgun');
var UserMailgun = require('mailgun');

Parse.Cloud.afterSave("Email", function(request) {
    Parse.Cloud.useMasterKey();
    //var userPointer= request.object.get("user");
    console.log("sending email to minhthao");
    UserMailgun.initialize('getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');

    UserMailgun.sendEmail({
        to: "mtng91@gmail.com",
        from: "Katerina" + "<support@getmagpie.com>",
        subject: "Welcome to Magpie",
        html: inviteCodeHtml.getInviteCodeHtml()
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
        },
        error: function(httpResponse) {
            console.error(httpResponse);
        }
    });
});

