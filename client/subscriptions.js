Tracker.autorun(function() {
    Meteor.subscribe('userData');
    Meteor.subscribe('userWebsites');
    Meteor.subscribe('userProducts');
    Meteor.subscribe('userIntegrations')
    Meteor.subscribe('userFunnels');
    Meteor.subscribe('userSteps');
    Meteor.subscribe('userNotifications');
});
