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

    currentValue: function() {

      if (this.value) {
        return this.value.current;
      }
      else {
        return '0.00';
      }

    },

    leadCost: function() {

        if (this.value) {
            if (this.value.current == 0) {
                return 'N/A';
            } else {
                return (Funnels.findOne(this.funnelId).cost.current / this.value.current).toFixed(3) + '€';
            }
        } else {
            return 'N/A';
        }

    },
    // cost: function() {

    //     if (this.value) {
    //         if (this.value.current == 0) {
    //             return 'N/A';
    //         } else {
    //             return Funnels.findOne(this.funnelId).cost.current + '€';
    //         }
    //     } else {
    //         return 'N/A';
    //     }

    // },
    conversion: function() {

        if (this.number != 1) {
            var previousStep = Steps.findOne({ funnelId: this.funnelId, number: this.number - 1 });

            console.log(previousStep);

            if (previousStep.value) {
                if (previousStep.value.current == 0) {
                    return '0.00';
                } else {
                    return (this.value.current / previousStep.value.current * 100).toFixed(2) + '%';
                }
            } else {
                return '0.00'
            }

        }
        else {
          return 'N/A';
        }

    }

});
