Template.settings.events({

    'click #scrap-test': function() {

        Meteor.call('calculateHistoricalEarnings', Meteor.user()._id);

    },
    'click #generate-key': function() {

        Meteor.call('generateApiKey');

    },

    'click #set-theme': function() {

        Meteor.call('setTheme', $('#theme :selected').val());

    },

    'click #link-google': function() {

        console.log(Meteor.user());

        // Options
        options = {
            requestPermissions: ['https://www.googleapis.com/auth/analytics.readonly'],
            requestOfflineToken: true,
            forceApprovalPrompt: true
        }

        Google.requestCredential(options, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddGoogleOauthCredentials", token, secret, function(err, response) {
                console.log('Token saved');
            });
        });

    },

    'click #link-facebook': function() {

        Facebook.requestCredential({ requestPermissions: ['ads_read'] }, function(token) {

            var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

            Meteor.call("userAddFacebookOauthCredentials", token, secret, function(err, response) {
                console.log('Facebook token saved');
            });
        });
    },

    'click #facebook-test': function() {

        Meteor.call('facebookAdsTest');

    },

    'click #refresh': function() {

        Meteor.call('refreshAll');

    },

    'click #set-ads-id': function() {

        Meteor.call('setFacebookAdsId', $('#ads-id').val());

    },
    'click #set-date-range': function() {

        Meteor.call('setDateRange', $('#date-range :selected').val());

    },

    'click #set-funnel-date-range': function() {

        var meta = {
            value: $('#funnels-date-range :selected').val(),
            type: 'funnelDateRange',
            userId: Meteor.user()._id
        }

        Meteor.call('insertMeta', meta);

    },

    'click #add-goal': function() {

        var meta = {
            value: parseFloat($('#goal-amount').val()),
            type: 'salesGoal',
            userId: Meteor.user()._id
        }

        Meteor.call('insertMeta', meta);

    },


    'click #users': function() {

        Meteor.call('printUsers');

    },

    'click #reset': function() {

        Meteor.call('reset');

    },

    'click #add-integration': function() {

        var accountData = {
            type: $('#integration-type :selected').val(),
            key: $('#integration-key').val(),
            url: $('#integration-url').val(),
            userId: Meteor.user()._id
        };
        Meteor.call('addIntegration', accountData);

    },
    'click #refresh-products': function() {

        Meteor.call('refreshAllProducts');

    }

});


Template.settings.helpers({

    key: function() {
        return Meteor.user().apiKey;
    },

    integrations: function() {
        return Integrations.find({});
    },
    adsId: function() {
        return Meteor.user().facebookAdsId;
    }

});
