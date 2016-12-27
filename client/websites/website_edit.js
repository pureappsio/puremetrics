Template.websiteEdit.events({

  'click #edit-website': function() {

    website = {
      name: $("#name").val(),
      url: $("#url").val(),
      list: {
        integrationId: $('#list-integration :selected').val(),
        parameter: $('#list-parameter :selected').val()
      },
      userId: Meteor.user()._id,
      salesIntegrationId: $('#list-integration-sales :selected').val(),
      _id: this._id
    };
    Meteor.call('editWebsite', website);
  },
  'click #add-product': function() {

    product = {
      name: $('#product-id :selected').text(),
      integrationId: $('#product-integration :selected').val(),
      integrationProductId: $('#product-id :selected').val(),
      salesPage: $('#product-sales-page').val(),
      userId: Meteor.user()._id,
      websiteId: this._id
    };
    Meteor.call('addProduct', product);
  },
  'change #list-integration, click #list-integration': function() {

    // Load lists
    Meteor.call('getEmailLists', $('#list-integration :selected').val(), function(err, data) {

      for (i = 0; i < data.length; i++) {
        $('#list-parameter').append($('<option>', {
          value: data[i]._id,
          text: data[i].name
        }));
      }

    });
  
  },
  'change #product-integration, click #product-integration': function() {

    // Load products
    Meteor.call('getProducts', $('#product-integration :selected').val(), function(err, data) {

      for (i = 0; i < data.length; i++) {
        $('#product-id').append($('<option>', {
          value: data[i]._id,
          text: data[i].name
        }));
      }

    });
  
  }

});

Template.websiteEdit.onRendered(function() {

  // Load emails integrations
  var listIntegrations = Integrations.find({type: 'puremail'}).fetch();
  for (i = 0; i < listIntegrations.length; i++) {
    $('#list-integration').append($('<option>', {
      value: listIntegrations[i]._id,
      text: 'PureMail (' + listIntegrations[i].url + ')'
    }));
  }

  // Load sales integrations
  var listIntegrations = Integrations.find({type: 'purecart'}).fetch();
  for (i = 0; i < listIntegrations.length; i++) {
    $('#list-integration-sales').append($('<option>', {
      value: listIntegrations[i]._id,
      text: 'PureCart (' + listIntegrations[i].url + ')'
    }));
  }

  // Load products integrations
  var productsIntegrations = Integrations.find({type: 'purecart'}).fetch();
  for (i = 0; i < productsIntegrations.length; i++) {
    $('#product-integration').append($('<option>', {
      value: listIntegrations[i]._id,
      text: 'PureCart (' + listIntegrations[i].url + ')'
    }));
  }

});