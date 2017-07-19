Router.configure({
    layoutTemplate: 'layout'
});

// Main route
Router.route('/', function() {

    if (!Meteor.userId()) {

        this.render('login');

    } else {

        this.render('home');

    }

});

// Dashboards
Router.route('/dashboards', { name: 'dashboards' });

Router.route('/login', {
    name: 'login'
});

Router.route('/entries', {
    name: 'entries'
});


Router.route('/signup', {
    name: 'signup'
});

Router.route('/graph', {
    name: 'graph'
});

// Websites
Router.route('/websites', { name: 'websites' });
Router.route('/websites/:_id', {
    name: 'websiteDashboard',
    data: function() {
        return Websites.findOne(this.params._id); }
});

Router.route('/websites/edit/:_id', {
    name: 'websiteEdit',
    data: function() {
        return Websites.findOne(this.params._id); }
});

// Products
Router.route('/products', { name: 'products' });
Router.route('/products/edit/:_id', {
    name: 'productEdit',
    data: function() {
        return Products.findOne(this.params._id); }
});

// Funnels
Router.route('/funnels', { name: 'funnels' });
Router.route('/funnels/:_id', {
    name: 'funnelDetails',
    data: function() {
        return Funnels.findOne(this.params._id); }
});

Router.route('/stream', { name: 'stream' });
Router.route('/settings', { name: 'settings' });
