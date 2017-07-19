Meteor.methods({

    computePeriod: function(dateRange) {

        if (dateRange == 'today') {
            var period = {
                current: { from: 0, to: 0, amazonDate: 'today' },
                past: { from: 1, to: 1 }
            }
        } else if (dateRange == 'yesterday') {
            var period = {
                current: { from: 1, to: 1, amazonDate: 'yesterday' },
                past: { from: 2, to: 2 }
            }
        } else if (dateRange == '7-days') {
            var period = {
                current: { from: 8, to: 1, amazonDate: '7days' },
                past: { from: 15, to: 8 }
            }
        } else if (dateRange == '3-days') {
            var period = {
                current: { from: 4, to: 1, amazonDate: '3days' },
                past: { from: 8, to: 4 }
            }
        } else if (dateRange == '30-days') {
            var period = {
                current: { from: 31, to: 1, amazonDate: '30days' },
                past: { from: 61, to: 31 }
            }
        } else {
            var period = {
                current: { from: 31, to: 1, amazonDate: '30days' },
                past: { from: 61, to: 31 }
            }
        }

        return period;

    },

    getPeriod: function(user) {

        // Get date range
        var dateRange = Metas.findOne({ type: 'dateRange' }).value;

        var period = Meteor.call('computePeriod', dateRange);

        return period;

    },
    getPeriodFunnel: function(user) {

        // Get date range
        var dateRange = Metas.findOne({ type: 'funnelDateRange' }).value;

        var period = Meteor.call('computePeriod', dateRange);

        return period;

    },
    getGoogleDate: function(offset) {

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

    },
    getStandardDate: function(offset) {

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
        date = current_month + '-' + current_day + '-' + current_year;

        return date;

    },
    standardizedDate: function(date) {

        current_month = date.getMonth() + 1;
        current_year = date.getFullYear();
        current_day = date.getDate();

        current_month = current_month.toString();
        current_day = current_day.toString();

        if (current_month.length < 2) current_month = '0' + current_month;
        if (current_day.length < 2) { current_day = '0' + current_day };

        // Build date objects
        date = current_month + '-' + current_day + '-' + current_year;

        return date;

    },
    googleDate: function(date) {

        current_month = date.getMonth() + 1;
        current_year = date.getFullYear();
        current_day = date.getDate();

        current_month = current_month.toString();
        current_day = current_day.toString();

        if (current_month.length < 2) current_month = '0' + current_month;
        if (current_day.length < 2) { current_day = '0' + current_day };

        // Build date objects
        date = current_year + '-' + current_month + '-' + current_day;

        return date;

    }

});
