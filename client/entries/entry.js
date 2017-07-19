Template.entry.helpers({

    categoryName: function() {
        return Categories.findOne(this.categoryId).name;
    },
    websiteName: function() {
        if (this.websiteId) {
            return Websites.findOne(this.websiteId).name;
        }
        
    },
    formatDate: function() {
        return moment(this.date).format("MMM Do YYYY");
    }

});

Template.entry.events({

    'click .delete': function() {

        // Add
        Meteor.call('deleteEntry', this._id);

    },

});
