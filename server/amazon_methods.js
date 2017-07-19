var Nightmare = require('nightmare-meteor');
var cheerio = require('cheerio');
Future = Npm.require('fibers/future');

Meteor.methods({

    getAmazonEarnings: function(parameters) {

        // Get integration
        var integration = Integrations.findOne(parameters.siteId);

        // Make request
        var baseUrl = 'https://' + integration.url + '/api/sessions';
        var key = integration.key;

        // Query
        request = baseUrl + '?key=' + key;
        request += '&type=affiliateClick&earnings=true';

        // From & to?
        if (parameters.from && parameters.to) {
            request += '&from=' + parameters.from + '&to=' + parameters.to;
        }

        console.log(request);

        try {
            res = HTTP.get(request);
            var result = res.data.sessions;
        } catch (error) {
            var result = [];
        }

        var earnings = 0;

        for (e in result) {
            earnings += parseFloat(result[e].earnings);
        }

        console.log(earnings);

        return earnings;

    },
    fetchAmazonAffiliates: function(period) {

        var nightmare = Nightmare({ show: false, loadTimeout: 10000, waitTimeout: 20000 });

        // Login
        nightmare
            .goto('https://programma-affiliazione.amazon.it/')
            .type('#username', Meteor.settings.amazonAffiliate.login)
            .type('#password', Meteor.settings.amazonAffiliate.password)
            .click('#signin > input')
            .wait(2000)
            .evaluate(function() {

                return document.body.innerHTML;
                // return document.body.querySelector('#ac-report-earning-commision-total');

            })
            .end()
            .then(function(data) {

                // Loading html body to cheerio
                // number = processDocument(data);
                // console.log(data);

            })
            .catch(function(error) {
                console.error('Search failed:', error);
            });

    },

    getAmazonAffiliateData: function(user) {

        var data = {};

        // Get period
        var period = Meteor.call('getPeriod', user);

        var currentAmazonData = Meteor.call('fetchUSAmazonAffiliates', period.current.amazonDate);

        console.log(currentAmazonData);

        return currentAmazonData;

    },

    // US affiliates
    fetchUSAmazonAffiliates: function(period) {

        console.log('Fetching Amazon for period: ' + period);
        var nightmare = Nightmare({
            show: false,
            webPreferences: {
                partition: 'nopersist'
            },
            loadTimeout: 10000,
            waitTimeout: 20000
        });

        var myFuture = new Future();

        // Login
        nightmare
            .goto('https://affiliate-program.amazon.com/')
            .click('#a-autoid-0-announce')
            .type('#ap_email', Meteor.settings.amazonAffiliate.login)
            .click('#ap_signin_existing_radio')
            .type('#ap_password', Meteor.settings.amazonAffiliate.password)
            .click('#signInSubmit')
            .wait('.get-started')
            .click('.get-started')
            .wait(2000)
            .click('a[href$="/home/reports"]')
            .wait(5000)

        if (period == 'month') {

            nightmare
                .cookies.set('pref_nevjusfin-20_report_range_type', 'month')
                .refresh()
                .wait(5000)
                .evaluate(function() {

                    // console.log(document.body.innerHTML);

                    return document.body.innerHTML;
                    // return document.body.querySelector('#ac-report-earning-commision-total');

                })
                .end()
                .then(function(data) {

                    // console.log(data);

                    // Loading html body to cheerio
                    number = processDocument(data);
                    myFuture.return(number);

                })
                .catch(function(error) {
                    console.error('Search failed:', error);
                });

        }

        if (period == '30days') {

            nightmare
                .cookies.set('pref_nevjusfin-20_report_range_type', 'last_30_days')
                .refresh()
                .wait(5000)
                .evaluate(function() {

                    return document.body.innerHTML;
                    // return document.body.querySelector('#ac-report-earning-commision-total');

                })
                .end()
                .then(function(data) {

                    // Loading html body to cheerio
                    number = processDocument(data);
                    myFuture.return(number);

                })
                .catch(function(error) {
                    console.error('Search failed:', error);
                });
        }
        if (period == '7days') {

            nightmare
                .cookies.set('pref_nevjusfin-20_report_range_type', 'last_7_days')
                .refresh()
                .wait(5000)
                .evaluate(function() {

                    return document.body.innerHTML;
                    // return document.body.querySelector('#ac-report-earning-commision-total');

                })
                .end()
                .then(function(data) {

                    // Loading html body to cheerio
                    number = processDocument(data);
                    myFuture.return(number);

                })
                .catch(function(error) {
                    console.error('Search failed:', error);
                });
        }
        if (period == 'yesterday') {

            nightmare
                .cookies.set('pref_nevjusfin-20_report_range_type', 'yesterday')
                .refresh()
                .wait(5000)
                .evaluate(function() {

                    return document.body.innerHTML;
                    // return document.body.querySelector('#ac-report-earning-commision-total');

                })
                .end()
                .then(function(data) {


                    // Loading html body to cheerio
                    number = processDocument(data);
                    myFuture.return(number);

                })
                .catch(function(error) {
                    console.error('Search failed:', error);
                });
        }
        if (period == 'today') {

            nightmare
                .cookies.set('pref_nevjusfin-20_report_range_type', 'todays')
                .refresh()
                .wait(5000)
                .evaluate(function() {

                    return document.body.innerHTML;
                    // return document.body.querySelector('#ac-report-earning-commision-total');

                })
                .end()
                .then(function(data) {

                    // Loading html body to cheerio
                    number = processDocument(data);
                    myFuture.return(number);

                })
                .catch(function(error) {
                    console.error('Search failed:', error);
                });
        }

        answer = myFuture.wait();
        console.log(answer);

        return answer;

    }


});

function processDocument(data) {

    $ = cheerio.load(data);

    // Earnings
    earnings = $('#ac-report-earning-commision-total').text();
    earnings = processNumber(earnings);

    // Conversion
    conversion = $('#ac-report-earning-commision-conversion').text();
    conversion = processNumber(conversion);

    return {
        earnings: earnings,
        conversion: conversion
    };
}

function processNumber(number) {

    number = number.replace(/\s/g, '');
    number = number.replace('$', '');
    number = number.replace(',', '');
    number = parseFloat(number);

    return number;

}
