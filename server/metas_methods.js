Meteor.methods({

    insertMeta: function(meta) {

        console.log(meta);

        // Check if exist
        if (Metas.findOne({ type: meta.type })) {

            // Update
            console.log('Updating meta');
            Metas.update({ type: meta.type }, { $set: { value: meta.value } });

        } else {

            // Insert
            console.log('Creating new meta');
            Metas.insert(meta);

        }

    },
    getMeta: function(meta, integrationId) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/metas/' + meta;
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        console.log(request);

        res = HTTP.get(request);
        return res.data.value;

    }

});
