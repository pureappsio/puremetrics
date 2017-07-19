Meteor.methods({

    getServices: function(integrationId) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = "http://" + integration.url + "/api/services?key=" + integration.key;
        baseUrl += '&type=facebookPage';
        var answer = HTTP.get(baseUrl);
        return answer.data.services;

    },
    getMessengerSubscribers: function(integrationId, serviceId, from, to) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = "http://" + integration.url + "/api/subscribers?key=" + integration.key;
        baseUrl += '&service=' + serviceId + '&from=' + from + '&to=' + to;
        var answer = HTTP.get(baseUrl);
        return answer.data.subscribers;

    }

});
