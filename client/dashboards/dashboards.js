Template.dashboards.events({

    'click #create-dashboard': function() {
        var dashboard = {

            name: $('#dashboard-name').val(),
            userId: Meteor.user()._id

        }

        Meteor.call('createDashboard', dashboard);

    }

});

Template.dashboards.helpers({

    dashboards: function() {
        return Dashboards.find({});
    }

});
