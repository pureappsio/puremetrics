Template.integration.events({

  'click .delete': function () {

    Meteor.call('deleteIntegration', this._id);

  },
  'click .edit': function (template, event) {

  	console.log();

  	integrationData = {
  		_id: this._id,
  		url: $('#url-' + this._id).val(),
  		key: $('#key-' + this._id).val()
  	}

    Meteor.call('editIntegration', integrationData);

  }

});