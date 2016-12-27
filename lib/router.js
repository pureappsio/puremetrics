Router.configure({
  layoutTemplate: 'layout'
});


// Main
Router.route('/', function () {
  this.render('home');
});

// Websites
Router.route('/websites', {name: 'websites'});
Router.route('/websites/:_id', {
    name: 'websiteDashboard',
    data: function() { return Websites.findOne(this.params._id); }
});

Router.route('/websites/edit/:_id', {
    name: 'websiteEdit',
    data: function() { return Websites.findOne(this.params._id); }
});

// Products
Router.route('/products', {name: 'products'});
Router.route('/products/edit/:_id', {
    name: 'productEdit',
    data: function() { return Products.findOne(this.params._id); }
});

// Funnels
Router.route('/funnels', {name: 'funnels'});
Router.route('/funnels/:_id', {
    name: 'funnelDetails',
    data: function() { return Funnels.findOne(this.params._id); }
});

Router.route('/stream', {name: 'stream'});
Router.route('/settings', {name: 'settings'});


