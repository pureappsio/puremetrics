Template.websiteEdit.helpers({

    pressIntegrations: function() {
        return Integrations.find({ type: 'purepress' });
    },
    salesIntegrations: function() {
        return Integrations.find({ type: 'purecart' });
    },
    mailIntegrations: function() {
        return Integrations.find({ type: 'puremail' });
    }

});

Template.websiteEdit.events({

    'click #edit-website': function() {

        website = {
            name: $("#name").val(),
            url: $("#url").val(),
            userId: Meteor.user()._id,
            _id: this._id
        };

        if ($('#list-integration-sales :selected').val() != 'none') {
            website.salesIntegrationId = $('#list-integration-sales :selected').val();
        }

        if ($('#list-integration :selected').val() != 'none') {
            website.list = {
                integrationId: $('#list-integration :selected').val(),
                parameter: $('#list-parameter :selected').val()
            }
        }

        if ($('#press-integration :selected').val() != 'none') {
            website.siteId = $('#press-integration :selected').val();
        }

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

    if (this.data) {

        if (this.data.salesIntegrationId) {
            $('#list-integration-sales').val(this.data.salesIntegrationId);
        }

        if (this.data.siteId) {
            $('#press-integration').val(this.data.siteId);
        }

        if (this.data.list) {
            $('#list-integration').val(this.data.list.integrationId);

            parameter = this.data.list.parameter;

            // Load lists
            Meteor.call('getEmailLists', this.data.list.integrationId, function(err, data) {

                for (i = 0; i < data.length; i++) {
                    $('#list-parameter').append($('<option>', {
                        value: data[i]._id,
                        text: data[i].name
                    }));
                }

                $('#list-parameter').val(parameter);

            });

        }

    }

});
