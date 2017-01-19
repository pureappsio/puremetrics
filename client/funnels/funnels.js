Template.funnels.helpers({

    funnels: function() {
        if (this._id) {
            return Funnels.find({ websiteId: this._id });
        } else {
            return Funnels.find({});
        }

    },
    websites: function() {
        return Websites.find({});
    }
});

Template.funnels.events({

    'click #refresh-funnels': function() {

        Meteor.call('refreshAllFunnels', Meteor.user());

    },
    'click #add-funnel': function() {

        // Get funnel data
        funnel = {
            websiteId: $('#website-id :selected').val(),
            userId: Meteor.user()._id,
            name: $('#funnel-name').val(),
            type: $('#funnel-type :selected').val()
        }

        // Add
        Meteor.call('addFunnel', funnel);

    }

});
