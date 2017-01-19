Template.websiteFunnels.helpers({

    funnels: function() {
        return Funnels.find({ websiteId: this._id });
    }
});
