/**
 * Get the user name
 * @param userObj
 * @returns name
 */
function getUserName(invitationCodeObj) {
    var name = invitationCodeObj.get("firstname");
    if (name == undefined || name.length == 0) {
        name = invitationCodeObj.get("username");
        if (name == undefined || name.length == 0) {
            name = invitationCodeObj.get("email");
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
 * Get the invitation code
 * @param invitationCodeObj
 * @returns {any|number|V|IDBRequest}
 */
function getInvitationCode(invitationCodeObj) {
    return invitationCodeObj.get("code");
}

/**
 * Get the refer friend link
 * @param userObj
 * @return {string}
 */
function getFriendReferalLink(invitationCodeObj) {
    return "http://getmagpie.com/refer-friend/" + invitationCodeObj.id;
}

/**
 * Get the unsubscribe link
 * @param userObj
 * @returns {string}
 */
function getUnsubsribeLink(invitationCodeObj) {
    return "http://getmagpie.com/unsubscribe/" + invitationCodeObj.id;
}

function getAppScheam(invitationCodeObj) {
    return ""
}

exports.getInvitationCodeEmailHtml = function(invitationCodeObj) {
    return '\
    <!-- Inliner Build Version 4380b7741bb759d6cb997545f3add21ad48f010b -->\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\
<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">\
  <head>\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
    <meta name="viewport" content="width=device-width" />\
  </head>\
  <body style="width: 100% !important; min-width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 15px; background: #ffffff; margin: 0; padding: 0;" bgcolor="#ffffff"><style type="text/css">\
@font-face {\
font-family: Avenir; src: url(https://dl.dropboxusercontent.com/s/jgnga2zg78rwgnc/AvenirNextLTPro-Regular.otf); font-weight: regular;\
}\
@font-face {\
font-family: Avenir; src: url(https://dl.dropboxusercontent.com/s/s8tv7exkulxpt5g/AvenirNextLTPro-Demi.otf); font-weight: bold;\
}\
a:hover {\
color: #FF6F76 !important;\
}\
a:active {\
color: #FF6F76 !important;\
}\
a:visited {\
color: #DE5057 !important;\
}\
h1 a:active {\
color: #DE5057 !important;\
}\
h2 a:active {\
color: #DE5057 !important;\
}\
h3 a:active {\
color: #DE5057 !important;\
}\
h4 a:active {\
color: #DE5057 !important;\
}\
h5 a:active {\
color: #DE5057 !important;\
}\
h6 a:active {\
color: #DE5057 !important;\
}\
h1 a:visited {\
color: #DE5057 !important;\
}\
h2 a:visited {\
color: #DE5057 !important;\
}\
h3 a:visited {\
color: #DE5057 !important;\
}\
h4 a:visited {\
color: #DE5057 !important;\
}\
h5 a:visited {\
color: #DE5057 !important;\
}\
h6 a:visited {\
color: #DE5057 !important;\
}\
table.button:hover td {\
background: #94E872 !important;\
}\
table.button:visited td {\
background: #94E872 !important;\
}\
table.button:active td {\
background: #94E872 !important;\
}\
table.button:hover td a {\
color: #fff !important;\
}\
table.button:visited td a {\
color: #fff !important;\
}\
table.button:active td a {\
color: #fff !important;\
}\
table.button:hover td {\
background: #94E872 !important;\
}\
table.tiny-button:hover td {\
background: #94E872 !important;\
}\
table.small-button:hover td {\
background: #94E872 !important;\
}\
table.medium-button:hover td {\
background: #94E872 !important;\
}\
table.large-button:hover td {\
background: #94E872 !important;\
}\
table.button:hover td a {\
color: #ffffff !important;\
}\
table.button:active td a {\
color: #ffffff !important;\
}\
table.button td a:visited {\
color: #ffffff !important;\
}\
table.tiny-button:hover td a {\
color: #ffffff !important;\
}\
table.tiny-button:active td a {\
color: #ffffff !important;\
}\
table.tiny-button td a:visited {\
color: #ffffff !important;\
}\
table.small-button:hover td a {\
color: #ffffff !important;\
}\
table.small-button:active td a {\
color: #ffffff !important;\
}\
table.small-button td a:visited {\
color: #ffffff !important;\
}\
table.medium-button:hover td a {\
color: #ffffff !important;\
}\
table.medium-button:active td a {\
color: #ffffff !important;\
}\
table.medium-button td a:visited {\
color: #ffffff !important;\
}\
table.large-button:hover td a {\
color: #ffffff !important;\
}\
table.large-button:active td a {\
color: #ffffff !important;\
}\
table.large-button td a:visited {\
color: #ffffff !important;\
}\
table.secondary:hover td {\
background: #d0d0d0 !important; color: #555;\
}\
table.secondary:hover td a {\
color: #555 !important;\
}\
table.secondary td a:visited {\
color: #555 !important;\
}\
table.secondary:active td a {\
color: #555 !important;\
}\
table.success:hover td {\
background: #457a1a !important;\
}\
table.alert:hover td {\
background: #970b0e !important;\
}\
@media only screen and (max-width: 600px) {\
  table[class=body] img {\
    width: auto !important; height: auto !important;\
  }\
  table[class=body] center {\
    min-width: 0 !important;\
  }\
  table[class=body] .container {\
    width: 95% !important;\
  }\
  table[class=body] .row {\
    width: 100% !important; display: block !important;\
  }\
  table[class=body] .wrapper {\
    display: block !important; padding-right: 0 !important;\
  }\
  table[class=body] .columns {\
    table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important;\
  }\
  table[class=body] .column {\
    table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important;\
  }\
  table[class=body] .wrapper.first .columns {\
    display: table !important;\
  }\
  table[class=body] .wrapper.first .column {\
    display: table !important;\
  }\
  table[class=body] table.columns td {\
    width: 100% !important;\
  }\
  table[class=body] table.column td {\
    width: 100% !important;\
  }\
  table[class=body] .columns td.one {\
    width: 8.333333% !important;\
  }\
  table[class=body] .column td.one {\
    width: 8.333333% !important;\
  }\
  table[class=body] .columns td.two {\
    width: 16.666666% !important;\
  }\
  table[class=body] .column td.two {\
    width: 16.666666% !important;\
  }\
  table[class=body] .columns td.three {\
    width: 25% !important;\
  }\
  table[class=body] .column td.three {\
    width: 25% !important;\
  }\
  table[class=body] .columns td.four {\
    width: 33.333333% !important;\
  }\
  table[class=body] .column td.four {\
    width: 33.333333% !important;\
  }\
  table[class=body] .columns td.five {\
    width: 41.666666% !important;\
  }\
  table[class=body] .column td.five {\
    width: 41.666666% !important;\
  }\
  table[class=body] .columns td.six {\
    width: 50% !important;\
  }\
  table[class=body] .column td.six {\
    width: 50% !important;\
  }\
  table[class=body] .columns td.seven {\
    width: 58.333333% !important;\
  }\
  table[class=body] .column td.seven {\
    width: 58.333333% !important;\
  }\
  table[class=body] .columns td.eight {\
    width: 66.666666% !important;\
  }\
  table[class=body] .column td.eight {\
    width: 66.666666% !important;\
  }\
  table[class=body] .columns td.nine {\
    width: 75% !important;\
  }\
  table[class=body] .column td.nine {\
    width: 75% !important;\
  }\
  table[class=body] .columns td.ten {\
    width: 83.333333% !important;\
  }\
  table[class=body] .column td.ten {\
    width: 83.333333% !important;\
  }\
  table[class=body] .columns td.eleven {\
    width: 91.666666% !important;\
  }\
  table[class=body] .column td.eleven {\
    width: 91.666666% !important;\
  }\
  table[class=body] .columns td.twelve {\
    width: 100% !important;\
  }\
  table[class=body] .column td.twelve {\
    width: 100% !important;\
  }\
  table[class=body] td.offset-by-one {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-two {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-three {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-four {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-five {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-six {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-seven {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-eight {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-nine {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-ten {\
    padding-left: 0 !important;\
  }\
  table[class=body] td.offset-by-eleven {\
    padding-left: 0 !important;\
  }\
  table[class=body] table.columns td.expander {\
    width: 1px !important;\
  }\
  table[class=body] .right-text-pad {\
    padding-left: 10px !important;\
  }\
  table[class=body] .text-pad-right {\
    padding-left: 10px !important;\
  }\
  table[class=body] .left-text-pad {\
    padding-right: 10px !important;\
  }\
  table[class=body] .text-pad-left {\
    padding-right: 10px !important;\
  }\
  table[class=body] .hide-for-small {\
    display: none !important;\
  }\
  table[class=body] .show-for-desktop {\
    display: none !important;\
  }\
  table[class=body] .show-for-small {\
    display: inherit !important;\
  }\
  table[class=body] .hide-for-desktop {\
    display: inherit !important;\
  }\
  table[class=body] .right-text-pad {\
    padding-left: 10px !important;\
  }\
  table[class=body] .left-text-pad {\
    padding-right: 10px !important;\
  }\
}\
</style>\
   	<a href="http://getmagpie.com" style="color: #DE5057; text-decoration: none;">\
    	<img class="center" alt="Magpie" height="70px" width="162px" src="http://i.imgur.com/QkQEXMf.png" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; width: auto; max-width: 100%; float: none; clear: both; display: block; margin: 20px auto 10px; border: none;" align="none" /></a>\
\
	<br /><table class="body" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; height: 100%; width: 100%; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="center" align="center" valign="top" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;">\
        \
\
          <table class="container" style="border-radius: 10px; border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: inherit; width: 640px; background: #fcf9fc; margin: 0 auto; padding: 0;" bgcolor="#fcf9fc"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="left" valign="top">\
\
                <!-- content start -->\
                <table class="row" style="bgcolor: #e2e2e2; border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; margin: 0px; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px;" align="left" valign="top">\
\
                      <table class="twelve columns" style="bgcolor: #e2e2e2; border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 640px; margin: 0px; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px 0px 10px;" align="left" valign="top">\
                              <a href="http://bnc.lt/invite-code" style="color: #DE5057; text-decoration: none;"><img width="640" height="340" src="http://i.imgur.com/LM5y4rb.jpg" style="border-top-left-radius: 10px; border-top-right-radius: 10px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; width: auto; max-width: 100%; float: left; clear: both; display: block; border: none;" align="left" /></a>\
\
                          </td>\
                          <td class="expander" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="left" valign="top"></td>\
                        </tr></table></td>\
                  </tr></table><table class="row" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px;" align="left" valign="top">\
\
                      <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 640px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px 0px 10px;" align="left" valign="top">\
							<br /><h3 style="word-break: normal; font-size: 24px; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; line-height: 1.3; margin: 20px 6% 0; padding: 0;" align="left">Hi ' +
        getUserName(invitationCodeObj)
        + ',</h3>\
                            <br /><p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">Congratulations! We\'re excited to let you know that your invitation request has been approved. Please use the code <b>' + getInvitationCode(invitationCodeObj) + '</b> to sign up.\
</p>\
							<br /></td>     \
                        </tr></table></td>\
                  </tr></table><table class="button" style="width: auto; min-width: 400px; border-radius: 6px; border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; overflow: hidden; margin: auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: center; color: #ffffff; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; display: block; width: auto !important; min-width: 160px; background: #72C556; margin: 0; padding: 15px 50px;" align="center" bgcolor="#72C556" valign="top">\
      <a href="http://bnc.lt/invite-code" style="font-weight: regular; text-decoration: none; font-family: Avenir, sans-serif; color: #ffffff; font-size: 16px;">Sign Up</a>\
    </td>\
  </tr></table><table class="row" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px;" align="left" valign="top">\
\
                      <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 640px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px 0px 10px;" align="left" valign="top">\
                            <br /><p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">If you have any questions or feedback as you get started with Magpie, please don’t hesitate to reach out. Also, if you have any friends you think would like to try Magpie, <a href="' + getFriendReferalLink(invitationCodeObj) + '" style="color: #DE5057; text-decoration: none;">send them our way</a>! Thanks for being awesome and supporting the Magpie community.\
</p>\
                          	<br /><p style="font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; text-align: left; margin: 20px 6% 10px; padding: 0;" align="left">Sincerely,<br />Huong Tran, CEO\
</p>\
							<br /></td>\
                        </tr></table></td>\
                  </tr></table><h4 style="border-top-width: 1px; border-top-color: #e0e0e0; border-top-style: solid; color: #373B44; font-family: Avenir, sans-serif; font-weight: 500; text-align: left; line-height: 1.3; word-break: normal; font-size: 20px; margin: 0 6%; padding: 0;" align="left"></h4>\
                <br /><br /><h4 style="text-align: center; color: #373B44; font-family: Avenir, sans-serif; line-height: 1.3; font-size: 20px; font-weight: 500; word-break: normal; margin: 0 6%; padding: 0;" align="center">We’re here to help!</h4>\
                                    <p style="text-align: center; font-size: 15px; color: #898F9B; line-height: 30px; font-family: Avenir, sans-serif; font-weight: normal; margin: 0 6% 10px; padding: 0;" align="center">Contact us at <a href="mailto:support@getmagpie.com" style="color: #DE5057; text-decoration: none;">support@getmagpie.com</a></p>\
                \
               <table class="container" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: inherit; width: 640px; background: #fcf9fc; margin: 0 auto; padding: 0;" bgcolor="#fcf9fc"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td style="text-align: center; word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="center" valign="top">\
                            <a href="https://www.facebook.com/getmagpie" style="color: #DE5057; text-decoration: none;"><img alt="Facebook" class="center" src="http://i.imgur.com/CGuCwCp.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none" /></a>\
                            <a href="https://twitter.com/getmagpie" style="color: #DE5057; text-decoration: none;"><img alt="Twitter" class="center" src="http://i.imgur.com/IGrp34F.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none" /></a>\
                            <a href="https://www.linkedin.com/company/6375751" style="color: #DE5057; text-decoration: none;"><img alt="LinkedIn" class="center" src="http://i.imgur.com/8C376SS.png" style="width: 40px; display: inline; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; float: none; clear: both; margin: 0 4px; border: none;" align="none" /></a>\
                    </td>\
                  </tr></table><table class="row" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; position: relative; display: block; padding: 0px;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td class="wrapper last" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; position: relative; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px;" align="left" valign="top">\
\
                      <table class="twelve columns" style="border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 640px; margin: 0 auto; padding: 0;"><tr style="vertical-align: top; text-align: left; padding: 0;" align="left"><td align="center" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0px 0px 10px;" valign="top">\
                            <center style="width: 100%; min-width: 640px;">\
                              <br /><p style="text-align: center; font-size: 12px; color: #c0c4c8; line-height: 15px; font-family: Avenir, sans-serif; font-weight: normal; margin: 0 6% 10px; padding: 0;" align="center">\
                              	From Magpie with love\
                               \
                              </p>\
                              <p style="text-align: center; font-size: 12px; color: #c0c4c8; line-height: 15px; font-family: Avenir, sans-serif; font-weight: normal; margin: 0 6% 10px; padding: 0;" align="center">\
                              	1282 Noe Street, San Francisco, CA 94114\
                               \
                              </p>\
                              <br /><a href="'+ getUnsubsribeLink(invitationCodeObj) + '" style="text-decoration: underline; text-align: center; font-size: 12px; font-family: Avenir, sans-serif; color: #CFD2D7;"><font color="CFD2D7">Unsubscribe</font></a>\
                            </center>\
                          </td>\
                          <td class="expander" style="word-break: break-word; -webkit-hyphens: none; -moz-hyphens: none; hyphens: none; border-collapse: collapse !important; vertical-align: top; text-align: left; visibility: hidden; width: 0px; color: #222222; font-family: Avenir, sans-serif; font-weight: normal; line-height: 19px; font-size: 15px; margin: 0; padding: 0;" align="left" valign="top"></td>\
                        </tr></table></td>\
                  </tr></table><!-- container end below --></td>\
            </tr></table></td>\
		</tr></table></body>\
</html>\
';
}