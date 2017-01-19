Template.stream.helpers({

  notifications: function() {
    return Notifications.find({}, {sort: {timestamp: -1}, limit: 50});
  }

});
