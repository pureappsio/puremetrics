import FacebookAPI from 'fbgraph';
Future = Npm.require('fibers/future');

Meteor.methods({

    createDashboard: function(dashboard) {

        console.log(dashboard);

        Dashboards.insert(dashboard);

    },
    checkTheme: function() {

        if (Meteor.users.findOne({ theme: { $exists: true } })) {
            return Meteor.users.findOne({ theme: { $exists: true } }).theme;
        } else {
            return 'light';
        }

    },

    setTheme: function(theme) {

        console.log(theme);
        Meteor.users.update(Meteor.user()._id, { $set: { theme: theme } });
    },

    calculateEarnings: function(user) {

        // Get all sites
        websites = Websites.find({ userId: user._id }).fetch();
        var totalEarnings = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].earnings) {
                totalEarnings += websites[i].earnings.current;
            }
        }

        // Get global amazon earnings
        var dashboard = Dashboards.findOne({});
        if (dashboard.amazonEarnings) {
            totalEarnings += dashboard.amazonEarnings;
        }

        // Build value
        var value = {
            current: totalEarnings,
            past: 0,
            variation: 0
        }

        // Update
        Meteor.users.update(user._id, { $set: { earnings: value } });


    },
    calculateHistoricalSessions: function(user) {

        // Get sessions from all sites
        var integrations = Integrations.find({ type: 'purepress' }).fetch();
        var period = Meteor.call('getPeriod', user);

        // Get all sessions
        var sessions = {};
        for (i in integrations) {
            var siteSessions = Meteor.call('getSessions', integrations[i]._id, {
                from: Meteor.call('getStandardDate', period.current.from),
                to: Meteor.call('getStandardDate', period.current.to),
                type: 'visit'
            });
            sessions[integrations[i].url] = siteSessions;
        }

        // Graph data
        var graphData = {};
        var days = [];

        // Build days
        for (i = 0; i < 30; i++) {

            // Get day
            var now = new Date();
            var salesDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * i);
            var dayDate = new Date(salesDate.getFullYear() + '-' + (salesDate.getMonth()) + '-' + salesDate.getDate());
            days.push(dayDate.getTime());

        }

        for (j in integrations) {

            // Get site name
            var siteName = Meteor.call('getMeta', 'brandName', integrations[j]._id);
            console.log(siteName);

            // Data
            var siteGraphData = [];
            var siteSessions = sessions[integrations[j].url];

            for (i in days) {

                var dataPoint = {
                    x: new Date(days[i]),
                    y: 0
                }

                // Go through sessions
                for (s in siteSessions) {

                    sessionDate = new Date(siteSessions[s].date);
                    var dayDate = new Date(sessionDate.getFullYear() + '-' + (sessionDate.getMonth() + 1) + '-' + sessionDate.getDate());

                    if (dayDate.getTime() == days[i]) {
                        dataPoint.y += 1;
                    }

                }

                siteGraphData.push(dataPoint);

            }

            graphData[siteName] = siteGraphData;

        }

        console.log(graphData);

        // Update
        var dashboard = Dashboards.findOne({});
        Dashboards.update(dashboard._id, { $set: { sessionsHistory: graphData } });


    },
    calculateHistoricalEarnings: function(user) {

        // Get sales from all carts
        var integrations = Integrations.find({ type: 'purecart' }).fetch();
        var period = Meteor.call('getPeriod', user);

        var sales = [];
        for (i in integrations) {
            var checkoutSales = Meteor.call('getSales', integrations[i]._id, {
                from: Meteor.call('getStandardDate', period.current.from),
                to: Meteor.call('getStandardDate', period.current.to)
            });
            sales = sales.concat(checkoutSales);
        }

        var graphData = [];
        var days = [];

        for (i = 0; i < 31; i++) {

            // Get day
            var now = new Date();
            var salesDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * i);
            var dayDate = new Date(salesDate.getFullYear() + '-' + (salesDate.getMonth()) + '-' + salesDate.getDate());
            days.push(dayDate.getTime());

        }

        for (i in days) {

            var dataPoint = {
                x: new Date(days[i]),
                y: 0
            }

            // Go through all sales
            for (s in sales) {

                // if (sales[s].currency == 'EUR') {
                saleAmount = parseFloat(sales[s].amount);
                // } else {
                //     saleAmount = parseFloat(sales[s].amount) / rates[sales[s].currency];
                // }

                salesDate = new Date(sales[s].date);
                var dayDate = new Date(salesDate.getFullYear() + '-' + (salesDate.getMonth() + 1) + '-' + salesDate.getDate());

                // console.log(dayDate.getTime());
                // console.log(days[i]);

                if (dayDate.getTime() == days[i]) {
                    dataPoint.y += saleAmount;
                }

            }

            dataPoint.y = (dataPoint.y).toFixed(2);
            graphData.push(dataPoint);

        }

        // Get amazon earnings from all sites
        // var sitesIntegrations = Integrations.find({ type: 'purepress' }).fetch();
        // for (i in sitesIntegrations) {

        //     var integration = sitesIntegrations[i];
        //     var earnings = Meteor.call('getAmazonEarnings', integration);

        //     for (j in earnings) {
        //         for (g in graphData) {
        //             if (new Date(earnings[j].x).getDate() == new Date(graphData[g].x).getDate()) {
        //                 graphData[g].y = (parseFloat(graphData[g].y) + parseFloat(earnings[j].y)).toFixed(2);
        //             }
        //         }
        //     }

        // }

        // Update
        var dashboard = Dashboards.findOne({});
        Dashboards.update(dashboard._id, { $set: { salesHistory: graphData } });


    },
    loadSalesGraphData: function() {

        var dashboard = Dashboards.findOne({});
        graphData = dashboard.salesHistory;

        var datasets = [{
            label: "Sales (€)",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "red",
            borderColor: "red",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "red",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "red",
            pointHoverBorderColor: "red",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: graphData,
            spanGaps: false,
        }]

        // Goal?
        if (Metas.findOne({ type: 'salesGoal' })) {

            // Goal
            var goal = Metas.findOne({ type: 'salesGoal' }).value;

            // Data for goal
            var goalData = [];

            for (i in graphData) {
                goalData.push({
                    x: graphData[i].x,
                    y: parseInt(goal / 30.5)
                });
            }

            datasets.push({
                label: "Goal (€)",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "red",
                borderColor: "red",
                borderCapStyle: 'butt',
                borderDash: [10, 10],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "red",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "red",
                pointHoverBorderColor: "red",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: goalData,
                spanGaps: false,
            });

        }

        return datasets;

    },
    loadSessionsGraphData: function() {

        var dashboard = Dashboards.findOne({});
        graphData = dashboard.sessionsHistory;
        return graphData;

    },
    calculateCosts: function(user) {

        // Find token
        var token = user.services.facebook.accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Get period
        var period = Meteor.call('getPeriod', user);

        // Date range
        from = Meteor.call('getGoogleDate', period.current.from);
        to = Meteor.call('getGoogleDate', period.current.to);

        // Parameters
        var parameters = {
            time_range: {
                "since": from,
                "until": to
            }
        };

        // Get Ads ID
        var facebookAdsId = Meteor.user().facebookAdsId;

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get('act_' + facebookAdsId + '/insights', parameters, function(err, res) {
            // returns the post id
            console.log(res);
            myFuture.return(res.data);

        });

        var data = myFuture.wait();

        // Build value
        var value = {
            current: parseInt(data[0].spend),
            past: 0,
            variation: 0
        }

        // Update
        Meteor.users.update(user._id, { $set: { costs: value } });

    },
    calculateProfits: function(user) {

        // Get costs
        costs = Meteor.users.findOne(user._id).costs;

        // Get earnings
        earnings = Meteor.users.findOne(user._id).earnings;

        // Build value
        var value = {
            current: earnings.current - costs.current,
            past: 0,
            variation: 0
        }

        // Update
        Meteor.users.update(user._id, { $set: { profits: value } });

    },
    calculateMargins: function(user) {

        // Get costs
        costs = Meteor.users.findOne(user._id).costs;

        // Get earnings
        earnings = Meteor.users.findOne(user._id).earnings;

        // Build value
        var value = {
            current: (earnings.current - costs.current) / earnings.current * 100,
            past: 0,
            variation: 0
        }

        // Update
        Meteor.users.update(user._id, { $set: { margin: value } });

    }

});
