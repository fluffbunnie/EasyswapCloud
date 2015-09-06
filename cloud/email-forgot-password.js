var Mailgun = require('mailgun');
var Moment = require('moment');

/**
 * Get the user name
 * @param userObj
 * @returns name
 */
function getUserName(userObj) {
    var name = userObj.get("firstname");
    if (name == undefined || name.length == 0) {
        name = userObj.get("username");
        if (name == undefined || name.length == 0) {
            name = userObj.get("email");
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

/**
 * Get the user email
 * @param userObj
 * @returns {*}
 */
function getUserEmail(userObj) {
    return userObj.get("email");
}

/**
 * get the encrypted password
 * @param password
 * @return {*}
 */
function getUserPassword(userObj) {
    return userObj.get("password");
}

/**
 * Export function to send password reset email
 * @param user
 */
exports.sendPasswordResetToUser = function(user) {
    Parse.Cloud.httpRequest({
        method: 'POST',
        url: 'https://api.branch.io/v1/url',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            "branch_key": "key_live_eehRvejTecDnXaGWp4zQMmcbttndmQ7O",
            "campaign": "user-initiate",
            "feature": "password",
            "channel": "email",
            "tags": ["password-reset"],
            "data": {
                "email": getUserEmail(user),
                "password": getUserPassword(user),
                "createdAt": Moment().unix(),
                "$deeplink_path": "password-reset",
                "$desktop_url": "http://getmagpie.com/beta"
            }
        }
    }).then(function (httpResponse) {
        var mResponse = JSON.parse(httpResponse.text);
        Mailgun.initialize('getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');
        Mailgun.sendEmail({
            to: getUserEmail(user),
            from: "Magpie" + "<support@getmagpie.com>",
            subject: "Your Magpie Reset Password Instructions",
            html: getRequestPasswordHtml(user, mResponse.url)
        }, {
            success: function (response) {
                console.log(response);
            },
            error: function (err) {
                console.error(err);
            }
        });
    }, function (httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
    });
}

/**
 * Get the html formated email
 * @param userObj
 * @param deepLink
 * @returns {string}
 */
function getRequestPasswordHtml(userObj, deepLink) {
    return '\
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
    <!-- Inliner Build Version 4380b7741bb759d6cb997545f3add21ad48f010b -->\
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\
    <html xmlns="http://www.w3.org/1999/xhtml">\
    <head>\
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">\
        <meta name="viewport" content="width=device-width">\
        <style type="text/css">\
            @font-face {font-family: Avenir; src: url(https://dl.dropboxusercontent.com/s/jgnga2zg78rwgnc/AvenirNextLTPro-Regular.otf); font-weight: regular;}\
            @font-face {font-family: Avenir; src: url(https://dl.dropboxusercontent.com/s/s8tv7exkulxpt5g/AvenirNextLTPro-Demi.otf); font-weight: bold;}\
            a:hover{\
                color:#FF6F76 !important;\
            }\
            a:active{\
                color:#FF6F76 !important;\
            }\
            a:visited{\
                color:#DE5057 !important;\
            }\
            table.button:hover td{\
                background:#94E872 !important;\
            }\
            table.button:visited td{\
                background:#94E872 !important;\
            }\
            table.button:active td{\
                background:#94E872 !important;\
            }\
            table.button:hover td a{\
                color:#fff !important;\
            }\
            table.button:visited td a{\
                color:#fff !important;\
            }\
            table.button:active td a{\
                color:#fff !important;\
            }\
            table.button:hover td{\
                background:#94E872 !important;\
            }\
            table.success:hover td{\
                background:#457a1a !important;\
            }\
            @media only screen and (max-width: 640px){\
                table[class=body] img{\
                    width:auto !important;\
                    height:auto !important;\
                }\
                table[class=body] center{\
                    min-width:80 !important;\
                }\
                table[class=body] .container{\
                    width:95% !important;\
                }\
                table[class=body] .wrapper{\
                    display:block !important;\
                    padding-right:0 !important;\
                }\
            }\
        </style>\
    </head>\
    <body class="center" style="width: 100% !important; min-width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 15px; background: #ffffff; margin:20px 0; padding: 0;" bgcolor="#ffffff">\
        <a href="http://getmagpie.com" style="color: #DE5057; text-decoration: none;">\
            <img class="center" alt="Magpie" height="70px" width="162px" src="http://i.imgur.com/QkQEXMf.png" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; width: auto; max-width: 100%; float: none; clear: both; display: block; margin: 20px auto 10px; border: none;" align="none">\
        </a>\
        <table class="container" style="border-radius: 10px; border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: inherit; width:95%; max-width:640px; background: #f8f8f8; margin: 0 auto; padding: 0;" bgcolor="#f8f8f8">\
            <tr style="vertical-align: top; text-align: left; padding:15px 0;" align="left">\
                <td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="left" valign="top">\
                    <br>\
                    <h3 style="word-break: normal; font-size: 24px; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; line-height: 1.3; margin: 20px 6% 0; padding: 0;" align="left">Hi ' + getUserName(userObj) + ',</h3>\
                    <p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">Please click this <a href="' + deepLink + '" style="font-weight: regular; font-family: Avenir, sans-serif; color: #0000ee; font-size: 16px">reset link</a> from your iOS device to set your new password for Magpie. This link will expire in 24 hours.</p>\
                    <p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">If you still experience trouble logging in, simply reply to this email to reach us!</p>\
                    <p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">Sincerely,<br>Magpie Support<br></p>\
                    <h4 style="border-top-width: 1px; border-top-color: #e0e0e0; border-top-style: solid; color: #373B44; font-family: Avenir, sans-serif; font-weight: 500; text-align: left; line-height: 1.3; word-break: normal; font-size: 20px; margin: 0 6%; padding: 0;" align="left"></h4>\
                    <br>\
                    <h4 style="text-align: center; color: #373B44; font-family: Avenir, sans-serif; line-height: 1.3; font-size: 20px; font-weight: 500; word-break: normal; margin: 0 6%; padding: 0;" align="center">We’re here to help!</h4>\
                    <p style="text-align: center; font-size: 14px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; margin: 0 0 10px; padding: 0;" align="center">Contact us at <a href="mailto:support@getmagpie.com" style="color: #DE5057; text-decoration: none;">support@getmagpie.com</a></p>\
                </td>\
            </tr>\
            <tr style="vertical-align: top; text-align: left; padding: 0;" align="left">\
                <td style="text-align: center; word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="center" valign="top">\
                    <a href="https://www.facebook.com/getmagpie" style="color: #DE5057; text-decoration: none;">\
                        <img alt="Facebook" class="center" src="http://i.imgur.com/CGuCwCp.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none">\
                    </a>\
                    <a href="https://twitter.com/getmagpie" style="color: #DE5057; text-decoration: none;">\
                        <img alt="Twitter" class="center" src="http://i.imgur.com/IGrp34F.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none">\
                    </a>\
                    <a href="https://www.linkedin.com/company/6375751" style="color: #DE5057; text-decoration: none;">\
                        <img alt="LinkedIn" class="center" src="http://i.imgur.com/8C376SS.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none">\
                    </a>\
                </td>\
            </tr>\
            <tr style="vertical-align: top; text-align: left; padding: 0;" align="left">\
                <td align="center" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px 0px 10px;" valign="top">\
                    <p style="text-align: center; font-size: 12px; color: #c0c4c8; line-height: 20px; font-family: Avenir, sans-serif; font-weight: normal; margin: 10px; padding: 0;" align="center">From Magpie with love<br>PO Box #460403, San Francisco, CA 94146</p>\
                </td>\
            </tr>\
        </table>\
    </body>\
    </html>';
}