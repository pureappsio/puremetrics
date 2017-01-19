if(Meteor.isServer) {
	Meteor.publish("userData", function () {
	  return Meteor.users.find({_id: this.userId}, {services: {google: 1}, dateRange: 1});
	});

	Meteor.publish("userDashboards", function () {
	  return Dashboards.find({userId: this.userId});
	});

	Meteor.publish("userMetas", function () {
	  return Metas.find({userId: this.userId});
	});

	Meteor.publish("userWebsites", function () {
	  return Websites.find({userId: this.userId});
	});

	Meteor.publish("userProducts", function () {
	  return Products.find({userId: this.userId});
	});

	Meteor.publish("userFunnels", function () {
	  return Funnels.find({userId: this.userId});
	});

	Meteor.publish("userIntegrations", function () {
	  return Integrations.find({userId: this.userId});
	});

	Meteor.publish("userSteps", function () {
	  return Steps.find({userId: this.userId});
	});

	Meteor.publish("userNotifications", function () {
	  return Notifications.find({userId: this.userId});
	});
	
}
