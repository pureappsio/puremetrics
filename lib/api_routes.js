Router.route('/api/notifications', { where: 'server' }).post(function() {

    // Get data
    var data = this.request.body;
    var key = this.params.query.key;

    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', key)) {

        if (data.message && data.type) {
            var user = Meteor.users.findOne({ apiKey: key });

            // Build notification
            var notification = {
                message: data.message,
                timestamp: new Date(),
                userId: user._id,
                type: data.type
            }

            // Additional data ?
            if (data.origin) {
                notification.origin = data.origin;
            }

            // Save
            Notifications.insert(notification);
            console.log('New notification: ');
            console.log(notification);

            this.response.end(JSON.stringify({ message: "Notification added" }));
        } else {
            this.response.end(JSON.stringify({ message: "Invalid data" }));
        }


    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

Router.route('/api/report', { where: 'server' }).get(function() {

    // Get data
    var key = this.params.query.key;
    this.response.setHeader('Content-Type', 'application/json');

    if (Meteor.call('validateApiKey', key)) {

        var answer = Meteor.call('buildMonthlyReport', this.params.query);

        this.response.end(JSON.stringify(answer));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }


});

Router.route('/api/average', { where: 'server' }).get(function() {

    // Get data
    var key = this.params.query.key;
    this.response.setHeader('Content-Type', 'application/json');

    if (Meteor.call('validateApiKey', key)) {

        var answer = Meteor.call('buildAverageReport');

        this.response.end(JSON.stringify(answer));
    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }


});

Router.route('/api/status', { where: 'server' }).get(function() {

    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify({ message: 'System online' }));

});
