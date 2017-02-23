Meteor.methods({

    validateApiKey: function(key) {

        var user = Meteor.users.findOne({ apiKey: key });

        if (user) {
            return true;
        } else {
            return false;
        }

    },
    generateApiKey: function() {

        // Check if key exist
        if (!Meteor.user().apiKey) {

            // Generate key
            var key = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 16; i++) {
                key += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log(key);

            // Update user
            Meteor.users.update(Meteor.user()._id, { $set: { apiKey: key } });
        }

    },

    setDateRange: function(dateRange) {

        // Set
        var meta = {
            value: dateRange,
            type: 'dateRange',
            userId: Meteor.user()._id
        }
        Meteor.call('insertMeta', meta);

        // Refresh
        Meteor.call('refreshAll');

    },
    getDateRange: function() {

        return Metas.findOne({ type: 'dateRange' });

    },
    printUsers: function() {

        // Print all users
        var users = Meteor.users.find({}).fetch();
        for (i = 0; i < users.length; i++) {
            if (users[i].emails) {
                console.log(users[i]);
                console.log(users[i].emails[0]);
            } else {
                console.log(users[i]);
            }

        }

    },
    reset: function() {

        // Remove all
        Websites.remove({});
        Products.remove({});
        Integrations.remove({});
        Meteor.users.remove({});

    },
    addWebsite: function(website) {

        // Insert
        Websites.insert(website)
    },
    editWebsite: function(website) {

        console.log(website);

        // Update
        Websites.update(website._id, { $set: website });

    },
    deleteWebsite: function(websiteId) {

        // Delete
        Websites.remove(websiteId)

    },
    refreshAll: function() {

        // Go through all users
        var users = Meteor.users.find({}).fetch();
        for (u = 0; u < users.length; u++) {

            // Go through all dashboards
            dashboards = Dashboards.find({ userId: users[u]._id }).fetch();

            for (d in dashboards) {
                Dashboards.update(dashboards[d]._id, { $set: { lastUpdated: new Date() } });
            }

            // Go through websites
            websites = Websites.find({ userId: users[u]._id }).fetch();
            for (w = 0; w < websites.length; w++) {

                // Update visitors
                console.log('Updating visitors for website: ' + websites[w].name);
                var visitors = Meteor.call('getLast30DaysVisitors', websites[w], users[u]);
                Websites.update(websites[w]._id, { $set: { visitors: visitors } });

                // Refresh website
                website = Websites.findOne(websites[w]._id);

                // Amazon conversion
                console.log('Updating Amazon conversions for website: ' + website.name);
                var amazon = Meteor.call('getAmazonConversions', website, users[u]);
                Websites.update(websites[w]._id, { $set: { amazon: amazon } });

                // Update subscribers
                if (websites[w].list) {

                    console.log('Updating subscribers for website: ' + websites[w].name);

                    // All subscribers  
                    var subscribers = Meteor.call('getLast30DaysSubscribers', websites[w]);
                    Websites.update(websites[w]._id, { $set: { subscribers: subscribers } });

                    // Subscribers coming from ads only
                    var adSubscribers = Meteor.call('getAdsSubscribers', websites[w]);
                    Websites.update(websites[w]._id, { $set: { adSubscribers: adSubscribers } });

                    // Calculate ads/total subsribers 
                    var adsTotal = {
                        current: adSubscribers.current / subscribers.current * 100,
                        past: adSubscribers.past / subscribers.past * 100,
                        variation: Meteor.call('calculateVariation', adSubscribers.current / subscribers.current, adSubscribers.past / subscribers.past)
                    }
                    Websites.update(websites[w]._id, { $set: { adsTotal: adsTotal } });

                }

                // Update earnings & products
                if (websites[w].salesIntegrationId) {

                    console.log('Updating earnings/products for website: ' + websites[w].name);

                    // Refresh website
                    website = Websites.findOne(websites[w]._id);

                    // Sales & Earnings website
                    var sales = Meteor.call('getLast30DaysSales', website);
                    var earnings = Meteor.call('getLast30DaysEarnings', website);
                    Websites.update(website._id, { $set: { sales: sales, earnings: earnings } });

                    // Sales by country
                    var countriesSales = Meteor.call('getSalesCountry', website.salesIntegrationId, {});
                    console.log(countriesSales);
                    Websites.update(website._id, { $set: { countriesSales: countriesSales} });

                    // Products
                    Meteor.call('refreshAllProducts', website, users[u]);

                    // Refresh website
                    website = Websites.findOne(websites[w]._id);

                    // Websites pages visits
                    var checkout = Meteor.call('getWebsiteCheckoutVisits', website, users[u]);
                    Websites.update(website._id, { $set: { checkout: checkout } });

                    var salesPageSessions = Meteor.call('getWebsiteSalesVisits', website, users[u]);
                    Websites.update(website._id, { $set: { salesPageSessions: salesPageSessions } });

                }

                // Refresh website
                website = Websites.findOne(websites[w]._id);

                // Conversions
                Meteor.call('calculateWebsiteConversions', website, users[u]);
                console.log('Done updating: ' + websites[w].name);

            }

            console.log('Done updating all websites');

            // Amazon
            // var amazonData = Meteor.call('getAmazonAffiliateData', users[u]);
            // var dashboard = Dashboards.findOne({});
            // Dashboards.update(dashboard._id, { $set: { amazonEarnings: amazonData.earnings } });

            // Calculate costs, profits and margins
            if (users[u].facebookAdsId) {

                // Calculate earnings
                console.log('Calculating earnings ...');
                Meteor.call('calculateEarnings', users[u]);

                // Calculate costs
                console.log('Calculating costs ...');
                Meteor.call('calculateCosts', users[u]);

                // Calculate profits
                console.log('Calculating profits ...');
                Meteor.call('calculateProfits', users[u]);

                // Calculate margins
                console.log('Calculating margins ...');
                Meteor.call('calculateMargins', users[u]);
            }

        }

    }

});
