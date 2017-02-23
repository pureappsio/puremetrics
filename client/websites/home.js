Template.home.helpers({

    lastUpdated: function() {

        return moment(Dashboards.find({}).fetch()[0].lastUpdated).format('MMMM Do YYYY, h:mm:ss a');

    },
    websites: function() {
        return Websites.find({}, { sort: { "visitors.current": -1 } });
    },
    totalVisitors: function() {
        websites = Websites.find({}, { sort: { "visitors.current": -1 } }).fetch();
        var totalVisitors = 0;
        for (i = 0; i < websites.length; i++) {
            totalVisitors += websites[i].visitors.current;
        }
        return totalVisitors;
    },
    totalEarnings: function() {
        return Meteor.user().earnings.current.toFixed(0);
    },
    amazonEarnings: function() {
        return Dashboards.findOne({}).amazonEarnings;
    },
    totalCosts: function() {
        return Meteor.user().costs.current.toFixed(0);
    },
    totalProfits: function() {
        return Meteor.user().profits.current.toFixed(0);
    },
    totalMargin: function() {
        return Meteor.user().margin.current.toFixed(0);
    },
    totalAbandon: function() {

        // Get websites
        websites = Websites.find({}).fetch();

        var totalCheckout = 0;
        var totalSales = 0;

        for (i = 0; i < websites.length; i++) {
            if (websites[i].checkout) {
                totalSales += websites[i].sales.current;
                totalCheckout += websites[i].checkout.current;
            }
        }

        var totalAbandon = (1 - totalSales / totalCheckout) * 100;

        return totalAbandon;
    },
    totalVisitorsToList: function() {
        websites = Websites.find({}).fetch();

        var totalVisitors = 0;
        var totalList = 0;

        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalVisitors += websites[i].visitors.current;
                totalList += websites[i].subscribers.current;
            }
        }

        var totalVisitorsToList = totalList / totalVisitors * 100;

        return totalVisitorsToList;
    },
    totalSubscribers: function() {
        websites = Websites.find({}).fetch();
        var totalSubscribers = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalSubscribers += websites[i].subscribers.total;
            }
        }
        return totalSubscribers;
    },
    totalNewSubscribers: function() {
        websites = Websites.find({}).fetch();
        var totalSubscribers = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalSubscribers += websites[i].subscribers.current;
            }
        }
        return totalSubscribers;
    },
    percentAds: function() {
        websites = Websites.find({}).fetch();
        var totalAdsSubscribers = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].adSubscribers) {
                totalAdsSubscribers += websites[i].adSubscribers.current;
            }
        }
        var totalSubscribers = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalSubscribers += websites[i].subscribers.current;
            }
        }
        return totalAdsSubscribers / totalSubscribers * 100;
    },
    totalNewSubscribersVariation: function() {
        websites = Websites.find({}).fetch();
        var totalSubscribers = 0;
        var pastSubscribers = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalSubscribers += websites[i].subscribers.current;
                pastSubscribers += websites[i].subscribers.past;
            }
        }
        return (totalSubscribers - pastSubscribers) / pastSubscribers * 100;
    },
    totalVisitorsVariation: function() {
        websites = Websites.find({}).fetch();
        var totalVisitors = 0;
        var pastVisitors = 0;
        for (i = 0; i < websites.length; i++) {
            totalVisitors += websites[i].visitors.current;
            pastVisitors += websites[i].visitors.past;
        }
        return (totalVisitors - pastVisitors) / pastVisitors * 100;
    },
    totalEarningsVariation: function() {
        websites = Websites.find({}).fetch();
        var totalEarnings = 0;
        var pastEarnings = 0;
        for (i = 0; i < websites.length; i++) {
            if (websites[i].earnings) {
                totalEarnings += websites[i].visitors.current;
                pastEarnings += websites[i].visitors.past;
            }
        }
        return (totalEarnings - pastEarnings) / pastEarnings * 100;
    },
    totalVisitorsToListVariation: function() {

        websites = Websites.find({}).fetch();

        var totalList = 0;
        var pastList = 0;

        var totalVisitors = 0;
        var pastVisitors = 0;

        for (i = 0; i < websites.length; i++) {
            if (websites[i].subscribers) {
                totalVisitors += websites[i].visitors.current;
                pastVisitors += websites[i].visitors.past;

                totalList += websites[i].subscribers.current;
                pastList += websites[i].subscribers.past;
            }
        }

        var currentRatio = totalList / totalVisitors;
        var pastRatio = pastList / pastVisitors;

        return (currentRatio - pastRatio) / pastRatio * 100;

    }
    // totalAbandonVariation: function() {
    //     websites = Websites.find({}).fetch();

    //     var totalCheckout = 0;
    //     var pastCheckout = 0;

    //     var totalSales = 0;
    //     var pastSales = 0;

    //     for (i = 0; i < websites.length; i++) {
    //         if (websites[i].checkout) {
    //             totalSales += websites[i].sales.current;
    //             pastSales += websites[i].sales.past;

    //             totalCheckout += websites[i].checkout.current;
    //             pastCheckout += websites[i].checkout.past;
    //         }
    //     }

    //     if (totalCheckout == 0) {
    //         totalAbandon = 0;
    //     } else {
    //         totalAbandon = (1 - totalSales / totalCheckout) * 100;
    //     }

    //     if (pastCheckout == 0) {
    //         pastAbandon = 0;
    //     } else {
    //         pastAbandon = (1 - pastSales / pastCheckout) * 100;
    //     }

    //     if (pastAbandon == 0) {
    //         return 0;
    //     } else {
    //         return (totalAbandon - pastAbandon) / pastAbandon * 100;
    //     }

    // }
});
