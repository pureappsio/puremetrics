Template.funnel.events({

	'click .delete-funnel': function() {
		Meteor.call('deleteFunnel', this._id);
	}

});