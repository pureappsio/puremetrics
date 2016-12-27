Template.funnels.helpers({

  funnels: function() {
     if (this._id) {
       return Funnels.find({websiteId: this._id});
     }
     else {
       return Funnels.find({});
     }
    
  },
  websites: function() {
    return Websites.find({});
  }
});

Template.funnels.events({

  'click #add-funnel': function() {

    // Get funnel data
    funnel = {
      websiteId: $('#website-id :selected').val(),
      userId: Meteor.user()._id,
      name: $('#funnel-name').val()
    }

    // Add
    Meteor.call('addFunnel', funnel);

  }

});
