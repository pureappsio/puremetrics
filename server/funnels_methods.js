Meteor.methods({

    addFunnel: function(funnel) {

        // Add
        Funnels.insert(funnel);

    },
    deleteFunnel: function(funnelId) {

        // Delete
        Funnels.remove(funnelId);
        Steps.remove({ funnelId: funnelId });

    },
    stepPlus: function(stepId) {

        // Get step
        var step = Steps.findOne(stepId);

        // Update step
        Steps.update(stepId, { $inc: { number: 1 } });

        // Update next step
        Steps.update({ funnelId: step.funnelId, number: step.number + 1 }, { $inc: { number: -1 } });

    },
    stepMinus: function(stepId) {

        // Get step
        var step = Steps.findOne(stepId);

        // Update step
        Steps.update(stepId, { $inc: { number: -1 } });

        // Update previous step
        Steps.update({ funnelId: step.funnelId, number: step.number - 1 }, { $inc: { number: 1 } });

    },
    addStep: function(step) {

        // Add
        console.log(step)

        // Get number
        var steps = Steps.find({ funnelId: step.funnelId }, { sort: { number: -1 } }).fetch();
        if (steps.length == 0) {
            step.number = 1;
        } else {
            step.number = steps[0].number + 1;
        }

        Steps.insert(step);

    },
    deleteStep: function(stepId) {

        // Add
        Steps.remove(stepId);

    },
    refreshAllFunnels: function(user) {

        // Get all funnels
        var funnels = Funnels.find({ userId: user._id }).fetch();

        for (f in funnels) {
            Meteor.call('refreshFunnel', funnels[f]._id, user);
        }
    },
    refreshFunnel: function(funnelId, user) {

        // Get funnel
        var funnel = Funnels.findOne(funnelId);
        console.log('Refreshing funnel ' + funnel.name);

        // Get website
        var website = Websites.findOne(funnel.websiteId);

        // Get all steps
        var steps = Steps.find({ funnelId: funnelId }).fetch();

        // Get period
        var period = Meteor.call('getPeriodFunnel', user);
        console.log(period);

        for (i = 0; i < steps.length; i++) {

            // Get step
            step = steps[i];

            // Refresh individual steps
            if (step.type == 'ads') {

                // Get data from Facebook
                var insights = Meteor.call('getFacebookCampaignInsights',
                    step.parameters.campaignId,
                    Meteor.call('getGoogleDate', period.current.from),
                    Meteor.call('getGoogleDate', period.current.to)
                );

                // Get impressions
                if (insights[0]) {
                    var impressions = insights[0].impressions;
                } else {
                    var impressions = 0;
                }

                // Build data
                var value = {
                    current: impressions,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

                // Get cost
                if (insights[0]) {
                    var currentCost = insights[0].spend;
                } else {
                    var currentCost = 0;
                }

                // Build data for cost
                var cost = {
                    current: currentCost,
                    past: ""
                }

                // Update funnel
                Funnels.update(funnelId, { $set: { cost: cost } });

            }
            if (step.type == 'fbclicks') {

                // Get data from Facebook
                var insights = Meteor.call('getFacebookCampaignInsights',
                    step.parameters.campaignId,
                    Meteor.call('getGoogleDate', period.current.from),
                    Meteor.call('getGoogleDate', period.current.to)
                );

                // Get impressions
                if (insights[0]) {
                    var clicks = insights[0].clicks;
                } else {
                    var clicks = 0;
                }

                // Build data
                var value = {
                    current: clicks,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }
            if (step.type == 'visits') {

                // Get all sessions for site
                var parameters = {
                    siteId: website.siteId,
                    from: Meteor.call('getStandardDate', period.current.from),
                    to: Meteor.call('getStandardDate', period.current.to)
                }

                if (step.parameters.boxId) {
                    parameters.boxId = step.parameters.boxId;
                }

                if (step.parameters.pageId) {
                    parameters.pageId = step.parameters.pageId;
                }

                var sessions = Meteor.call('getWebsiteSessions', parameters);

                // Build data
                var value = {
                    current: sessions,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }
            if (step.type == 'subscriptions') {

                if (step.parameters.sequenceId == "") {

                    // Get all subscribers in this period
                    var answer = Meteor.call('getListSubscribers',
                        website.listId,
                        Meteor.call('getStandardDate', period.current.from),
                        Meteor.call('getStandardDate', period.current.to)
                    );

                    // Build data
                    var value = {
                        current: answer,
                        past: ""
                    }

                    // Update
                    Steps.update(step._id, { $set: { value: value } });

                } else {

                    // Get all new subscribers to sequence in this period
                    var answer = Meteor.call('getSequenceStats',
                        step.parameters.integrationId,
                        step.parameters.sequenceId,
                        Meteor.call('getStandardDate', period.current.from),
                        Meteor.call('getStandardDate', period.current.to),
                        step.parameters.origin
                    );

                    // Build data
                    var value = {
                        current: answer.subscribed,
                        past: ""
                    }

                    // Update
                    Steps.update(step._id, { $set: { value: value } });

                }
            }

            if (step.type == 'messenger') {

                // Get all clicks to sequence in this period
                var answer = Meteor.call('getMessengerSubscribers',
                    step.parameters.integrationId,
                    step.parameters.serviceId,
                    Meteor.call('getStandardDate', period.current.from),
                    Meteor.call('getStandardDate', period.current.to)
                );

                // Build data
                var value = {
                    current: answer.length,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }

            if (step.type == 'clicks') {

                // Get all clicks to sequence in this period
                var answer = Meteor.call('getSequenceStats',
                    step.parameters.integrationId,
                    step.parameters.sequenceId,
                    Meteor.call('getStandardDate', period.current.from),
                    Meteor.call('getStandardDate', period.current.to),
                    step.parameters.origin
                );

                // Build data
                var value = {
                    current: answer.clicked,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }

            if (step.type == 'cart') {

                totalCart = 0;

                for (p = 0; p < step.parameters.products.length; p++) {

                    productId = step.parameters.products[p];

                    // Get all clicks to sequence in this period
                    var answer = Meteor.call('getSessions', step.parameters.integrationId, {
                        productId: productId,
                        from: Meteor.call('getStandardDate', period.current.from),
                        to: Meteor.call('getStandardDate', period.current.to),
                        origin: step.parameters.origin,
                        type: 'cart'
                    });

                    totalCart = totalCart + answer;

                }

                // Build data
                var value = {
                    current: totalCart,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }

            if (step.type == 'checkout') {

                totalCheckout = 0;

                for (p = 0; p < step.parameters.products.length; p++) {

                    productId = step.parameters.products[p];

                    // Get all clicks to sequence in this period
                    var answer = Meteor.call('getSessions', step.parameters.integrationId, {
                        productId: productId,
                        from: Meteor.call('getStandardDate', period.current.from),
                        to: Meteor.call('getStandardDate', period.current.to),
                        origin: step.parameters.origin,
                        type: 'checkout'
                    });

                    totalCheckout = totalCheckout + answer;

                }

                // Build data
                var value = {
                    current: totalCheckout,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

            }

            if (step.type == 'sales') {

                totalSales = 0;

                // for (p = 0; p < step.parameters.products.length; p++) {

                productId = step.parameters.products;

                // Get all clicks to sequence in this period
                var answer = Meteor.call('getSales', step.parameters.integrationId, {
                    productId: productId,
                    from: Meteor.call('getStandardDate', period.current.from),
                    to: Meteor.call('getStandardDate', period.current.to),
                    origin: step.parameters.origin
                });

                totalSales = totalSales + answer;

                // }

                // Build data
                var value = {
                    current: totalSales,
                    past: ""
                }

                // Update
                Steps.update(step._id, { $set: { value: value } });

                totalRevenue = 0;

                // for (p = 0; p < step.parameters.products.length; p++) {

                productId = step.parameters.products;

                // Get all clicks to sequence in this period
                var answer = Meteor.call('getEarnings', step.parameters.integrationId, {
                    productId: productId,
                    from: Meteor.call('getStandardDate', period.current.from),
                    to: Meteor.call('getStandardDate', period.current.to),
                    origin: step.parameters.origin
                });

                totalRevenue = totalRevenue + answer;

                // }

                // Build data for revenue
                var revenue = {
                    current: totalRevenue,
                    past: ""
                }

                // Update funnel
                Funnels.update(funnelId, { $set: { revenue: revenue } });

            }

        }

        // Update global conversion
        var steps = Steps.find({ funnelId: funnelId }, { sort: { number: 1 } }).fetch();

        if (steps.length > 0) {
            if (steps[0].value.current * 100 != 0) {
                conversion = (steps[steps.length - 1].value.current / steps[0].value.current * 100).toFixed(2);
            } else {
                conversion = 0;
            }

            // Build data
            var value = {
                current: conversion,
                past: ""
            }

            // Update
            Funnels.update(funnelId, { $set: { conversion: value } });
        }

        // Update multiplier for sales funnels
        var funnel = Funnels.findOne(funnelId);
        if (funnel.revenue && funnel.cost) {

            currentMultiplier = funnel.revenue.current / funnel.cost.current;

            var multiplier = {
                current: currentMultiplier.toFixed(2),
                past: ""
            }

            // Update
            Funnels.update(funnelId, { $set: { multiplier: multiplier } });

        }

    }

});
