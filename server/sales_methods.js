Meteor.methods({

    getProducts: function(integrationId) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Make request
        var baseUrl = 'http://' + integration.url + '/api/products';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        res = HTTP.get(request);
        return res.data.products;

    },
    editProduct: function(product) {

        console.log(product);

        // Update
        Products.update(product._id, { $set: product });

    },

    addProduct: function(productData) {

        // Add
        Products.insert(productData);

    },
    deleteProduct: function(productId) {

        // Delete
        Products.remove(productId);

    },
    refreshAllProducts: function(website, user) {

        // Get all products
        var products = Products.find({ websiteId: website._id }).fetch();

        // Refresh
        for (p = 0; p < products.length; p++) {
            Meteor.call('refreshProduct', products[p], user);
        }

    },
    refreshProduct: function(product, user) {

        // Find sales & earnings for product
        var sales = Meteor.call('getProductSales', product);
        var earnings = Meteor.call('getProductEarnings', product);

        // Update
        Products.update(product._id, { $set: { earnings: earnings, sales: sales } });

        console.log(product);

        // Refresh sales page session
        if (product.salesPage) {
            var salesPageSessions = Meteor.call('getProductSalesPageVisits', product, user);
            Products.update(product._id, { $set: { salesPageSessions: salesPageSessions } });
        }

        // Refresh checkout page sessions
        if (product.salesPage) {
            var checkoutSessions = Meteor.call('getProductCheckoutVisits', product, user);
            Products.update(product._id, { $set: { checkoutSessions: checkoutSessions } });
        }

        // Refresh product
        var product = Products.findOne(product._id);

        // Sales to checkout conversions
        if (product.checkoutSessions) {
            var salesToCheckout = Meteor.call('getProductSalesToCheckout', product);
            Products.update(product._id, { $set: { salesToCheckout: salesToCheckout } });
        }

    },
    getProductEarnings: function(product) {

        // Sales
        var current = 0;
        var past = 0;
        var total = 0;

        // Get period
        var user = Meteor.users.findOne(product.userId);
        var period = Meteor.call('getPeriod', user);

        // Get earnings
        var total = Meteor.call('getEarnings',
            product.integrationId, {
                productId: product.integrationProductId
            }
        );
        var currentEarnings = Meteor.call('getEarnings',
            product.integrationId, {
                from: Meteor.call('getStandardDate', period.current.from),
                to: Meteor.call('getStandardDate', period.current.to),
                productId: product.integrationProductId
            }
        );
        var pastEarnings = Meteor.call('getEarnings',
            product.integrationId, {
                from: Meteor.call('getStandardDate', period.past.from),
                to: Meteor.call('getStandardDate', period.past.to),
                productId: product.integrationProductId
            }
        );

        // Variation
        variation = Meteor.call('calculateVariation', currentEarnings, pastEarnings);

        return {
            current: currentEarnings,
            past: pastEarnings,
            variation: variation,
            total: total
        }

    },
    getProductSales: function(product, sales) {

        // Sales
        var current = 0;
        var past = 0;
        var total = 0;

        // Get period
        var user = Meteor.users.findOne(product.userId);
        var period = Meteor.call('getPeriod', user);

        // Get earnings
        var total = Meteor.call('getSales',
            product.integrationId, {
                productId: product.integrationProductId
            }
        );
        var current = Meteor.call('getSales',
            product.integrationId, {
                from: Meteor.call('getStandardDate', period.current.from),
                to: Meteor.call('getStandardDate', period.current.to),
                productId: product.integrationProductId
            }
        );
        var past = Meteor.call('getSales',
            product.integrationId, {
                from: Meteor.call('getStandardDate', period.past.from),
                to: Meteor.call('getStandardDate', period.past.to),
                productId: product.integrationProductId
            }
        );

        // Variation
        variation = Meteor.call('calculateVariation', current, past);

        return {
            current: current,
            past: past,
            variation: variation,
            total: total
        }

    },
    getLast30DaysSales: function(website) {

        // Get period
        var user = Meteor.users.findOne(website.userId);
        var period = Meteor.call('getPeriod', user);

        var currentSales = Meteor.call('getWebsiteSales',
            website,
            Meteor.call('getStandardDate', period.current.from),
            Meteor.call('getStandardDate', period.current.to)
        );

        var pastSales = Meteor.call('getWebsiteSales',
            website,
            Meteor.call('getStandardDate', period.past.from),
            Meteor.call('getStandardDate', period.past.to)
        );

        return {
            current: currentSales,
            past: pastSales,
            variation: Meteor.call('calculateVariation', currentSales, pastSales)
        };

    },
    getLast30DaysEarnings: function(website) {

        // Get period
        var user = Meteor.users.findOne(website.userId);
        var period = Meteor.call('getPeriod', user);

        var currentEarnings = Meteor.call('getWebsiteEarnings',
            website,
            Meteor.call('getStandardDate', period.current.from),
            Meteor.call('getStandardDate', period.current.to)
        );
        var pastEarnings = Meteor.call('getWebsiteEarnings',
            website,
            Meteor.call('getStandardDate', period.past.from),
            Meteor.call('getStandardDate', period.past.to)
        );

        return {
            current: currentEarnings,
            past: pastEarnings,
            variation: Meteor.call('calculateVariation', currentEarnings, pastEarnings)
        };

    },

    getWebsiteSales: function(website, fromDate, toDate) {

        // Get integration
        var integration = Integrations.findOne(website.salesIntegrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/sales';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        request += '&from=' + fromDate + '&to=' + toDate;
        res = HTTP.get(request);

        if (res.data.sales) {
            return res.data.sales.length;
        } else {
            return 0;
        }

    },
    getWebsiteEarnings: function(website, fromDate, toDate) {

        // Get integration
        var integration = Integrations.findOne(website.salesIntegrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/earnings';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        request += '&from=' + fromDate + '&to=' + toDate;
        // console.log(request);
        res = HTTP.get(request);
        return res.data.earnings;

    },
    getEarnings: function(integrationId, parameters) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/earnings';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;

        if (parameters.from && parameters.to) {
            request += '&from=' + parameters.from + '&to=' + parameters.to;
        }
        if (parameters.productId) {
            request += '&product=' + parameters.productId;
        }
        if (parameters.origin) {
            if (parameters.origin != 'all') {
                request += '&origin=' + parameters.origin;
            }
        }

        res = HTTP.get(request);
        return res.data.earnings;

    },
    getSalesCountry: function(integrationId, parameters) {

        // Get earnings
        var sales = Meteor.call('getSalesDetails', integrationId, parameters);

        // Get conversions
        res = HTTP.get('http://api.fixer.io/latest');
        convRate = res.data;

        // Classify by country
        var countries = [];

        for (s in sales) {

            if (sales[s].country) {

                // Get location
                location = sales[s].country;

                // Get amount in EUR
                if (sales[s].currency == 'EUR') {
                    var amount = parseFloat(sales[s].amount);
                } else {
                    var amount = parseFloat(sales[s].amount) / convRate.rates[sales[s].currency];
                }

                // Insert
                inserted = false;
                for (c in countries) {
                    if (countries[c].location == location) {
                        countries[c].amount += amount;
                        inserted = true;
                    }
                }

                if (inserted == false) {
                    countries.push({
                        location: location,
                        amount: amount
                    });
                }

                // if (countries[location]) {
                //     countries[location] += amount;

                // } else {
                //     countries[location] = amount;

                // }

            }

        }
        return countries;

    },
    getSales: function(integrationId, parameters) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/sales';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        if (parameters.from && parameters.to) {
            request += '&from=' + parameters.from + '&to=' + parameters.to;
        }
        if (parameters.productId) {
            request += '&product=' + parameters.productId;
        }
        if (parameters.origin) {
            if (parameters.origin != 'all') {
                request += '&origin=' + parameters.origin;
            }
        }
        console.log(request);

        res = HTTP.get(request);
        return res.data.sales.length;

    },
    getSalesDetails: function(integrationId, parameters) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/sales';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        if (parameters.from && parameters.to) {
            request += '&from=' + parameters.from + '&to=' + parameters.to;
        }
        if (parameters.productId) {
            request += '&product=' + parameters.productId;
        }
        if (parameters.origin) {
            if (parameters.origin != 'all') {
                request += '&origin=' + parameters.origin;
            }
        }
        console.log(request);

        res = HTTP.get(request);
        return res.data.sales;

    },
    getCheckoutVisits: function(website, fromDate, toDate) {

        // Get integration
        var integration = Integrations.findOne(website.salesIntegrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/sessions';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        request += '&from=' + fromDate + '&to=' + toDate;
        res = HTTP.get(request);
        return res.data.sessions;

    },
    getCheckoutSessions: function(integrationId, parameters) {

        // Get integration
        var integration = Integrations.findOne(integrationId);

        // Parameters
        var baseUrl = 'http://' + integration.url + '/api/sessions';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;

        if (parameters.to && parameters.from) {
            request += '&from=' + parameters.from + '&to=' + parameters.to;
        }

        if (parameters.productId) {
            request += '&product=' + parameters.productId;
        }

        res = HTTP.get(request);
        return res.data.sessions;

    }

});
