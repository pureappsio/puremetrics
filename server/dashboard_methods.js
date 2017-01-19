import FacebookAPI from 'fbgraph';
Future = Npm.require('fibers/future');

Meteor.methods({

	createDashboard: function(dashboard) {

		console.log(dashboard);

		Dashboards.insert(dashboard);

	},
	checkTheme: function() {

		if (Meteor.users.findOne({theme: {$exists: true}})) {
			return Meteor.users.findOne({theme: {$exists: true}}).theme;
		}
		else {
			return 'light';
		}

	},

	setTheme: function(theme) {

		console.log(theme);
		Meteor.users.update(Meteor.user()._id, {$set: {theme: theme}});
	},

	calculateEarnings: function(user) {

		// Get all sites
		websites = Websites.find({userId: user._id}).fetch();
	    var totalEarnings = 0;
	    for (i = 0; i < websites.length; i++) {
	      if (websites[i].earnings) {
	        totalEarnings += websites[i].earnings.current;
	      } 
	    } 

	    // Build value
	    var value = {
	    	current: totalEarnings,
	    	past: 0,
	    	variation: 0
	    }

	    // Update
	    Meteor.users.update(user._id, {$set: {earnings: value}});


	},
	calculateCosts: function(user) {

		// Find token
	    var token = user.services.facebook.accessToken;

	    // Set token
	    FacebookAPI.setAccessToken(token);

	    // Set version
	    FacebookAPI.setVersion("2.8");

	    // Get period
    	var period = Meteor.call('getPeriod', user);

	    // Date range
	    from = Meteor.call('getGoogleDate', period.current.from);
        to = Meteor.call('getGoogleDate', period.current.to);

	    // Parameters
	     var parameters = {
    		time_range: {
	    		"since": from,
	    		"until": to
	    	}
	    };

	    // Get Ads ID
	    var facebookAdsId = Meteor.user().facebookAdsId;

	    // Get insights
	    var myFuture = new Future();
	    FacebookAPI.get('act_' + facebookAdsId + '/insights', parameters, function(err, res) {
	      // returns the post id
	       console.log(res);
	       myFuture.return(res.data);
	       
	    });

	    var data = myFuture.wait();

	    // Build value
	    var value = {
	    	current: data[0].spend,
	    	past: 0,
	    	variation: 0
	    }

	    // Update
	    Meteor.users.update(user._id, {$set: {costs: value}});

	},
	calculateProfits: function(user) {

		// Get costs
		costs = Meteor.users.findOne(user._id).costs;

		// Get earnings
		earnings = Meteor.users.findOne(user._id).earnings;

		// Build value
	    var value = {
	    	current: earnings.current - costs.current,
	    	past: 0,
	    	variation: 0
	    }

	    // Update
	    Meteor.users.update(user._id, {$set: {profits: value}});

	},
	calculateMargins: function(user) {

		// Get costs
		costs = Meteor.users.findOne(user._id).costs;

		// Get earnings
		earnings = Meteor.users.findOne(user._id).earnings;

		// Build value
	    var value = {
	    	current: (earnings.current - costs.current)/earnings.current*100,
	    	past: 0,
	    	variation: 0
	    }

	    // Update
	    Meteor.users.update(user._id, {$set: {margin: value}});

	}

});