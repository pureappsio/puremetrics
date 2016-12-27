Template.step.events({

  'click .delete': function() {

    // Add
    Meteor.call('deleteStep', this._id);

  },
  'click .plus': function() {

    // Add
    Meteor.call('stepPlus', this._id);

  },
  'click .minus': function() {

    // Add
    Meteor.call('stepMinus', this._id);

  }

});

Template.step.helpers({

  cost: function() {
    if (this.value.current == 0) {
      return 'N/A';
    }
    else {
      return  (Funnels.findOne(this.funnelId).cost.current/this.value.current).toFixed(3) + '€';
    }
  },
  conversion: function() {

   if (this.number != 1) {
   	 var previousStep = Steps.findOne({funnelId: this.funnelId, number: this.number - 1});
   	 console.log(previousStep);
     if (previousStep.value.current == 0) {
      return '0.00';
     }
     else {
      return (this.value.current / previousStep.value.current * 100).toFixed(2) + '%';
     }
   }

  }

});

