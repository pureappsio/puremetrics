SyncedCron.add({
  name: 'Refresh all',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 hour');
  },
  job: function() {
    Meteor.call('refreshAll');
  }
});
