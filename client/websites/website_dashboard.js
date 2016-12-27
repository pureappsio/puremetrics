Template.websiteDashboard.onRendered(function() {

	Meteor.call('getDateRange', function(err, dateRange) {
	  console.log(dateRange);
	  Session.set('dateRange', dateRange);
	});

});