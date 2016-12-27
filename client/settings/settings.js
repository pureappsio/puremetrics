Template.settings.events({

  'click #generate-key': function () {

    Meteor.call('generateApiKey');

  },

  'click #link-google': function () {

      console.log(Meteor.user());

      Google.requestCredential({requestPermissions: Accounts.ui._options.requestPermissions["google"]}, function(token) {

        var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

        Meteor.call("userAddGoogleOauthCredentials", token, secret, function (err, response) {
          console.log('Token saved');
        });
      });

  },

  'click #link-facebook': function () {

      Facebook.requestCredential({requestPermissions: Accounts.ui._options.requestPermissions["facebook"]}, function(token) {

        var secret = Package.oauth.OAuth._retrieveCredentialSecret(token);

        Meteor.call("userAddFacebookOauthCredentials", token, secret, function (err, response) {
          console.log('Facebook token saved');
        });
      });
  },

   'click #facebook-test': function () {

      Meteor.call('facebookAdsTest');

  },

  'click #refresh': function () {

     Meteor.call('refreshAll');

  },

  'click #set-ads-id': function() {

    Meteor.call('setFacebookAdsId',  $('#ads-id').val());

  },
  'click #set-date-range': function () {

     Meteor.call('setDateRange', $('#date-range :selected').val());

  },

  'click #users': function () {

     Meteor.call('printUsers');

  },

  'click #reset': function () {

     Meteor.call('reset');

  },

  'click #add-integration': function () {

    var accountData = {
      type: $('#integration-type :selected').val(),
      key: $('#integration-key').val(),
      url: $('#integration-url').val(),
      userId: Meteor.user()._id
    };
    Meteor.call('addIntegration', accountData);

  },
  'click #refresh-products': function () {

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
