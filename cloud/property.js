Parse.Cloud.define("approveProperty", function(request, response) {
    Parse.Cloud.useMasterKey();
    var Property = Parse.Object.extend("Property");
    var LocationIndex = Parse.Object.extend("LocationIndex");
    var query = new Parse.Query(Property);
    query.equalTo("objectId", request.params.pid);
    query.find({
        success:function(results) {
            if (results.length > 0) {
                var property = results[0];
                var state = property.get("state");
                if (state == "pending") {
                    property.set("state", "public");
                    property.save(null, {
                        success:function(result) {
                            var location = property.get("location");
                            if (location != undefined) {
                                var locationIndex = location.toLowerCase();

                                var query = new Parse.Query(LocationIndex);
                                query.equalTo("location", location);
                                query.equalTo("locationIndex", locationIndex);
                                query.find({
                                    success: function (results) {
                                        if (results.length > 0) {
                                            var result = results[0];
                                            result.increment("count");
                                            result.save(null, {
                                                success: function() {
                                                    response.success("Approved Successfully.");
                                                },
                                                error: function() {
                                                    response.success("Approved Successfully.");
                                                }
                                            });
                                        } else {
                                            var newLocationIndex = new LocationIndex();
                                            newLocationIndex.set("location", location);
                                            newLocationIndex.set("locationIndex", locationIndex);
                                            newLocationIndex.set("count", 1);

                                            newLocationIndex.save(null, {
                                                success: function (result) {
                                                    response.success("Approved Successfully.");
                                                },
                                                error: function (error) {
                                                    response.success("Approved Successfully.");
                                                }
                                            });
                                        }
                                    },
                                    error: function (error) {
                                        response.success("Approved Successfully.");
                                    }
                                });
                            } else {
                                response.success("Approved Successfully.");
                            }
                            //TODO add it in the index
                        },
                        error:function(error) {
                            response.error("Something went wrong, please try again.");
                        }
                    });
                } else {
                    response.error("Cannot approve the property. Property is either in private or public mode.")
                }
            } else {
                response.error("Cannot find property with specific ID. Please try again.");
            }
        },
        error:function(error) {
            response.error("Something went wrong, please try again.");
        }
    });
});

Parse.Cloud.define("addAirBnbProperty", function(request, response) {
    Parse.Cloud.useMasterKey();
    var User = Parse.Object.extend("Users");
    var Property = Parse.Object.extend("Property");
    
    //we first check if the property is already exist
    var queryProperty = new Parse.Query(Property);
    queryProperty.equalTo("airbnbPid", request.params.airbnbPid);
    queryProperty.find({
        success:function(propertyResults) {
            if (propertyResults.length > 0) {
                response.success("AirBnb property already exist");
            } else {
                //we then check if the property have an owner
                var queryOwner = new Parse.Query(User);
                queryOwner.equalTo("airbnbUid", request.params.ownerId);
                queryOwner.find({
                    success:function(results) {
                        if (results.length > 0) {
                            var owner = results[0];
                            var property = new Property();
                            property.set("owner", owner);
                            property.set("airbnbPid", request.params.airbnbPid);
                            property.set("name", request.params.name);
                            property.set("coverPic", request.params.coverPic);
                            property.set("location", request.params.location);
                            
                            if (request.params.latitude && request.params.longitude) {
                                var coordinate = new Parse.GeoPoint({latitude:request.params.latitude, longitude:request.params.longitude});
                                property.set("coordinate", coordinate);
                            }
                            
                            property.set("shortDescription", request.params.shortDescription);
                            property.set("fullDescription", request.params.fullDescription);
                            property.set("rule", request.params.rule);
                            property.set("propertyType", request.params.propertyType);
                            property.set("listingType", request.params.listingType);
                            property.set("numBedrooms", request.params.numBedrooms);
                            property.set("numBathrooms", request.params.numBathrooms);
                            property.set("numBeds", request.params.numBeds);
                            property.set("numGuests", request.params.numGuests);
                            property.set("rating", request.params.rating);
                            property.set("reviewCount", request.params.reviewCount);
                            
                            property.set("hasKitchen", request.params.hasKitchen);
                            property.set("hasInternet", request.params.hasInternet);
                            property.set("hasTV", request.params.hasTV);
                            property.set("hasEssentials", request.params.hasEssentials);
                            property.set("hasShampoo", request.params.hasShampoo);
                            property.set("hasHeating", request.params.hasHeating);
                            property.set("hasAirConditioning", request.params.hasAirConditioning);
                            property.set("hasWasher", request.params.hasWasher);
                            property.set("hasDryer", request.params.hasDryer);
                            property.set("hasFreeParkingOnPremises", request.params.hasFreeParkingOnPremises);
                            property.set("hasWirelessInternet", request.params.hasWirelessInternet);
                            property.set("hasCableTV", request.params.hasCableTV);
                            property.set("hasBreakfast", request.params.hasBreakfast);
                            property.set("isPetAllowed", request.params.isPetAllowed);
                            property.set("isFamilyKidFriendly", request.params.isFamilyKidFriendly);
                            property.set("isSuitableForEvents", request.params.isSuitableForEvents);
                            property.set("isSmokingAllowed", request.params.isSmokingAllowed);
                            property.set("isWheelchairAccessible", request.params.isWheelchairAccessible);
                            property.set("hasElevatorInBuilding", request.params.hasElevatorInBuilding);
                            property.set("hasIndoorFireplace", request.params.hasIndoorFireplace);
                            property.set("hasBuzzerWirelessIntercom", request.params.hasBuzzerWirelessIntercom);
                            property.set("hasDoorman", request.params.hasDoorman);
                            property.set("hasPool", request.params.hasPool);
                            property.set("hasHotTub", request.params.hasHotTub);
                            property.set("hasGym", request.params.hasGym);
                            property.set("hasSmokeDetector", request.params.hasSmokeDetector);
                            property.set("hasCarbonMonoxideDetector", request.params.hasCarbonMonoxideDetector);
                            property.set("hasFirstAidKit", request.params.hasFirstAidKit);
                            property.set("hasSafetyCard", request.params.hasSafetyCard);
                            property.set("hasFireExtinguisher", request.params.hasFireExtinguisher);
                            property.set("hasDog", request.params.hasDog);
                            property.set("hasCat", request.params.hasCat);
                            property.set("hasOtherPet", request.params.hasOtherPet);
                       
                            property.save(null, {
                                success:function(property) {
                                    response.success("AirBnb property added");
                                },
                                error:function(owner, merror) {
                                    response.error("Error adding AirBnb property. Error: " + merror.message + owner.username);
                                }
                            });
                            
                        } else {
                            response.success("Cannot find the ower of the property");
                        }
                    },
                    error:function(error) {
                        response.error("Error finding the ower of the property. Error: " + error.message);
                    }
                });
            }
        },
        error:function(propertyError) {
            reponse.error("Error checking property's existing before added")
        }
    });
});
