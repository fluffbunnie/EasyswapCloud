Parse.Cloud.job("indexPropertyAmenity", function(request, status) {
    Parse.Cloud.useMasterKey();
    var Property = Parse.Object.extend("Property");

    var query = new Parse.Query(Property);
    query.descending("objectId");
    query.limit(1000);
    query.skip(1000 * request.params.page);

    query.find({
        success:function(results) {
            console.log(results.length);
            indexPropertyAmenity(results, 0, status);
        },
        error:function(error) {
            status.error("Error index property amenity. Error: " + error.message);
        }
    });
});

/**
 * Index the property amenity in the list
 * @param properties
 * @param index
 * @param status
 */
function indexPropertyAmenity(properties, index, status) {
    Parse.Cloud.useMasterKey();

    if (index < properties.length) {
        var Amenity = Parse.Object.extend("Amenity");
        var property = properties[index];
        var amenity = new Amenity();
        amenity.set("generalAirConditioning", false);
        amenity.set("generalAirConditioningDescription", "");
        amenity.set("generalHeating", false);
        amenity.set("generalHeatingDescription", "");
        amenity.set("generalInternet", false);
        amenity.set("generalInternetDescription", "");
        amenity.set("generalWasher", false);
        amenity.set("generalWasherDescription", "");
        amenity.set("generalDryer", false);
        amenity.set("generalDryerDescription", "");
        amenity.set("generalFamilyFriendly", false);
        amenity.set("generalFamilyFriendlyDescription", "");
        amenity.set("generalPetAllowed", false);
        amenity.set("generalPetAllowedDescription", "");
        amenity.set("generalSmokingNotAllowed", false);
        amenity.set("generalSmokingNotAllowedDescription", "");
        amenity.set("generalWheelchairAccessible", false);
        amenity.set("generalWheelchairAccessibleDescription", "");
        amenity.set("generalGym", false);
        amenity.set("generalGymDescription", "");
        amenity.set("generalHotTub", false);
        amenity.set("generalHotTubDescription", "");
        amenity.set("generalPool", false);
        amenity.set("generalPoolDescription", "");

        amenity.set("livingRoomTV", false);
        amenity.set("livingRoomTVDescription", "");
        amenity.set("livingRoomSofa", false);
        amenity.set("livingRoomSofaDescription", "");
        amenity.set("livingRoomFireplace", false);
        amenity.set("livingRoomFireplaceDescription", "");

        amenity.set("kitchenMicrowave", false);
        amenity.set("kitchenMicrowaveDescription", "");
        amenity.set("kitchenRefrigerator", false);
        amenity.set("kitchenRefrigeratorDescription", "");
        amenity.set("kitchenSilverware", false);
        amenity.set("kitchenSilverwareDescription", "");
        amenity.set("kitchenDishware", false);
        amenity.set("kitchenDishwareDescription", "");
        amenity.set("kitchenToaster", false);
        amenity.set("kitchenToasterDescription", "");
        amenity.set("kitchenOven", false);
        amenity.set("kitchenOvenDescription", "");
        amenity.set("kitchenCoffeeMaker", false);
        amenity.set("kitchenCoffeeMakerDescription", "");
        amenity.set("kitchenDiningTable", false);
        amenity.set("kitchenDiningTableDescription", "");
        amenity.set("kitchenSmokeDetector", false);
        amenity.set("kitchenSmokeDetectorDescription", "");

        amenity.set("bedroomBed", false);
        amenity.set("bedroomBedDescription", "");
        amenity.set("bedroomCloset", false);
        amenity.set("bedroomClosetDescription", "");
        amenity.set("bedroomTV", false);
        amenity.set("bedroomTVDescription", "");

        amenity.set("bathroomToiletPaper", false);
        amenity.set("bathroomToiletPaperDescription", "");
        amenity.set("bathroomTowel", false);
        amenity.set("bathroomTowelDescription", "");
        amenity.set("bathroomHotShower", false);
        amenity.set("bathroomHotShowerDescription", "");
        amenity.set("bathroomShampoo", false);
        amenity.set("bathroomShampooDescription", "");
        amenity.set("bathroomHairDryer", false);
        amenity.set("bathroomHairDryerDescription", "");
        amenity.set("bathroomFirstAidKit", false);
        amenity.set("bathroomFirstAidKitDescription", "");

        //var hasAirConditioning = property.get("hasAirConditioning");
        //if (hasAirConditioning == true) {
            amenity.set("generalAirConditioning", true);
            amenity.set("generalAirConditioningDescription", "AC available");
        //}

        //var hasHeating = property.get("hasHeating");
        //if (hasHeating == true) {
            amenity.set("generalHeating", true);
            amenity.set("generalHeatingDescription", "Heating available");
        //}

        //var hasInternet = property.get("hasInternet");
        //var hasWirelessInternet = property.get("hasWirelessInternet");
        //if (hasInternet == true || hasWirelessInternet == true) {
            amenity.set("generalInternet", true);
            //if (hasWirelessInternet) {
                amenity.set("generalInternetDescription", "Free Wi-Fi");
            //} else {
            //    amenity.set("generalInternetDescription", "Free Internet");
            //}
        //}

        //var hasWasher = property.get("hasWasher");
        //if (hasWasher == true) {
            amenity.set("generalWasher", true);
            amenity.set("generalWasherDescription", "Washer on-site");
        //}
        //
        //var hasDryer = property.get("hasDryer");
        //if (hasDryer == true) {
            amenity.set("generalDryer", true);
            amenity.set("generalDryerDescription", "Dryer on-site");
        //}

        //var isFamilyKidFriendly = property.get("isFamilyKidFriendly");
        //if (isFamilyKidFriendly == true) {
            amenity.set("generalFamilyFriendly", true);
            amenity.set("generalFamilyFriendlyDescription", "Kid-friendly & family-friendly");
        //}

        //var isPetAllowed = property.get("isPetAllowed");
        //if (isPetAllowed == true) {
            amenity.set("generalPetAllowed", true);
            amenity.set("generalPetAllowedDescription", "Furry friends welcome");
        //}

        //var isWheelchairAccessible = property.get("isWheelchairAccessible");
        //if (isWheelchairAccessible == true) {
            amenity.set("generalWheelchairAccessible", true);
            amenity.set("generalWheelchairAccessibleDescription", "Wheelchair accessible");
        //}

        //var hasGym = property.get("hasGym");
        //if (hasGym == true) {
            amenity.set("generalGym", true);
            amenity.set("generalGymDescription", "Accessible gym");
        //}

        //var hasHotTub = property.get("hasHotTub");
        //if (hasHotTub == true) {
            amenity.set("generalHotTub", true);
            amenity.set("generalHotTubDescription", "Hot tub available");
        //}

        //var hasPool = property.get("hasPool");
        //if (hasPool == true) {
            amenity.set("generalPool", true);
            amenity.set("generalPoolDescription", "Outdoor pool");
        //}

        //if (Math.random() > 0.5) {
            amenity.set("bedroomBed", true);
            amenity.set("bedroomBedDescription", "Bedding & pillows provided");
        //}

        if (Math.random() > 0.5) {
            amenity.set("bedroomCloset", true);
            amenity.set("bedroomClosetDescription", "Closet available for use");
        }

        if (Math.random() > 0.5) {
            amenity.set("bedroomTV", true);
            amenity.set("bedroomTVDescription", "TV in the bedroom");
        }

        var hasCableTV = property.get("hasCableTV");
        var hasTV = property.get("hasTV");
        if (hasCableTV == true || hasTV == true) {
            amenity.set("livingRoomTV", true);
            if (hasCableTV) {
                amenity.set("livingRoomTVDescription", "Cable TV available");
            } else {
                amenity.set("livingRoomTVDescription", "TV available");
            }
        }

        var hasIndoorFireplace = property.get("hasIndoorFireplace");
        if (hasIndoorFireplace == true) {
            amenity.set("livingRoomFireplace", true);
            amenity.set("livingRoomFireplaceDescription", "Fireplace available for use")
        }

        if (Math.random() > 0.5) {
            amenity.set("livingRoomSofa", true);
            amenity.set("livingRoomSofaDescription", "Sofa available");
        }

        var hasFirstAidKit = property.get("hasFirstAidKit");
        if (hasFirstAidKit == true) {
            amenity.set("bathroomFirstAidKit", true);
            amenity.set("bathroomFirstAidKitDescription", "First-aid kit provided");
        }

        var hasShampoo = property.get("hasShampoo");
        if (hasShampoo == true) {
            amenity.set("bathroomShampoo", true);
            amenity.set("bathroomShampooDescription", "Toiletries available for use")
        }

        if (Math.random() > 0.5) {
            amenity.set("bathroomTowel", true);
            amenity.set("bathroomTowelDescription", "Extra bath towels for guests");
        }

        if (Math.random() > 0.5) {
            amenity.set("bathroomToiletPaper", true);
            amenity.set("bathroomToiletPaperDescription", "Toilet paper available");
        }

        if (Math.random() > 0.5) {
            amenity.set("bathroomHotShower", true);
            amenity.set("bathroomHotShowerDescription", "Hot shower available");
        }

        if (Math.random() > 0.5) {
            amenity.set("bathroomHairDryer", true);
            amenity.set("bathroomHairDryerDescription", "Hair dryer available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenMicrowave", true);
            amenity.set("kitchenMicrowaveDescription", "Microwave available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenRefrigerator", true);
            amenity.set("kitchenRefrigeratorDescription", "Fridge available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenSilverware", true);
            amenity.set("kitchenSilverwareDescription", "Silverware available for use");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenDishware", true);
            amenity.set("kitchenDishwareDescription", "Dishes available for use");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenToaster", true);
            amenity.set("kitchenToasterDescription", "Toaster available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenOven", true);
            amenity.set("kitchenOvenDescription", "Oven available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenCoffeeMaker", true);
            amenity.set("kitchenCoffeeMakerDescription", "Coffee maker available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenDiningTable", true);
            amenity.set("kitchenDiningTableDescription", "Dining table available");
        }

        if (Math.random() > 0.5) {
            amenity.set("kitchenSmokeDetector", true);
            amenity.set("kitchenSmokeDetectorDescription", "Smoke detector available");
        }


        amenity.save(null, {
            success:function(result) {
                property.set("amenity", result);
                property.save(null, {
                    success:function(propResult) {
                        indexPropertyAmenity(properties, index + 1, status);
                    },
                    error:function(error) {
                        status.error("Error index property amenity");
                    }
                });
            },
            error:function(error) {
                status.error("Error index property amenity");
            }
        })
    } else {
        status.success("index amenity completed");
    }
}