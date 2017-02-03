Template.websiteFunnels.helpers({

    funnels: function() {
        return Funnels.find({ websiteId: this._id });
    },
    areFunnels: function() {
    	var funnels = Funnels.find({ websiteId: this._id }).fetch();
    	if (funnels.length > 0) {
    		return true;
    	}
    }
});
