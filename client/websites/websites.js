Template.websites.helpers({
  websites: function() {
    return Websites.find({});
  }
});

Template.websites.events({

  'click #add-website': function() {

    website = {
      name: $("#name").val(),
      url: $("#url").val(),
      userId: Meteor.user()._id
    };
    Meteor.call('addWebsite', website);
  }

});

// Template.websites.topGenresChart = function() {

//     return {
//         title: {
//             text: 'Sessions',
//             x: -20 //center
//         },
//         xAxis: {
//             categories: Session.get('dates')
//         },
//         yAxis: {
//             title: {
//                 text: 'Visitors'
//             },
//             plotLines: [{
//                 value: 0,
//                 width: 1,
//                 color: '#808080'
//             }]
//         },
//         tooltip: {
//             valueSuffix: '$'
//         },
//         series: [{
//             name: 'Visitors',
//             data: Session.get('values')
//         }]
//     };
// };
