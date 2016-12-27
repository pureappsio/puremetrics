// Template.websiteDetails.helpers({
//   formatVariation: function() {
//     if (this.variation > 0) {
//       return '+' + this.variation;
//     }
//     else {
//       return this.variation;
//     }

//   },
//   variationColor: function() {
//     if (this.variation > 0) {
//       return 'green';
//     }
//     else if (this.variation == 0) {
//       return '';
//     }
//     else {
//       return 'red';
//     }
//   }
// });

Template.websiteDetails.events({
  'click .delete': function() {
    Meteor.call('deleteWebsite', this._id);
  }
});
