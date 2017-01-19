Template.layout.onRendered(function() {

    Meteor.call('checkTheme', function(err, theme) {
        if (theme == 'dark') {
            $('body').addClass('dark-layout');
        }
    });

});
