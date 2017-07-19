Meteor.methods({

    addCategory: function(category) {

        console.log(category);
        Categories.insert(category);

    },
    addEntry: function(entry) {
        console.log(entry);
        Entries.insert(entry);
    },
    deleteEntry: function(entryId) {
    	Entries.remove(entryId);
    }

});
