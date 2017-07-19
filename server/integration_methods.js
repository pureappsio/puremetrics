Meteor.methods({

    getWebsiteBoxes: function(websiteId) {

        // Get integration
        var website = Websites.findOne(websiteId);
        var integration = Integrations.findOne(website.siteId);

        // Make request
        var baseUrl = "https://" + integration.url + "/api/boxes?key=" + integration.key;
        var answer = HTTP.get(baseUrl);
        return answer.data.boxes;

    },
    getWebsitePages: function(websiteId) {

         // Get integration
        var website = Websites.findOne(websiteId);
        var integration = Integrations.findOne(website.siteId);

        // Make request
        var baseUrl = "https://" + integration.url + "/api/pages?key=" + integration.key;
        var answer = HTTP.get(baseUrl);
        return answer.data.pages;

    },
    getWebsiteSessions: function(parameters) {

        // Get integration
        var integration = Integrations.findOne(parameters.siteId);

        // Make request
        var baseUrl = "https://" + integration.url + "/api/sessions?key=" + integration.key;
        baseUrl += '&summary=true&from=' + parameters.from + '&to=' + parameters.to;
        if (parameters.boxId) {
            baseUrl += '&box=' + parameters.boxId;
        }

        if (parameters.pageId) {
            baseUrl += '&page=' + parameters.pageId;
        }

        if (parameters.postId) {
            baseUrl += '&post=' + parameters.postId;
        }

        console.log(baseUrl);

        var answer = HTTP.get(baseUrl);
        return answer.data.sessions;

    },
    createUserAccount: function(data) {

        console.log(data);

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('Updating existing user');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser({
                email: data.email,
                password: data.password
            });

            // Assign role & teacher ID
            Meteor.users.update(userId, { $set: { role: data.role } });

        }

        return userId;

    },

    editIntegration: function(data) {

        console.log(data);

        Integrations.update(data._id, { $set: { key: data.key, url: data.url } });

    },
    addIntegration: function(data) {

        // Insert
        Integrations.insert(data);

    },
    getWebsiteSalesVisits(website, user) {

        // Get all producys from site
        var products = Products.find({ websiteId: website._id }).fetch();

        // Variables
        var current = 0;
        var past = 0;
        var salesPages = [];

        // Get all visits on sales pages
        for (i = 0; i < products.length; i++) {
            if (products[i].salesPageSessions && !(salesPages.indexOf(products[i].salesPage) > -1)) {
                current += products[i].salesPageSessions.current;
                past += products[i].salesPageSessions.past;
            }
            salesPages.push(products[i].salesPage);
        }

        var salesPageSessions = {
            current: current,
            past: past,
            variation: Meteor.call('calculateVariation', current, past)
        }

        return salesPageSessions;

    },
    getWebsiteCheckoutVisits(website, user) {

        var period = Meteor.call('getPeriod', user);
        var parameters = {
            from: Meteor.call('getStandardDate', period.current.from),
            to: Meteor.call('getStandardDate', period.current.to)
        }

        // Variables
        var currentSessions = Meteor.call('getCheckoutSessions', website.salesIntegrationId, parameters);
        var pastSessions = Meteor.call('getCheckoutSessions', website.salesIntegrationId, parameters);

        console.log(currentSessions);

        // Calculate variation
        var variation = Meteor.call('calculateVariation', currentSessions, pastSessions);

        return {
            current: currentSessions,
            past: pastSessions,
            variation: variation
        }

    },
    getProductSalesToCheckout: function(product) {

        // Variables
        var current = product.checkoutSessions.current / product.salesPageSessions.current * 100;
        var past = product.checkoutSessions.past / product.salesPageSessions.past * 100;

        // Calculate variation
        var variation = Meteor.call('calculateVariation', current, past);

        return {
            current: current,
            past: past,
            variation: variation
        }

    },
    getProductCheckoutVisits(product, user) {

        // Get data
        var integrationId = product.integrationId;
        var period = Meteor.call('getPeriod', user);

        // Get visits
        var currentSessions = Meteor.call('getCheckoutSessions', integrationId, {
            from: Meteor.call('getStandardDate', period.current.from),
            to: Meteor.call('getStandardDate', period.current.to),
            productId: product.integrationProductId
        });
        var pastSessions = Meteor.call('getCheckoutSessions', integrationId, {
            from: Meteor.call('getStandardDate', period.past.from),
            to: Meteor.call('getStandardDate', period.past.to),
            productId: product.integrationProductId
        });

        // Calculate variation
        var variation = Meteor.call('calculateVariation', currentSessions, pastSessions);

        return {
            current: currentSessions,
            past: pastSessions,
            variation: variation
        }

    },
    getProductSalesPageVisits(product, user) {

        // Get options
        options = {
            user: user
        }
        var period = Meteor.call('getPeriod', user);

        // Get website
        var website = Websites.findOne(product.websiteId);

        // Get visits
        var currentSessions = Meteor.call('getPageSessions',
            website.propertyId,
            '/' + product.salesPage + '/',
            get_date(period.current.from),
            get_date(period.current.to),
            options
        );
        var pastSessions = Meteor.call('getPageSessions',
            website.propertyId,
            '/' + product.salesPage + '/',
            get_date(period.past.from),
            get_date(period.past.to),
            options
        );

        // Calculate variation
        var variation = Meteor.call('calculateVariation', currentSessions, pastSessions);

        return {
            current: currentSessions,
            past: pastSessions,
            variation: variation
        }

    },
    calculateWebsiteConversions(website, user) {

        console.log(website);

        // Calculate abandon
        if (website.sales && website.checkout) {

            if (website.checkout.current == 0) {
                var current = 0;
            } else {
                var current = (1 - website.sales.current / website.checkout.current) * 100;
            }

            if (website.checkout.past == 0) {
                var past = 0;
            } else {
                var past = (1 - website.sales.past / website.checkout.past) * 100;
            }

            var variation = Meteor.call('calculateVariation', current, past)

            var abandon = {
                current: current,
                past: past,
                variation: variation
            }

            Websites.update(website._id, { $set: { abandon: abandon } });

        }

        // Visitors to list
        if (website.subscribers && website.visitors) {

            var current = website.subscribers.current / website.visitors.current * 100;
            var past = website.subscribers.past / website.visitors.past * 100;
            var variation = Meteor.call('calculateVariation', current, past)

            var visitorsToList = {
                current: current,
                past: past,
                variation: variation
            }

            Websites.update(website._id, { $set: { visitorsToList: visitorsToList } });

        }

        // Sales page to checkout
        if (website.salesPageSessions && website.checkout) {

            var current = website.checkout.current / website.salesPageSessions.current * 100;
            var past = website.checkout.past / website.salesPageSessions.past * 100;
            var variation = Meteor.call('calculateVariation', current, past)

            var salesPageToCheckout = {
                current: current,
                past: past,
                variation: variation
            }

            Websites.update(website._id, { $set: { salesPageToCheckout: salesPageToCheckout } });

        }

        // Sales page to sale
        if (website.salesPageSessions && website.sales) {

            var current = website.sales.current / website.salesPageSessions.current * 100;
            var past = website.sales.past / website.salesPageSessions.past * 100;
            var variation = Meteor.call('calculateVariation', current, past)

            var salesPageToSale = {
                current: current,
                past: past,
                variation: variation
            }

            Websites.update(website._id, { $set: { salesPageToSale: salesPageToSale } });

        }

    }

});

function get_date(offset) {

    // Get dates
    var d = new Date();
    d.setDate(d.getDate() - offset);

    current_month = d.getMonth() + 1;
    current_year = d.getFullYear();
    current_day = d.getDate();

    current_month = current_month.toString();
    current_day = current_day.toString();

    if (current_month.length < 2) current_month = '0' + current_month;
    if (current_day.length < 2) { current_day = '0' + current_day };

    // Build date objects
    date = current_year + '-' + current_month + '-' + current_day;

    return date;

}
