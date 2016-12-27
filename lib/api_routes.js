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
