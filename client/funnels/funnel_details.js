// Charts
// var Highcharts = require('highcharts');
// require('highcharts/modules/funnel')(Highcharts);

Template.funnelDetails.onRendered(function() {

  // // Format data
  // var series = [];
  // var steps = Steps.find({funnelId: this.data._id}).fetch();
  // for (i = 0; i < steps.length; i++) {
  //   var dataPoint = [steps[i].name, steps[i].value.current];
  //   series.push(dataPoint);
  // }

  // // Plot
  // var myChart = Highcharts.chart('container', {
  //       chart: {
  //           type: 'funnel',
  //           marginRight: 100
  //       },
  //       title: {
  //           text: 'Funnel',
  //           x: -50
  //       },
  //       plotOptions: {
  //           series: {
  //               dataLabels: {
  //                   enabled: true,
  //                   format: '<b>{point.name}</b> ({point.y:,.0f})',
  //                   color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
  //                   softConnector: true
  //               },
  //               neckWidth: '30%',
  //               neckHeight: '25%'

  //               //-- Other available options
  //               // height: pixels or percent
  //               // width: pixels or percent
  //           }
  //       },
  //       legend: {
  //           enabled: false
  //       },
  //       series: [{
  //           name: 'Unique users',
  //           data: series
  //       }]
  //   });

});

Template.funnelDetails.helpers({
  website: function() {
    if (Websites.findOne(this.websiteId)) {
      return Websites.findOne(this.websiteId).name;
    }
  },
  steps: function() {
    return Steps.find({funnelId: this._id}, {sort: {number: 1}});
  },
  textMode: function() {
    // return Session.get('textMode');
    return true;
  }
});

Template.funnelDetails.events({

  'click #switch': function() {

    if (Session.get('editMode')) {

      if (Session.get('editMode') == true) { 
        Session.set('editMode', false); 
      }
      else {
        Session.set('editMode', true); 
      }

    }
    else {
      Session.set('editMode', true); 
    }

  },
  'click #graph': function() {

    if (Session.get('textMode')) {

      if (Session.get('textMode') == true) { 
        Session.set('textMode', false); 
      }
      else {
        Session.set('textMode', true); 
      }

    }
    else {
      Session.set('textMode', true); 
    }

  },
  'click #lists, change #lists': function() {

    // Get selection
    var integration = $('#integration :selected').val();
    var integrationParameter = $('#lists :selected').val();
    var selection = $('#type :selected').val();

    // Empty
    $('#option-container-3').empty();
    $('#option-container-4').empty();

    if (selection == 'subscriptions' || selection == 'clicks') {

      // Load sequences
      Meteor.call('getSequences', integration, integrationParameter, function(err, data) {

        // Get lists
        $('#option-container-3').append("<select class='form-control' id='sequences'></select>");
        for (i = 0; i < data.length; i++) {
          $('#sequences').append($('<option>', {
            value: data[i]._id,
            text: data[i].name
          }));
        }

      });

      // Get lists
      $('#option-container-4').append("<select class='form-control' id='tags'></select>");
      
      $('#tags').append($('<option>', {
        value: 'landing',
        text: 'Landing Page'
      }));

      $('#tags').append($('<option>', {
        value: 'blog',
        text: 'Blog'
      }));
 
    }

  },
  'click #integration, change #integration': function() {

    // Get selection
    var integration = $('#integration :selected').val();
    var selection = $('#type :selected').val();

    // Empty
    $('#option-container-2').empty();
    $('#option-container-3').empty();
    $('#option-container-4').empty();

    if (selection == 'subscriptions' || selection == 'clicks') {

      // Load lists
      Meteor.call('getEmailLists', integration, function(err, data) {

        // Get lists
        $('#option-container-2').append("<select class='form-control' id='lists'></select>");
        for (i = 0; i < data.length; i++) {
          $('#lists').append($('<option>', {
            value: data[i]._id,
            text: data[i].name
          }));
        }

      });
      
    }

    if (selection == 'sales') {

      // Get products      
      Meteor.call('getProducts', integration, function(err, data) {

      // Create element
      $('#option-container-2').append("<select id='products' multiple></select>");
      $('#products').selectpicker();

      // Add products
      for (i = 0; i < data.length; i++) {
        $('#products').append($('<option>', {
          value: data[i]._id,
          text: data[i].name
        }));
      }

      // Refresh picker
      $('#products').selectpicker('refresh');

    });
      
    }

  },
  'click #type, change #type': function() {

    // Get selection
    var selection = $('#type :selected').val();

    // Empty all
    $('#option-container-1').empty();
    $('#option-container-2').empty();
    $('#option-container-3').empty();
    $('#option-container-4').empty();

    // Change other parameters
    if (selection == 'ads') {

      // Add campaigns
      $('#option-container-1').append("<select class='form-control' id='campaign-id'></select>");

      Meteor.call('getFacebookCampaigns', function(err, campaigns) {

        for (i = 0; i < campaigns.length; i++) {
          $('#campaign-id').append($('<option>', {
            value: campaigns[i].id,
            text: campaigns[i].name
          }));
        }

      });

    }
    if (selection == 'visits') {

      // Add page & previous page
      $('#option-container-1').append("<input class='form-control' type='text' id='page'>");
      $('#option-container-2').append("<input class='form-control' type='text' id='previous-page'>");

    }
    if (selection == 'subscriptions' || selection == 'clicks') {

      // Add integration select
      $('#option-container-1').append("<select class='form-control' id='integration'></select>");
      var listIntegrations = Integrations.find({type: 'puremail'}).fetch();
      for (i = 0; i < listIntegrations.length; i++) {
        $('#integration').append($('<option>', {
          value: listIntegrations[i]._id,
          text: 'PureMail (' + listIntegrations[i].url + ')'
        }));
      }
      
    }
    if (selection == 'sales') {

      // Add integration select
      $('#option-container-1').append("<select class='form-control' id='integration'></select>");
      var integrations = Integrations.find({type: 'purecart'}).fetch();
      for (i = 0; i < integrations.length; i++) {
        $('#integration').append($('<option>', {
          value: integrations[i]._id,
          text: 'PureCart (' + integrations[i].url + ')'
        }));
      }
      
    }

  },
  'click #add-step': function() {

    // Get basic funnel data
    step = {
      funnelId: this._id,
      websiteId: this.websiteId,
      userId: Meteor.user()._id,
      name: $('#name').val(),
      type: $('#type :selected').val()
    }

    // Get selection
    selection = $('#type :selected').val();

    // Add additional data
    var parameters = {};
    if (selection == 'ads') {
      parameters.campaignId = $('#campaign-id :selected').val();
    }
    if (selection == 'visits') {
      parameters.page = $('#page').val();
      parameters.previousPage = $('#previous-page').val();
    }
    if (selection == 'subscriptions' || selection == 'clicks') {
      parameters.integrationId = $('#integration :selected').val();
      parameters.listId = $('#lists :selected').val();
      parameters.sequenceId = $('#sequences :selected').val();
      parameters.origin = $('#tags :selected').val();
    }
    if (selection == 'sales') {
      parameters.integrationId = $('#integration :selected').val();
      parameters.products = $('#products').val();
    }
    step.parameters = parameters;

    // Add
    Meteor.call('addStep', step);

  },
  'click #refresh-funnel': function() {

    // Add
    Meteor.call('refreshFunnel', this._id, Meteor.user());

  }

});
