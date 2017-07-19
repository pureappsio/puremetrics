Meteor.methods({

    buildAverageReport: function() {

        var report = {};

        // Get dates
        var date = new Date();
        var currentDate = new Date(date.setDate(0));
        var pastDate = new Date(date.setDate(0));

        // Get all sites
        var websites = Websites.find({}).fetch();
        reportWebsites = [];

        currentTotal = 0;

        for (i in websites) {

            // Total
            var websiteTotalCurrent = 0;

            // Website data
            websiteData = {
                name: websites[i].name
            }

            // Get sales
            if (websites[i].salesIntegrationId) {

                var currentEarnings = Meteor.call('getEarnings', websites[i].salesIntegrationId, {
                    from: pastDate,
                    to: currentDate
                });

                var earnings = {
                    current: currentEarnings.toFixed(2)
                }

                currentTotal += currentEarnings;

                websiteTotalCurrent += currentEarnings;

                if (earnings.current > 5) {
                    websiteData.earnings = earnings;
                }

            }

            // Get Amazon earnings
            if (websites[i].siteId) {

                var currentEarnings = Meteor.call('getAmazonEarnings', {
                    siteId: websites[i].siteId,
                    from: Meteor.call('standardizedDate', pastDate),
                    to: Meteor.call('standardizedDate', currentDate)
                });


                var earnings = {
                    current: currentEarnings.toFixed(2)
                }

                websiteTotalCurrent += currentEarnings;

                currentTotal += currentEarnings;

                if (earnings.current > 5) {
                    websiteData.amazonEarnings = earnings;
                }

            }

            // Check for additional revenue
            if (Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

                var entries = Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).fetch();

                // Get categories
                var categories = [];
                for (i in entries) {
                    if (categories.indexOf(entries[i].categoryId)) {
                        categories.push(entries[i].categoryId);
                    }
                }

                additionalRevenues = [];
                for (i in categories) {

                    additionalRevenue = {
                        name: Categories.findOne(categories[i]).name,
                        current: 0
                    }

                    for (j in entries) {

                        if (entries[j].categoryId == categories[i]) {
                            additionalRevenue.current += entries[j].amount;
                            currentTotal += entries[j].amount;
                            websiteTotalCurrent += entries[j].amount;

                        }

                    }

                    additionalRevenue.current = additionalRevenue.current.toFixed(2);

                    additionalRevenues.push(additionalRevenue);

                }

                websiteData.additionalRevenue = additionalRevenues;

            }

            if (websiteData.amazonEarnings || websiteData.earnings || websiteData.additionalRevenue) {

                // Calculate total
                websiteData.total = {
                    current: websiteTotalCurrent.toFixed(2)
                }

                reportWebsites.push(websiteData);
            }

        }

        report.websites = reportWebsites;

        // Total
        total = {
            current: currentTotal.toFixed(2)
        }

        report.revenue = total;

        return report;

    },
    buildMonthlyReport: function(query) {

        var report = {};

        // Get dates
        var date = new Date();

        // Query ?
        if (query.year && query.month) {

            var currentDate = new Date();
            var pastDate = new Date();
            var pastPastDate = new Date();

            // Change according to query
            currentDate.setYear(query.year);
            pastDate.setYear(query.year);
            pastPastDate.setYear(query.year);

            currentDate.setMonth(query.month, 0);
            pastDate.setMonth(query.month - 1, 0);
            pastPastDate.setMonth(query.month - 2, 0);

        } else {
            var currentDate = new Date(date.setDate(0));
            var pastDate = new Date(date.setDate(0));
            var pastPastDate = new Date(date.setDate(0));
        }

        console.log(currentDate);
        console.log(pastDate);
        console.log(pastPastDate);

        // Get all sites
        var websites = Websites.find({}).fetch();
        reportWebsites = [];

        currentTotal = 0;
        pastTotal = 0;

        for (i in websites) {

            // Total
            var websiteTotalCurrent = 0;
            var websiteTotalPast = 0;

            // Website data
            websiteData = {
                name: websites[i].name
            }

            // Get sales
            if (websites[i].salesIntegrationId) {

                var currentEarnings = Meteor.call('getEarnings', websites[i].salesIntegrationId, {
                    from: pastDate,
                    to: currentDate
                });

                var pastEarnings = Meteor.call('getEarnings', websites[i].salesIntegrationId, {
                    from: pastPastDate,
                    to: pastDate
                });

                var earnings = {
                    current: currentEarnings.toFixed(2),
                    variation: (currentEarnings - pastEarnings).toFixed(2),
                    variation_percent: ((currentEarnings - pastEarnings) / pastEarnings * 100).toFixed(2)
                }

                currentTotal += currentEarnings;
                pastTotal += pastEarnings;

                websiteTotalCurrent += currentEarnings;
                websiteTotalPast += pastEarnings;

                if (earnings.current > 5) {
                    websiteData.earnings = earnings;
                }

            }

            // Get Amazon earnings
            if (websites[i].siteId) {

                var currentEarnings = Meteor.call('getAmazonEarnings', {
                    siteId: websites[i].siteId,
                    from: Meteor.call('standardizedDate', pastDate),
                    to: Meteor.call('standardizedDate', currentDate)
                });

                var pastEarnings = Meteor.call('getAmazonEarnings', {
                    siteId: websites[i].siteId,
                    from: Meteor.call('standardizedDate', pastPastDate),
                    to: Meteor.call('standardizedDate', pastDate)
                });

                var earnings = {
                    current: currentEarnings.toFixed(2),
                    variation: (currentEarnings - pastEarnings).toFixed(2),
                    variation_percent: ((currentEarnings - pastEarnings) / pastEarnings * 100).toFixed(2)
                }

                websiteTotalCurrent += currentEarnings;
                websiteTotalPast += pastEarnings;

                currentTotal += currentEarnings;
                pastTotal += pastEarnings;

                if (earnings.current > 5) {
                    websiteData.amazonEarnings = earnings;
                }

            }

            // Check for additional revenue
            if (Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

                var entries = Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: currentDate, $gte: pastDate } }).fetch();
                var pastEntries = Entries.find({ websiteId: websites[i]._id, type: 'revenue', date: { $lte: pastDate, $gte: pastPastDate } }).fetch();

                // Get categories
                var categories = [];
                for (i in entries) {
                    if (categories.indexOf(entries[i].categoryId)) {
                        categories.push(entries[i].categoryId);
                    }
                }

                additionalRevenues = [];
                for (i in categories) {

                    additionalRevenue = {
                        name: Categories.findOne(categories[i]).name,
                        current: 0
                    }

                    for (j in entries) {

                        if (entries[j].categoryId == categories[i]) {
                            additionalRevenue.current += entries[j].amount;
                            currentTotal += entries[j].amount;
                            websiteTotalCurrent += entries[j].amount;

                        }

                    }

                    pastRevenueExtra = 0;

                    for (j in pastEntries) {

                        if (pastEntries[j].categoryId == categories[i]) {
                            pastRevenueExtra += pastEntries[j].amount;
                            pastTotal += pastEntries[j].amount;
                            websiteTotalPast += pastEntries[j].amount;
                        }

                    }

                    additionalRevenue.current = additionalRevenue.current.toFixed(2);

                    additionalRevenue.variation = (additionalRevenue.current - pastRevenueExtra).toFixed(2);
                    additionalRevenue.variation_percent = (additionalRevenue.variation / pastRevenueExtra * 100).toFixed(2);

                    additionalRevenues.push(additionalRevenue);

                }

                websiteData.additionalRevenue = additionalRevenues;

            }

            if (websiteData.amazonEarnings || websiteData.earnings || websiteData.additionalRevenue) {

                // Calculate total
                websiteData.total = {
                    current: websiteTotalCurrent.toFixed(2),
                    variation: (websiteTotalCurrent - websiteTotalPast).toFixed(2),
                    variation_percent: ((websiteTotalCurrent - websiteTotalPast) / websiteTotalPast * 100).toFixed(2)
                }

                reportWebsites.push(websiteData);
            }

        }

        report.websites = reportWebsites;

        // Total
        total = {
            current: currentTotal.toFixed(2),
            variation: (currentTotal - pastTotal).toFixed(2),
            variation_percent: ((currentTotal - pastTotal) / pastTotal * 100).toFixed(2)
        }

        report.revenue = total;

        // Expenses
        var user = Meteor.users.findOne(websites[0].userId);

        // FB ads
        var currentExpenses = Meteor.call('calculateAdsCosts', {
            user: user,
            from: pastDate,
            to: currentDate
        });

        currentExpenses = parseFloat(currentExpenses);

        var pastExpenses = Meteor.call('calculateAdsCosts', {
            user: user,
            from: pastPastDate,
            to: pastDate
        });

        pastExpenses = parseFloat(pastExpenses);

        var facebookExpenses = {
            name: 'Facebook Ads',
            current: currentExpenses,
            variation: (currentExpenses - pastExpenses).toFixed(2),
            variation_percent: ((currentExpenses - pastExpenses) / pastExpenses * 100).toFixed(2)
        }

        allExpenses = [];
        allExpenses.push(facebookExpenses);

        // Check for additional expenses
        if (Entries.find({ type: 'expense', date: { $lte: currentDate, $gte: pastDate } }).count() > 0) {

            var entries = Entries.find({ type: 'expense', date: { $lte: currentDate, $gte: pastDate } }).fetch();
            var pastEntries = Entries.find({ type: 'expense', date: { $lte: pastDate, $gte: pastPastDate } }).fetch();

            // Get categories
            var categories = [];
            for (i in entries) {
                if (categories.indexOf(entries[i].categoryId)) {
                    categories.push(entries[i].categoryId);
                }
            }

            for (i in categories) {

                additionalExpense = {
                    name: Categories.findOne(categories[i]).name,
                    current: 0
                }

                for (j in entries) {

                    if (entries[j].categoryId == categories[i]) {
                        additionalExpense.current += parseFloat(entries[j].amount);
                        currentExpenses += parseFloat(entries[j].amount);
                    }

                }

                pastExpenseExtra = 0;

                for (j in pastEntries) {

                    if (pastEntries[j].categoryId == categories[i]) {
                        pastExpenseExtra += parseFloat(pastEntries[j].amount);
                        pastExpenses += parseFloat(pastEntries[j].amount);
                    }

                }

                additionalExpense.current = additionalExpense.current.toFixed(2);

                additionalExpense.variation = (additionalExpense.current - pastExpenseExtra).toFixed(2);
                additionalExpense.variation_percent = (additionalExpense.variation / pastExpenseExtra * 100).toFixed(2);

                allExpenses.push(additionalExpense);

            }

        }

        var expenses = {
            current: currentExpenses.toFixed(2),
            variation: (currentExpenses - pastExpenses).toFixed(2),
            variation_percent: ((currentExpenses - pastExpenses) / pastExpenses * 100).toFixed(2)
        }

        report.expenses = { detail: allExpenses, total: expenses };

        // Profit
        var profits = {
            current: (currentTotal - currentExpenses).toFixed(2),
            variation: ((currentTotal - currentExpenses) - (pastTotal - pastExpenses)).toFixed(2),
            variation_percent: (((currentTotal - currentExpenses) - (pastTotal - pastExpenses)) / (pastTotal - pastExpenses) * 100).toFixed(2)
        }

        report.profits = profits;

        return report;

    },
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

            console.log('Calculating earnings ...');
            Meteor.call('calculateHistoricalEarnings', users[u]);

            console.log('Get sessions ...');
            Meteor.call('calculateHistoricalSessions', users[u]);

            //     // Go through all dashboards
            //     dashboards = Dashboards.find({ userId: users[u]._id }).fetch();

            //     for (d in dashboards) {
            //         Dashboards.update(dashboards[d]._id, { $set: { lastUpdated: new Date() } });
            //     }

            //     // Go through websites
            //     websites = Websites.find({ userId: users[u]._id }).fetch();
            //     for (w = 0; w < websites.length; w++) {

            //         // Update visitors
            //         console.log('Updating visitors for website: ' + websites[w].name);
            //         var visitors = Meteor.call('getLast30DaysVisitors', websites[w], users[u]);
            //         Websites.update(websites[w]._id, { $set: { visitors: visitors } });

            //         // Refresh website
            //         website = Websites.findOne(websites[w]._id);

            //         // Amazon conversion
            //         console.log('Updating Amazon conversions for website: ' + website.name);
            //         var amazon = Meteor.call('getAmazonConversions', website, users[u]);
            //         Websites.update(websites[w]._id, { $set: { amazon: amazon } });

            //         // Update subscribers
            //         if (websites[w].list) {

            //             console.log('Updating subscribers for website: ' + websites[w].name);

            //             // All subscribers  
            //             var subscribers = Meteor.call('getLast30DaysSubscribers', websites[w]);
            //             Websites.update(websites[w]._id, { $set: { subscribers: subscribers } });

            //             // Subscribers coming from ads only
            //             var adSubscribers = Meteor.call('getAdsSubscribers', websites[w]);
            //             Websites.update(websites[w]._id, { $set: { adSubscribers: adSubscribers } });

            //             // Calculate ads/total subsribers 
            //             var adsTotal = {
            //                 current: adSubscribers.current / subscribers.current * 100,
            //                 past: adSubscribers.past / subscribers.past * 100,
            //                 variation: Meteor.call('calculateVariation', adSubscribers.current / subscribers.current, adSubscribers.past / subscribers.past)
            //             }
            //             Websites.update(websites[w]._id, { $set: { adsTotal: adsTotal } });

            //         }

            //         // Update earnings & products
            //         if (websites[w].salesIntegrationId) {

            //             console.log('Updating earnings/products for website: ' + websites[w].name);

            //             // Refresh website
            //             website = Websites.findOne(websites[w]._id);

            //             // Sales & Earnings website
            //             var sales = Meteor.call('getLast30DaysSales', website);
            //             var earnings = Meteor.call('getLast30DaysEarnings', website);
            //             Websites.update(website._id, { $set: { sales: sales, earnings: earnings } });

            //             // Sales by country
            //             var countriesSales = Meteor.call('getSalesCountry', website.salesIntegrationId, {});
            //             console.log(countriesSales);
            //             Websites.update(website._id, { $set: { countriesSales: countriesSales} });

            //             // Products
            //             Meteor.call('refreshAllProducts', website, users[u]);

            //             // Refresh website
            //             website = Websites.findOne(websites[w]._id);

            //             // Websites pages visits
            //             var checkout = Meteor.call('getWebsiteCheckoutVisits', website, users[u]);
            //             Websites.update(website._id, { $set: { checkout: checkout } });

            //             var salesPageSessions = Meteor.call('getWebsiteSalesVisits', website, users[u]);
            //             Websites.update(website._id, { $set: { salesPageSessions: salesPageSessions } });

            //         }

            //         // Refresh website
            //         website = Websites.findOne(websites[w]._id);

            //         // Conversions
            //         Meteor.call('calculateWebsiteConversions', website, users[u]);
            //         console.log('Done updating: ' + websites[w].name);

            //     }

            //     console.log('Done updating all websites');

            //     // Amazon
            //     // var amazonData = Meteor.call('getAmazonAffiliateData', users[u]);
            //     // var dashboard = Dashboards.findOne({});
            //     // Dashboards.update(dashboard._id, { $set: { amazonEarnings: amazonData.earnings } });

            //     // Calculate costs, profits and margins
            //     if (users[u].facebookAdsId) {

            //         // Calculate earnings
            //         console.log('Calculating earnings ...');
            //         Meteor.call('calculateEarnings', users[u]);

            //         // Calculate costs
            //         console.log('Calculating costs ...');
            //         Meteor.call('calculateCosts', users[u]);

            //         // Calculate profits
            //         console.log('Calculating profits ...');
            //         Meteor.call('calculateProfits', users[u]);

            //         // Calculate margins
            //         console.log('Calculating margins ...');
            //         Meteor.call('calculateMargins', users[u]);
            //     }

        }

    }

});
