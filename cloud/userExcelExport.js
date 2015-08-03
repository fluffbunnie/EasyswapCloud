Parse.Cloud.define("contactForm", function(request, response) {
    Parse.Cloud.useMasterKey();
    var ContactForm = Parse.Object.extend("ContactForm");
    var contactForm = new ContactForm();
    contactForm.set("name", request.params.name);
    contactForm.set("email", request.params.email);
    contactForm.set("detail", request.param.detail);

    property.save(null, {
        success:function(form) {
            response.success("Added a contact form");
        },
        error:function(error) {
            response.error("Error adding a contact form");
        }
    });
});



Parse.Cloud.define("userEmailsExcelExport", function(request, response) {
    Parse.Cloud.useMasterKey();
    var User = Parse.Object.extend("Users");

    var query = new Parse.Query(User);
    query.exists("location");
    query.exists("school");
    query.exists("occupation");
    query.doesNotExist("email");
    query.ascending("airbnbUid");
    query.limit(1000);
    query.skip(1000 * request.params.page);

    query.find({
        success:function(results) {
            response.success(results);
        },
        error:function(error) {
            response.error("Error exporting user information. Error: " + error.message);
        }
    });
});


Parse.Cloud.define("userDemographic", function(request, response) {
    Parse.Cloud.useMasterKey();
    var User = Parse.Object.extend("Users");

    var query = new Parse.Query(User);
    query.descending("location, school, occupation, language, description, airbnbUid, objectId");
    query.limit(1000);
    query.skip(1000 * request.params.page);

    query.find({
        success:function(results) {
            response.success(results);
        },
        error:function(error) {
            response.error("Error exporting user demographic information. Error: " + error.message);
        }
    });
});

Parse.Cloud.define("listingDemographic", function(request, response) {
    Parse.Cloud.useMasterKey();
    var Property = Parse.Object.extend("Property");

    var query = new Parse.Query(Property);
    query.descending("location, listingType, objectId");
    query.limit(1000);
    query.skip(1000 * request.params.page);

    query.find({
        success:function(results) {
            response.success(results);
        },
        error:function(error) {
            response.error("Error exporting listing demographic information. Error: " + error.message);
        }
    });
});