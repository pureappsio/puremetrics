// Future
Future = Npm.require('fibers/future');

Meteor.methods({

    getWebsiteProperty: function(website, user) {

        // Get options
        options = {
            user: user
        }

        // Call API
        var data = GoogleApi.get('/analytics/v3/management/accountSummaries', options);
        var properties = data.items;

    },

    getAmazonConversions: function(website, user) {

        // Get options
        options = {
            user: user
        }

        // Get period
        var period = Meteor.call('getPeriod', user);

        var sessions = Meteor.call('getGoogleEvents',
            website.propertyId,
            Meteor.call('getGoogleDate', period.current.from),
            Meteor.call('getGoogleDate', period.current.to),
            options
        );
        var pastSessions = Meteor.call('getGoogleEvents',
            website.propertyId,
            Meteor.call('getGoogleDate', period.past.from),
            Meteor.call('getGoogleDate', period.past.to),
            options
        );

        if (website.visitors.current != 0) {
          var currentConversion = sessions / website.visitors.current;
        }
        else {
          var currentConversion = 0;
        }
        if (website.visitors.past != 0) {
          var pastConversion = pastSessions / website.visitors.past;
        }
        else {
          var pastConversion = 0;
        }

        return {
            current: currentConversion,
            past: pastConversion,
            variation: Meteor.call('calculateVariation', currentConversion, pastConversion)
        };

    },

    getLast30DaysVisitors: function(website, user) {

        // Get options
        options = {
            user: user
        }

        // Get period
        var period = Meteor.call('getPeriod', user);

        // Call API
        var data = GoogleApi.get('/analytics/v3/management/accountSummaries', options);
        var properties = data.items;

        // Search for correct site
        for (i = 0; i < properties.length; i++) {

            if (properties[i].webProperties) {

                for (j = 0; j < properties[i].webProperties.length; j++) {

                    if ((properties[i].webProperties[j].websiteUrl).indexOf(website.url) != -1) {
                        var propertyId = properties[i].webProperties[j].profiles[0].id;
                        Websites.update(website._id, { $set: { propertyId: propertyId } });

                        var sessions = Meteor.call('getGoogleSessions',
                            propertyId,
                            Meteor.call('getGoogleDate', period.current.from),
                            Meteor.call('getGoogleDate', period.current.to),
                            options
                        );
                        var pastSessions = Meteor.call('getGoogleSessions',
                            propertyId,
                            Meteor.call('getGoogleDate', period.past.from),
                            Meteor.call('getGoogleDate', period.past.to),
                            options
                        );
                        return {
                            current: sessions,
                            past: pastSessions,
                            variation: Meteor.call('calculateVariation', sessions, pastSessions)
                        };
                    }

                }

            }

        }

    },
    getAccountSummaries: function() {

        // Get options
        options = {
            user: Meteor.user()
        }

        // Call API
        var data = GoogleApi.get('/analytics/v3/management/accountSummaries');
        // console.log(data.items[0].webProperties[0]);
        return data.items;

    },
    saveWebsitesList: function() {

        // Get all sites
        var properties = Meteor.call('getAccountSummaries');
        //console.log(properties);

        // Insert in DB
        for (i = 0; i < properties.length; i++) {

            for (j = 0; j < properties[i].webProperties.length; j++) {

                var website = {
                    name: properties[i].webProperties[j].name,
                    propertyId: properties[i].webProperties[j].profiles[0].id,
                    ownerId: Meteor.user()._id
                }

                // Insert if not existing
                if (!Websites.findOne({ propertyId: website.propertyId })) {
                    Websites.insert(website);
                }

            }

        }

    },

    getGoogleEvents: function(property, startDate, endDate, options) {

        var myFuture = new Future();

        // Request
        request = '/analytics/v3/data/ga?ids=ga:' + property;
        request += '&start-date=' + startDate + '&end-date=' + endDate;
        request += '&metrics=ga:totalEvents';

        // Make request
        GoogleApi.get(request, options, function(err, data) {
            if (err) { console.log(err); }
            if (!err) {
                // console.log(data);
                myFuture.return(parseInt(data.totalsForAllResults['ga:totalEvents']));
            }
        });

        return myFuture.wait();

    },

    getGoogleSessions: function(property, startDate, endDate, options) {

        var myFuture = new Future();

        //console.log('/analytics/v3/data/ga?ids=ga:' + property +'&start-date=' + startDate + '&end-date=' + endDate +'&metrics=ga:sessions');

        GoogleApi.get('/analytics/v3/data/ga?ids=ga:' + property + '&start-date=' + startDate + '&end-date=' + endDate + '&metrics=ga:sessions', options, function(err, data) {
            if (err) { console.log(err); }
            if (!err) {
                //console.log(data);
                myFuture.return(parseInt(data.totalsForAllResults['ga:sessions']));
            }
        });

        return myFuture.wait();

    },
    getPageSessions: function(property, page, startDate, endDate, options) {

        var myFuture = new Future();

        // Request
        request = '/analytics/v3/data/ga?ids=ga:' + property;
        request += '&start-date=' + startDate + '&end-date=' + endDate;
        request += '&metrics=ga:uniquePageviews&dimensions=ga:pagePath';
        request += '&filters=ga:pagePath==' + page;

        // Make request
        GoogleApi.get(request, options, function(err, data) {
            if (err) { console.log(err); }
            if (!err) {
                // console.log(data);
                myFuture.return(parseInt(data.totalsForAllResults['ga:uniquePageviews']));
            }
        });

        return myFuture.wait();

    },
    getPageSessionsPrevious: function(property, page, previousPage, startDate, endDate, options) {

        var myFuture = new Future();

        // Request
        request = '/analytics/v3/data/ga?ids=ga:' + property;
        request += '&start-date=' + startDate + '&end-date=' + endDate;
        request += '&metrics=ga:uniquePageviews&dimensions=ga:pagePath,ga:previousPagePath';
        request += '&filters=ga:pagePath==' + page;

        // Make request
        GoogleApi.get(request, options, function(err, data) {
            if (err) { console.log(err); }
            if (!err) {
                var sessions = 0;
                for (i = 0; i < data.rows.length; i++) {
                    if (data.rows[i][1] == previousPage) { sessions = data.rows[i][2]; }
                }
                myFuture.return(parseInt(sessions));
            }
        });

        return myFuture.wait();

    },
    userAddGoogleOauthCredentials: function(token, secret) {

        // var data = {};
        // data.accessToken = token;
        // data.expiresAt = 1;
        // console.log(data);

        // Retrieve data
        var data = Google.retrieveCredential(token, secret).serviceData;
        // console.log(data);

        // // Get credentials
        // var accountName = getUserCredentials(data.accessToken, data.accessTokenSecret);
        // data.name = accountName;

        // Update user profile
        Meteor.users.update(Meteor.user()._id, { $set: { "services.google": data } }, function(error) {
            if (error) { console.log(error); }
        });

        console.log(Meteor.user());

    }

});

function get_date(offset) {

    // Get dates
    var d = new Date();
    d.setDate(d.getDate() - offset);

    current_month = d.getMonth() + 1;
    current_year = d.getFullYear();
    current_day = d.getDate();

    current_month = current_month.toString();
    current_day = current_day.toString();

    if (current_month.length < 2) current_month = '0' + current_month;
    if (current_day.length < 2) { current_day = '0' + current_day };

    // Build date objects
    date = current_year + '-' + current_month + '-' + current_day;

    return date;

}
