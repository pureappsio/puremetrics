Tracker.autorun(function() {
    Meteor.subscribe('userData');
    Meteor.subscribe('userWebsites');
    Meteor.subscribe('userProducts');
    Meteor.subscribe('userDashboards');
    Meteor.subscribe('userMetas');
    Meteor.subscribe('userIntegrations')
    Meteor.subscribe('userFunnels');
    Meteor.subscribe('userSteps');
    Meteor.subscribe('userEntries');
    Meteor.subscribe('userNotifications');
    Meteor.subscribe('userCategories');
});
