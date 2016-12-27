Template.integration.events({

  'click .delete': function () {

    Meteor.call('deleteIntegration', this._id);

  }

});