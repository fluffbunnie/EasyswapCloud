require(JSON);

var Mailgun = require('mailgun');
var UserMailgun = require('mailgun');

Parse.Cloud.afterSave("Property", function(request) {
    Parse.Cloud.useMasterKey();
    sendPropertyApprovalRequest(request);

    //check if the airbnb account associated is dummy. If so replace it.
    if(!request.object.existed() && request.object.get("airbnbPid") != undefined) {
        var Property = Parse.Object.extend("Property");

        var replaceProperty = request.object;
        var replaceOwner = replaceProperty.get("owner");

        var oldPropertyQuery = new Parse.Query(Property);
        oldPropertyQuery.equalTo("airbnbPid", request.object.get("airbnbPid"));
        oldPropertyQuery.notEqualTo("owner", replaceOwner);
        oldPropertyQuery.include("owner");
        oldPropertyQuery.find({
            success: function (results) {
                for (index = 0; index < results.length; index++) {
                    var oldProperty = results[index];
                    var oldOwner = oldProperty.get("owner");
                    if (oldOwner.get("loginType") == undefined) {
                        newPropertyUpdateTrip(oldProperty, oldOwner, replaceProperty, replaceOwner);
                    }
                }
            },
            error: function (error) {
                //DO NOTHING
            }
        });
    }
});

function newPropertyUpdateTrip(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    var Trip = Parse.Object.extend("Trip");
    var tripQuery = new Parse.Query(Trip);
    tripQuery.equalTo("place", oldProperty);
    tripQuery.find({
        success:function(results) {
            for (index = 0; index < results.length; index++) {
                var trip = results[index];
                trip.set("place", replaceProperty);
                if (trip.get("guest").id == oldOwner.id) trip.set("guest", replaceOwner);
                if (trip.get("host").id == oldOwner.id) trip.set("host", replaceOwner);
            }

            Parse.Object.saveAll(results, {
                success:function() {
                    newPropertyUpdateEditorialDeck(oldProperty, oldOwner, replaceProperty, replaceOwner);
                },
                error:function(error) {
                    newPropertyUpdateEditorialDeck(oldProperty, oldOwner, replaceProperty, replaceOwner);
                }
            });
        },
        error:function(error) {
            newPropertyUpdateEditorialDeck(oldProperty, oldOwner, replaceProperty, replaceOwner);
        }
    });
}

function newPropertyUpdateEditorialDeck(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    var EditorialDeck = Parse.Object.extend("EditorialDeck");
    var editorialDeckQuery = new Parse.Query(EditorialDeck);
    editorialDeckQuery.equalTo("property", oldProperty);
    editorialDeckQuery.find({
        success:function(results) {
            for (index = 0; index < results.length; index++) {
                var editorial = results[index];
                editorial.set("property", replaceProperty);
            }
            Parse.Object.saveAll(results, {
                success:function() {
                    newPropertyUpdateFavorite(oldProperty, oldOwner, replaceProperty, replaceOwner)
                },
                error:function(error) {
                    newPropertyUpdateFavorite(oldProperty, oldOwner, replaceProperty, replaceOwner)
                }
            });
        },
        error:function(error) {
            newPropertyUpdateFavorite(oldProperty, oldOwner, replaceProperty, replaceOwner)
        }
    });
}

function newPropertyUpdateFavorite(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    var Favorite = Parse.Object.extend("Favorite");
    var favoriteQuery = new Parse.Query(Favorite);
    favoriteQuery.equalTo("targetHouse", oldProperty);
    favoriteQuery.find({
        success:function(results) {
            for (index = 0; index < results.length; index++) {
                var favorite = results[index];
                favorite.set("targetHouse", replaceProperty);
                if (favorite.get("targetUser").id == oldOwner.id) favorite.set("targetUser", replaceOwner);
            }
            Parse.Object.saveAll(results, {
                success:function() {
                    newPropertyUpdateConversation(oldProperty, oldOwner, replaceProperty, replaceOwner)
                },
                error:function(error) {
                    newPropertyUpdateConversation(oldProperty, oldOwner, replaceProperty, replaceOwner)
                }
            });
        },
        error:function(error) {
            newPropertyUpdateConversation(oldProperty, oldOwner, replaceProperty, replaceOwner);
        }
    });
}

function newPropertyUpdateConversation(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    var Conversation = Parse.Object.extend(conversation);
    var conversationQuery = new Parse.Query(Conversation);
    conversationQuery.equalTo("user2Property", oldProperty);
    conversationQuery.equalTo("user2", oldOwner);
    conversationQuery.find({
        success:function(results) {
            for (index = 0; index < results.length; index++) {
                var conversation = results[index];
                conversation.set("user2Property", replaceProperty);
                conversation.set("user2", replaceOwner);
            }

            Parse.Object.saveAll(results, {
                success:function() {
                    newPropertyUpdateChat(oldProperty, oldOwner, replaceProperty, replaceOwner)
                },
                error:function(error) {
                    newPropertyUpdateChat(oldProperty, oldOwner, replaceProperty, replaceOwner)
                }
            });
        },
        error:function(error) {
            newPropertyUpdateChat(oldProperty, oldOwner, replaceProperty, replaceOwner);
        }
    });
}

function newPropertyUpdateChat(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    var Chat = Parse.Object.extend(Chat);
    var chat1Query = new Parse.Query(Chat);
    chat1Query.equalTo("sender", oldOwner);

    var chat2Query = new Parse.Query(Chat);
    chat2Query.equalTo("receiver", oldOwner);

    var chatQuery = new Parse.Query.or(chat1Query, chat2Query);
    chatQuery.find({
        success:function(results) {
            for (index = 0; index < results.length; index++) {
                var chat = results[index];
                if (chat.get("sender").id == oldOwner.id) chat.set("sender", replaceOwner);
                if (chat.get("receiver").id == oldOwner.id) chat.set("receiver", replaceOwner);
            }

            Parse.Object.saveAll(results, {
                success:function() {
                    newPropertyUpdateCleanup(oldProperty, oldOwner, replaceProperty, replaceOwner);
                },
                error:function(error) {
                    newPropertyUpdateCleanup(oldProperty, oldOwner, replaceProperty, replaceOwner);
                }
            });
        },
        error:function(error) {
            newPropertyUpdateCleanup(oldProperty, oldOwner, replaceProperty, replaceOwner);
        }
    });
}

function newPropertyUpdateCleanup(oldProperty, oldOwner, replaceProperty, replaceOwner) {
    oldProperty.destroy({
        success: function (ownerObj) {
            oldOwner.destroy({
                success: function (propertyObj) {
                    //DO NOTHING
                },
                error: function (error) {
                    //DO NOTHING
                }
            });
        },
        error: function (error) {
            //DO NOTHING
        }
    });
}

////////////////////////////////////////////////////////
//Approval email
function sendPropertyApprovalRequest(request) {
    var Property = Parse.Object.extend("Property");
    var Trip = Parse.Object.extend("Trip");

    var emailHeader = "Pending Property Updated";
    if(!(request.object.existed())) emailHeader = "New Pending Property";
    var state = request.object.get("state");

    if (state == "pending") {
        var propertyQuery = new Parse.Query(Property);
        propertyQuery.equalTo("objectId", request.object.id);
        propertyQuery.include("owner");
        propertyQuery.find({
            success:function(results) {
                if (results.length > 0) {
                    var property = results[0];
                    var owner = property.get("owner");
                    var state = property.get("state");
                    if (state == "pending") {
                        var ownerImage = owner.get("profilePic");
                        var ownerName = getSenderName(owner);
                        if (ownerName == undefined) ownerName = "undefined";
                        var ownerEmail = owner.get("email");
                        if (ownerName == undefined) ownerEmail = "undefined";
                        var ownerLocation = owner.get("fullLocation");
                        if (ownerLocation == undefined) ownerLocation = "undefined";
                        var ownerDescription = owner.get("description");
                        if (ownerDescription == undefined) ownerDescription = "undefined";

                        var ownerHeaderHtml = getTableStyle()
                            + getTableHeader2Cell("Owner")
                            + getImageCell(ownerImage)
                            + "</table>";

                        //Now is the property
                        var propertyCover = property.get("coverPic");
                        var propertyName = property.get("name");
                        if (propertyName == undefined) propertyName = "undefined";
                        var propertyAirbnbId = property.get("airbnbPid");
                        if (propertyAirbnbId == undefined) propertyAirbnbId = "Not From airbnb";
                        else propertyAirbnbId = "<a href=\"https://wwww.airbnb.com/rooms/" + propertyAirbnbId + "\">" + propertyAirbnbId + "</a>";
                        var propertyLocation = property.get("location");
                        if (propertyLocation == undefined) propertyLocation = "undefined";
                        var propertyListingType = property.get("listingType");
                        if (propertyListingType == undefined) propertyListingType = "undefined";
                        var propertyNumBathrooms = property.get("numBathrooms");
                        if (propertyNumBathrooms == undefined) propertyNumBathrooms = "undefined";
                        var propertyNumBedrooms = property.get("numBedrooms");
                        if (propertyNumBedrooms == undefined) propertyNumBedrooms = "undefined";
                        var propertyNumBeds = property.get("numBeds");
                        if (propertyNumBeds == undefined) propertyNumBeds = "undefined";
                        var propertyNumGuests = property.get("numGuests");
                        if (propertyNumGuests == undefined) propertyNumGuests = "undefined";

                        var propertyHeaderHtml = getTableStyle()
                            + getTableHeaderCell(emailHeader)
                            + getImageCell(propertyCover)
                            + "</table>";

                        var propertyInfoHeaderHtml = getTableStyle()
                            + getTableHeader2Cell("Place Information")
                            + "</table>";

                        var propertyHtml = getTableStyle()
                            + getInfoColumn("PID:", property.id)
                            + getInfoColumn("Name:", propertyName)
                            + getInfoColumn("Airbnb Id:", propertyAirbnbId)
                            + getInfoColumn("Location:", propertyLocation)
                            + getInfoColumn("Type:", propertyListingType)
                            + getInfoColumn("# Baths:", propertyNumBathrooms)
                            + getInfoColumn("# Bdrs:", propertyNumBedrooms)
                            + getInfoColumn("# Beds:", propertyNumBeds)
                            + getInfoColumn("# Guests:", propertyNumGuests)
                            + "</table>";

                        var ownerHtml = getTableStyle()
                            + getInfoColumn("Owner Id:", owner.id)
                            + getInfoColumn("Name:", ownerName)
                            + getInfoColumn("Email:", ownerEmail)
                            + getInfoColumn("Location:", ownerLocation)
                            + getInfoColumn("About Me:", ownerDescription)
                            + "</table>";

                        //Now is the photo
                        var relation = property.relation("photos");
                        relation.query().find({
                            success:function(list) {
                                var photoHtml = getTableStyle()
                                    + getTableHeader2Cell("Photos");
                                for (index = 0; index < list.length; index++) {
                                    var photoUrl = list[index].get("photoUrl");
                                    photoHtml += getImageCell(photoUrl);

                                    var photoDescription = list[index].get("photoDescription");
                                    if (photoDescription == undefined) photoDescription = "No description";
                                    photoHtml += getDescriptionCell(photoDescription);
                                }
                                photoHtml += "</table>";

                                Mailgun.initialize('support.getmagpie.com', 'key-29a34dfd9d1f65049b8e05e03ff3214b');
                                Mailgun.sendEmail({
                                    to: "pilo@getmagpie.com",
                                    from: ownerName + " <noreply@support.getmagpie.com>",
                                    subject: "New property approval review request",
                                    html: "<html>"
                                    + "<body style=\"padding:0; margin:0; background-color:#e2e2e2\">"
                                    + propertyHeaderHtml
                                    + "<br><br>"
                                    + photoHtml
                                    + "<br><br>"
                                    + propertyInfoHeaderHtml
                                    + propertyHtml
                                    + "<br><br>"
                                    + ownerHeaderHtml
                                    + ownerHtml
                                    + "<br><br><br>"
                                    + getApproveButtonForPropertyWithId(request.object.id)
                                    + "</body>"
                                    + "</html>"
                                }, {
                                    success: function(httpResponse) {
                                        console.log(httpResponse);
                                    },
                                    error: function(httpResponse) {
                                        console.error(httpResponse);
                                    }
                                });
                            },
                            error:function(error) {
                                console.error("Error: " + error);
                            }
                        });
                    }
                }
            }
        });
    }
}

function getHeaderHtmlStyle() {
    return "<head>"
        + "<style>"
        + "body {"
        + "margin: 0px;"
        + "padding: 0px;"
        + "background-color:#e2e2e2;"
        + "}"

        + ".container {"
        + "padding: 0px;"
        + "align: center;"
        + "width: 80%;"
        + "margin-left: 10%;"
        + "}"

        + ".tableHeader {"
        + "background-color:#de5057;"
        + "text-align:center;"
        + "color:#fff;"
        + "padding: 10px 10px 10px 10px;"
        + "font: 18px arial, sans-serif;"
        + "}"

        + ".tableHeader2 {"
        + "background-color:#c2c2c2;"
        + "text-align:center;"
        + "color:#fff;"
        + "padding: 10px 10px 10px 10px;"
        + "font: 18px arial, sans-serif;"
        + "}"

        + ".column1 {"
        + "padding: 10px 5px 10px 5px;"
        + "font-weight: bold;"
        + "}"

        + ".column2 {"
        + "padding: 10px 5px 10px 5px;"
        + "font-weight: normal;"
        + "}"

        + ".description {"
        + "align: center;"
        + "padding: 10px 7px 10px 15px;"
        + "font-weight: italic;"
        + "}"
        + "</style>"
        + "</head>"
}

function getApproveButtonForPropertyWithId(PID) {
    return getTableStyle()
        + "<tr>"
        + "<td align=\"center\" height=\"40\" bgcolor=\"#bd5998\" style=\"-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;\">"
        + "<a href=\"http://minhthao.pythonanywhere.com/api/airbnb/property/approval/" + PID
        + "\" style=\"font-size:16px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block\">"
        + "<span style=\"color:#ffffff;\">Approve</span>"
        + "</a>"
        + "</td>"
        + "</tr>"
        + "</table>";
}

function getTableStyle() {
    return "<table style=\"padding:0; align:center; width:100%; margin:0\">";
}

function getTableHeaderCell(text) {
    return "<tr><th style=\"background-color:#de5057; text-align:center; color:#fff; padding:10px; font:18px arial, sans-serif\">" + text + "</th></tr>";
}

function getTableHeader2Cell(text) {
    return "<tr><th style=\"background-color:#c2c2c2; text-align:center; color:#fff; padding:10px; font:18px arial, sans-serif\">" + text + "</th></tr>";
}

function getImageCell(image) {
    if (image == undefined) return "";
    else return "<tr><td><img src=\"" + image + "\" style=\"width:100%\"</td></tr>";
}

function getDescriptionCell(text) {
    return "<tr><td style=\"align:center; padding:7px 10px 15px 10px\" align=\"center\"><i><b>Description: </b>" + text + "</i></td></tr>";
}

function getInfoColumn(description, text) {
    return "<tr><td style=\"padding:5px 10px 5px 10px; font-weight:bold\">" + description +"</td><td style=\"padding:5px 10px 5px 10px; font-weight:normal\">" + text +"</td></tr>";
}

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






