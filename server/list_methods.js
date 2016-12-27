Meteor.methods({

    getEmailLists: function(integrationId) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = "http://" + integration.url + "/api/lists?key=" + integration.key;
        var answer = HTTP.get(baseUrl);
        return answer.data.lists;

    },
    getSequences: function(integrationId, integrationParameterId) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = "http://" + integration.url + "/api/sequences?key=" + integration.key;
        var answer = HTTP.get(baseUrl + "&list=" + integrationParameterId);
        return answer.data.sequences;

    },
    getSequenceStats: function(integrationId, sequenceId, startDate, toDate, origin) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = "http://" + integration.url + "/api/sequences/stats?key=" + integration.key;
        var answer = HTTP.get(baseUrl + "&origin=" + origin + "&sequence=" + sequenceId + "&from=" + startDate + "&to=" + toDate);
        return answer.data;

    },
    getListSubscribers: function(integration, query) {

        var baseUrl = "https://" + integration.url + "/api/subscribers?list=" + query.listId + "&key=" + integration.key;
        baseUrl +=  "&from=" + query.startDate + "&to=" + query.toDate;
        
        if (query.origin) {
        	baseUrl += '&origin=' + query.origin;
        }
        // console.log(baseUrl);

        var answer = HTTP.get(baseUrl);

        return answer.data.subscribers.length;

    },
    getAdsSubscribers: function(website) {

        // Get period
        var user = Meteor.users.findOne(website.userId);
        var period = Meteor.call('getPeriod', user);

        // Get integration
        var integration = Integrations.findOne(website.list.integrationId);

        // Past 30 days
        var answer = Meteor.call('getListSubscribers',
            integration, {
                listId: website.list.parameter,
                startDate: getDate(period.current.from),
                toDate: getDate(period.current.to),
                origin: 'landing'
            }
        );
        subscribers.current = answer;

        // Before
        var answer = Meteor.call('getListSubscribers',
            integration, {
                listId: website.list.parameter,
                startDate: getDate(period.current.from),
                toDate: getDate(period.current.to),
                origin: 'landing'
            }
        );
        subscribers.past = answer;

        // Variation
        subscribers.variation = (subscribers.current - subscribers.past) / subscribers.current * 100;

        return subscribers;

    },
    getLast30DaysSubscribers: function(website) {

        // Get period
        var user = Meteor.users.findOne(website.userId);
        var period = Meteor.call('getPeriod', user);

        // Get integration
        var integration = Integrations.findOne(website.list.integrationId);

        // All subscribers
        var baseUrl = "https://" + integration.url + "/api/subscribers?list=" + website.list.parameter + "?key=" + integration.key;
        var answer = HTTP.get(baseUrl);
        subscribers = {
            total: answer.data.subscribers.length
        }

        // Past 30 days
        var answer = Meteor.call('getListSubscribers',
            integration, {
                listId: website.list.parameter,
                startDate: getDate(period.current.from),
                toDate: getDate(period.current.to)
            }
        );
        subscribers.current = answer;

        // Before
        var answer = Meteor.call('getListSubscribers',
            integration, {
                listId: website.list.parameter,
                startDate: getDate(period.current.from),
                toDate: getDate(period.current.to)
            }
        );
        subscribers.past = answer;

        // Variation
        subscribers.variation = (subscribers.current - subscribers.past) / subscribers.current * 100;

        return subscribers;

    }

});

function getDate(offset) {

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

}
