import FacebookAPI from 'fbgraph';
Future = Npm.require('fibers/future');

Meteor.methods({

    setFacebookAdsId: function(adsId) {

        Meteor.users.update(Meteor.user()._id, { $set: { facebookAdsId: adsId } });

    },
    userAddFacebookOauthCredentials: function(token, secret) {

        var data = Facebook.retrieveCredential(token, secret).serviceData;
        console.log(data);

        Meteor.users.update({ _id: Meteor.user()._id }, { $set: { "services.facebook": data } }, function(error) {
            if (error) { console.log(error); }
        });
    },
    getFacebookCampaignInsights: function(campaignId, from, to) {

        // Find token
        var token = Meteor.user().services.facebook.accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Parameters
        var parameters = {
            time_range: {
                "since": from,
                "until": to
            }
        };

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get(campaignId + "/insights", parameters, function(err, res) {

            if (err) {
                console.log(err);
                myFuture.return({});
            } else {
                console.log(res.data);
                myFuture.return(res.data);
            }

        });

        return myFuture.wait();

    },
    getFacebookCampaigns: function() {

        // Find token
        var token = Meteor.user().services.facebook.accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Parameters
        var parameters = { fields: "name" }

        // Get Ads ID
        var facebookAdsId = Meteor.user().facebookAdsId;

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get('act_' + facebookAdsId + '/campaigns', function(err, res) {

            if (err) {
                console.log('Campaigns error: ');
                console.log(err);
                myFuture.return([]);
            } else {
                // console.log(res);
                myFuture.return(res.data);
            }

        });

        var campaignIds = myFuture.wait();

        var campaigns = [];

        var batchRequest = [];

        for (i = 0; i < campaignIds.length; i++) {

            batchRequest.push({
                method: "GET",
                relative_url: campaignIds[i].id + '?fields=name'
            });

        }

        var myFuture = new Future();

        FacebookAPI.batch(batchRequest, function(err, res) {
            if (err) {
                console.log(err);
                myFuture.return([]);
            } else {
                // console.log(res);
                myFuture.return(res);
            }

        });

        var batchResult = myFuture.wait();

        for (k = 0; k < batchResult.length; k++) {

            campaigns.push(JSON.parse(batchResult[k].body));

        }

        return campaigns;

    },
    facebookAdsTest: function() {

        // Find token
        var token = Meteor.user().services.facebook.accessToken;

        // Set token
        FacebookAPI.setAccessToken(token);

        // Set version
        FacebookAPI.setVersion("2.8");

        // Parameters
        // var parameters = { fields: "spend" }

        // Get Ads ID
        var facebookAdsId = Meteor.user().facebookAdsId;

        // Get insights
        var myFuture = new Future();
        FacebookAPI.get('act_' + facebookAdsId + '/insights', function(err, res) {
            // returns the post id
            console.log(res);
            myFuture.return(res.data);

        });

        var campaignIds = myFuture.wait();
        // console.log(campaignIds);

        // var campaigns = [];

        // for (i = 0; i < campaignIds.length; i++) {

        //  var myFuture = new Future();

        //  FacebookAPI.get(campaignIds[i].id, parameters, function(err, res) {
        //       //console.log(res);
        //       myFuture.return(res);

        //  });

        //  // Add
        //  campaigns.push(myFuture.wait());

        // }
        // console.log(campaigns);

    }


});
