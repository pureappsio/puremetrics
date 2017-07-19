Template.entries.helpers({
    websites: function() {
        return Websites.find({});
    },
    categories: function() {
        return Categories.find({});
    },
    revenues: function() {
        return Entries.find({ type: 'revenue' });
    },
    expenses: function() {
        return Entries.find({ type: 'expense' });
    }
});

Template.entries.onRendered(function() {

	$('#revenue-datepicker').datepicker();
    $('#expense-datepicker').datepicker();

});

Template.entries.events({

    'click #add-category': function() {

        Meteor.call('addCategory', {
            userId: Meteor.user()._id,
            name: $('#category-name').val()
        })

    },
    'click #add-revenue': function() {

        Meteor.call('addEntry', {
            userId: Meteor.user()._id,
            categoryId: $('#revenue-category :selected').val(),
            websiteId: $('#website :selected').val(),
            type: 'revenue',
            date: new Date($('#revenue-datepicker').val()),
            amount: parseFloat($('#revenue-amount').val())
        })

    },
    'click #add-expense': function() {

        Meteor.call('addEntry', {
            userId: Meteor.user()._id,
            categoryId: $('#expense-category :selected').val(),
            type: 'expense',
            date: new Date($('#expense-datepicker').val()),
            amount: parseFloat($('#expense-amount').val())
        })

    }

});
