Template.stream.helpers({

    notifications: function() {
        return Notifications.find({}, {sort: {timestamp: -1}, limit: 50});
    }

});

// Template.stream.onRendered(function() {

//     Tracker.autorun(function() {
//         Session.set('notifications', Notifications.find({}));
//     });

// });
