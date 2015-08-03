var twilio = require('twilio')('AC06f32c0fe81fa7e66cb3dfded9ab3d6d', '7611d43c04b132fc0c4abf728dafb636');

Parse.Cloud.define("sendVerificationCode", function(request, response) {
    var verificationCode = Math.floor(Math.random()*89999) + 10000;
    twilio.sendSms({
        from: "+16503997927",
        to: request.params.phoneNumber,
        body: "Your verification code is " + verificationCode + "."
    }, function(err, responseData) {
        if (err) {
            response.error(err);
        } else {
            response.success({
                phoneVerificationCode: verificationCode
            });
        }
    });
});