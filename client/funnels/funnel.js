Template.funnel.events({

	'click .delete-funnel': function() {
		Meteor.call('deleteFunnel', this._id);
	}

});

Template.funnel.helpers({

	formatType: function() {
		if (this.type) {
			if (this.type == 'sales') {
				return 'SALES FUNNEL';
			}
			if (this.type == 'leadgen') {
				return 'LEAD GENERATION';
			}
		}
		else {
			return 'GENERIC';
		}
	},
	typeLabel: function() {
		if (this.type) {
			if (this.type == 'sales') {
				return 'success';
			}
			if (this.type == 'leadgen') {
				return 'primary';
			}
		}
		else {
			return 'default';
		}
	}

});