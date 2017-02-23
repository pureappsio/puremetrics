Template.websiteDashboard.onRendered(function() {

    Meteor.call('getDateRange', function(err, dateRange) {
        console.log(dateRange);
        Session.set('dateRange', dateRange);
    });

});

Template.websiteDashboard.helpers({

    sellingCountry: function(rank) {

        if (this.countriesSales) {

            countriesSales = this.countriesSales;

           	// Sort
            countriesSales.sort(function(a, b) {
                return parseFloat(b.amount) - parseFloat(a.amount);
            });

            // Total
            total = 0;
            for (i in countriesSales) {
            	total += countriesSales[i].amount;
            }
            percent = (countriesSales[rank].amount/total * 100). toFixed(0);

            return countriesSales[rank].location + ' (' + percent + '%)';

        }

    }

});
