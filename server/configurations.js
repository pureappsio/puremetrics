ServiceConfiguration.configurations.remove({
    service: "google"
  });

if (process.env.ROOT_URL == "http://localhost:3000/") {
  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: Meteor.settings.googleLocal.clientId,
    secret: Meteor.settings.googleLocal.secret
  });
}
else {
  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: Meteor.settings.googleOnline.clientId,
    secret: Meteor.settings.googleOnline.secret
   });
}

ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

if (process.env.ROOT_URL == "http://localhost:3000/") {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookLocal.appId,
      secret: Meteor.settings.facebookLocal.secret
    });  
  }
  else {
    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.facebookOnline.appId,
      secret: Meteor.settings.facebookOnline.secret
    });
  }