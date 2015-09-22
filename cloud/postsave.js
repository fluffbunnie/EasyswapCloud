require(JSON);

var Mailgun = require('mailgun');
var UserMailgun = require('mailgun');
var EmailPublishing = require('cloud/email-property-publishing.js');


/**
 * Before save a property, we need to check if the state has been changed. If so, then send the approval request or the publish email as needed
 */
Parse.Cloud.beforeSave("Property", function(request, response) {
    var Property = Parse.Object.extend("Property");
    Parse.Cloud.useMasterKey();

    if (request.object.existed()) {
        if (request.object.dirty("state")) {
            if (request.object.get("state") == "public") {
                var propertyQuery = new Parse.Query(Property);
                propertyQuery.equalTo("objectId", request.object.id);
                propertyQuery.include("owner");
                propertyQuery.find({
                    success:function(results) {
                        if (results.length > 0) {
                            var propertyObj = results[0];
                            EmailPublishing.sendPublicPropertyContent(propertyObj, response);
                        } else {
                            response.success();
                        }
                    },
                    error:function(error) {
                        console.error("Error: " + error);
                        response.success()
                    }
                });
            } else {
                response.success();
            }
        } else {
            response.success();
        }
    } else {
        response.success();
    }
});

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






