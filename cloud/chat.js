//
//Parse.Cloud.beforeSave("Chat",function(request) {
//    response.success();
//    var chatObj = request.object;
//    var conversationObj = chatObj.get("conversation");
//    if (conversationObj.id == "Gk0KxJoZ9W") {
//        response.error();
//    } else {
//        response.success();
//    }
//});

/**
 * Handle the behavior when the user comment on a conversation
 */
Parse.Cloud.afterSave("Chat", function(request) {
    Parse.Cloud.useMasterKey();
    var Conversation = Parse.Object.extend("Conversation");
    var User = Parse.Object.extend("Users");
    var Trip = Parse.Object.extend("Trip");

    var conversation = request.object.get("conversation");
    var sender = request.object.get("sender");
    var receiver = request.object.get("receiver");
    var content = request.object.get("content");
    var contentType = request.object.get("contentType");
    var chatId = request.object.id;

    var receiverQuery = new Parse.Query(User);
    receiverQuery.equalTo("objectId", receiver.id);
    receiverQuery.find({
        success:function(receivers) {
            if (receivers.length > 0) {
                var mReceiver = receivers[0];
                var loginType = mReceiver.get("loginType");
                if (loginType == undefined) {
                    //if the user does not exist, we send an email to pilo@getmagpie.com
                    var senderQuery = new Parse.Query(User);
                    senderQuery.equalTo("objectId", sender.id);
                    senderQuery.find({
                        success:function(senders) {
                            if (senders.length > 0) {
                                var mSender = senders[0];
                                var senderEmail = mSender.get("email");
                                if (senderEmail == undefined) senderEmail = "undefined";

                                var conversationQuery = new Parse.Query(Conversation);
                                conversationQuery.equalTo("objectId", conversation.id);
                                conversationQuery.include("user2Property");
                                conversationQuery.find({
                                    success:function(conversations) {
                                        if (conversations.length > 0) {
                                            var mConversation = conversations[0];
                                            var place = mConversation.get("user2Property");
                                            var placeName = place.get("name");
                                            if (placeName == undefined) placeName = "undefined";
                                            var placeLocation = place.get("location");
                                            if (placeLocation == undefined) placeLocation = "undefined";
                                            var placeAirbnbPid = place.get("airbnbPid");
                                            if (placeAirbnbPid == undefined) placeAirbnbPid = "undefined";

                                            Mailgun.initialize('support.getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');

                                            if (contentType == "book") {
                                                var tripQuery = new Parse.Query(Trip);
                                                tripQuery.equalTo("objectId", content);
                                                tripQuery.include("place");
                                                tripQuery.find({
                                                    success: function (trips) {
                                                        if (trips.length > 0) {
                                                            var trip = trips[0];
                                                            Mailgun.sendEmail({
                                                                to: "support@getmagpie.com, katerina@getmagpie.com, mt@getmagpie.com",
                                                                from: getSenderName(mSender) + " <noreply@support.getmagpie.com>",
                                                                subject: "Booking request made to airbnb user " + getSenderName(mReceiver),
                                                                html: "<b>Sender Id: </b>" + sender.id + "<br>"
                                                                + "<b>Sender name: </b>" + getSenderName(mSender) + "<br>"
                                                                + "<b>Sender email: </b>" + senderEmail + "<br><br><br>"

                                                                + "<b>Receiver Id: </b>" + receiver.id + "<br>"
                                                                + "<b>Receiver name: </b>" + getSenderName(mReceiver) + "<br>"
                                                                + "<b>Receiver airbnb Id: </b> <a href=\"https://wwww.airbnb.com/users/show/" + mReceiver.get("airbnbUid") + "\">" + mReceiver.get("airbnbUid") + "</a><br><br><br>"

                                                                + "<b>Target place id: </b>" + conversation.id + "<br>"
                                                                + "<b>Target place name: </b>" + placeName + "<br>"
                                                                + "<b>Target place location: </b>" + placeLocation + "<br>"
                                                                + "<b>Target place airbnb Id: </b> <a href=\"https://wwww.airbnb.com/rooms/" + placeAirbnbPid + "\">" + placeAirbnbPid + "</a><br><br><br>"

                                                                + "<b>Start date: </b>" + trip.get("startDate") + "<br>"
                                                                + "<b>End date: </b>" + trip.get("endDate")
                                                            }, {
                                                                success: function(httpResponse) {
                                                                    console.log("email sent");
                                                                    console.log(httpResponse);
                                                                },
                                                                error: function(httpResponse) {
                                                                    console.error(httpResponse);
                                                                }
                                                            });
                                                        }
                                                    },
                                                    error:function(tripError) {
                                                        console.log("Error: " + tripError);
                                                    }
                                                });
                                            }
                                        } else {
                                            Mailgun.sendEmail({
                                                to: "pilo@getmagpie.com",
                                                from: getSenderName(mSender) + " <noreply@support.getmagpie.com>",
                                                subject: "Message sent to airbnb user " + getSenderName(mReceiver),
                                                html: "<b>Sender Id: </b>" + sender.id + "<br>"
                                                + "<b>Sender name: </b>" + getSenderName(mSender) + "<br>"
                                                + "<b>Sender email: </b>" + senderEmail + "<br><br><br>"

                                                + "<b>Receiver Id: </b>" + receiver.id + "<br>"
                                                + "<b>Receiver name: </b>" + getSenderName(mReceiver) + "<br>"
                                                + "<b>Receiver airbnb Id: </b> <a href=\"https://wwww.airbnb.com/users/show/" + mReceiver.get("airbnbUid") + "\">" + mReceiver.get("airbnbUid") + "</a><br><br><br>"

                                                + "<b>Target place id: </b>" + conversation.id + "<br>"
                                                + "<b>Target place name: </b>" + placeName + "<br>"
                                                + "<b>Target place location: </b>" + placeLocation + "<br>"
                                                + "<b>Target place airbnb Id: </b> <a href=\"https://wwww.airbnb.com/rooms/" + placeAirbnbPid + "\">" + placeAirbnbPid + "</a><br><br><br>"

                                                + "<b>Content type: </b>" + contentType + "<br>"
                                                + "<b>Content: </b>" + content
                                            }, {
                                                success: function(httpResponse) {
                                                    console.log("email sent");
                                                    console.log(httpResponse);
                                                },
                                                error: function(httpResponse) {
                                                    console.error(httpResponse);
                                                }
                                            });
                                        }
                                    },
                                    error:function(conversationError) {
                                        console.log("Error: " + conversationError);
                                    }
                                });
                            }
                        },
                        error:function(senderError) {
                            console.log("Error: " + senderError);
                        }
                    });
                } else {
                    //if the user does exist, we send the push notification
                    console.log("start pushing");
                    var senderQuery = new Parse.Query(User);
                    senderQuery.equalTo("objectId", sender.id);
                    senderQuery.find({
                        success: function (results) {
                            if (results.length > 0) {
                                //console.log("pushing request for: " + sender.id);
                                var mSender = results[0];
                                var alertMessage = chatNotificationAlertString(mSender, content, contentType);
                                var senderPhoto = mSender.get("profilePic");
                                if (senderPhoto == undefined) senderPhoto = "";

                                var userPushQuery = new Parse.Query(Parse.Installation);
                                userPushQuery.equalTo("user", receiver);
                                Parse.Push.send({
                                    where: userPushQuery,
                                    data: {
                                        alert: alertMessage,
                                        badge: 'Increment',
                                        "type": "message",
                                        "message_id": chatId,
                                        "message_sender_id": sender.id,
                                        "message_sender_name": getSenderName(mSender),
                                        "message_sender_photo": senderPhoto,
                                        "message_content": content,
                                        "message_content_type": contentType
                                    }
                                }, {
                                    success: function () {
                                        console.log("push successful");
                                    },
                                    error: function (error) {
                                        console.error("Error: " + error.message);
                                    }
                                });
                            }
                        },
                        error:function(error) {
                            console.error("Error: " + error);
                        }
                    });
                }
            }
        },
        error:function(receiverError) {
            console.error("Error: " + receiverError);
        }
    });
});

function chatNotificationAlertString(mSender, content, contentType) {
    var name = getSenderName(mSender);

    if (contentType == "text") {
        return name + ": " + content;
    } else if (contentType == "book") {
        return name + " requested a stay at your place.";
    } else if (contentType == "confirm") {
        return name + " approved your stay request";
    } else if (contentType == "cancel") {
        return name + " canceled the stay request at your place";
    }
}

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