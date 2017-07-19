Template.funnelDetails.onRendered(function() {

});

Template.funnelDetails.helpers({
    website: function() {
        if (Websites.findOne(this.websiteId)) {
            return Websites.findOne(this.websiteId).name;
        }
    },
    steps: function() {
        return Steps.find({ funnelId: this._id }, { sort: { number: 1 } });
    },
    textMode: function() {
        return true;
    }
});

Template.funnelDetails.events({

    'click #switch': function() {

        if (Session.get('editMode')) {

            if (Session.get('editMode') == true) {
                Session.set('editMode', false);
            } else {
                Session.set('editMode', true);
            }

        } else {
            Session.set('editMode', true);
        }

    },
    'click #graph': function() {

        if (Session.get('textMode')) {

            if (Session.get('textMode') == true) {
                Session.set('textMode', false);
            } else {
                Session.set('textMode', true);
            }

        } else {
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
                value: 'ads',
                text: 'Advertising'
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

        if (selection == 'messenger') {

            // Load lists
            Meteor.call('getServices', integration, function(err, data) {

                // Get lists
                $('#option-container-2').append("<select class='form-control' id='services'></select>");
                for (i = 0; i < data.length; i++) {
                    $('#services').append($('<option>', {
                        value: data[i]._id,
                        text: data[i].name
                    }));
                }

            });

        }

        if (selection == 'sales' || selection == 'checkout' || selection == 'cart') {

            // Get products      
            Meteor.call('getProducts', integration, function(err, data) {

                // Create element
                $('#option-container-2').append("<select class='form-control' id='products'></select>");
                // $('#products').selectpicker();

                // Add products
                for (i = 0; i < data.length; i++) {
                    $('#products').append($('<option>', {
                        value: data[i]._id,
                        text: data[i].name
                    }));
                }

                // Refresh picker
                // $('#products').selectpicker('refresh');

            });

            // Add origins
            $('#option-container-3').append("<select class='form-control' id='origin'></select>");

            $('#origin').append($('<option>', {
                value: 'ads',
                text: 'Advertising'
            }));

            $('#origin').append($('<option>', {
                value: 'organic',
                text: 'Organic'
            }));

            $('#origin').append($('<option>', {
                value: 'all',
                text: 'All'
            }));

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
        if (selection == 'ads' || selection == 'fbclicks') {

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

            // Add page
            $('#option-container-1').append("<select class='form-control' type='text' id='page'></select>");

            // Fill
            $('#page').append($('<option>', {
                value: 'all',
                text: 'All site'
            }));

            $('#page').append($('<option>', {
                value: 'page',
                text: 'Specific page of the site'
            }));

            $('#page').append($('<option>', {
                value: 'box',
                text: 'Pages with specific signup box'
            }));

        }
        if (selection == 'subscriptions' || selection == 'clicks') {

            // Add integration select
            $('#option-container-1').append("<select class='form-control' id='integration'></select>");
            var listIntegrations = Integrations.find({ type: 'puremail' }).fetch();
            for (i = 0; i < listIntegrations.length; i++) {
                $('#integration').append($('<option>', {
                    value: listIntegrations[i]._id,
                    text: 'PureMail (' + listIntegrations[i].url + ')'
                }));
            }

        }
        if (selection == 'messenger') {

            // Add integration select
            $('#option-container-1').append("<select class='form-control' id='integration'></select>");
            var listIntegrations = Integrations.find({ type: 'puresocial' }).fetch();
            for (i = 0; i < listIntegrations.length; i++) {
                $('#integration').append($('<option>', {
                    value: listIntegrations[i]._id,
                    text: 'PureSocial (' + listIntegrations[i].url + ')'
                }));
            }

        }
        if (selection == 'sales' || selection == 'checkout' || selection == 'cart') {

            // Add integration select
            $('#option-container-1').append("<select class='form-control' id='integration'></select>");
            var integrations = Integrations.find({ type: 'purecart' }).fetch();
            for (i = 0; i < integrations.length; i++) {
                $('#integration').append($('<option>', {
                    value: integrations[i]._id,
                    text: 'PureCart (' + integrations[i].url + ')'
                }));
            }

        }

    },
    'click #page, change #page': function() {

        // Get value
        value = $('#page :selected').val();

        if (value == 'box') {

            $('#option-container-2').append("<select class='form-control' type='text' id='box'></select>");

            // Load boxes
            Meteor.call('getWebsiteBoxes', this.websiteId, function(err, data) {

                for (i = 0; i < data.length; i++) {
                    $('#box').append($('<option>', {
                        value: data[i]._id,
                        text: data[i].title
                    }));
                }

            });

        }

        if (value == 'page') {

            $('#option-container-2').append("<select class='form-control' type='text' id='site-page'></select>");

            // Load boxes
            Meteor.call('getWebsitePages', this.websiteId, function(err, data) {

                for (i = 0; i < data.length; i++) {
                    $('#site-page').append($('<option>', {
                        value: data[i]._id,
                        text: data[i].title
                    }));
                }

            });

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
        if (selection == 'ads' || selection == 'fbclicks') {
            parameters.campaignId = $('#campaign-id :selected').val();
        }
        if (selection == 'visits') {
            parameters.page = $('#page').val();
            if (parameters.page == 'box') {
                parameters.boxId = $('#box :selected').val();
            }
             if (parameters.page == 'page') {
                parameters.pageId = $('#site-page :selected').val();
            }
        }
        if (selection == 'subscriptions' || selection == 'clicks') {
            parameters.integrationId = $('#integration :selected').val();
            parameters.listId = $('#lists :selected').val();
            parameters.sequenceId = $('#sequences :selected').val();
            parameters.origin = $('#tags :selected').val();
        }
        if (selection == 'messenger') {
            parameters.integrationId = $('#integration :selected').val();
            parameters.serviceId = $('#services :selected').val();
        }
        if (selection == 'sales' || selection == 'cart' || selection == 'checkout') {
            parameters.integrationId = $('#integration :selected').val();
            parameters.products = $('#products :selected').val();
            parameters.origin = $('#origin :selected').val();
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
