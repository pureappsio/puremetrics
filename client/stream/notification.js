Template.notification.helpers({

    formatType: function() {

        if (this.type == 'sale') {
            return "SALE";
        }
        if (this.type == 'failed') {
            return "FAILED";
        }
        if (this.type == 'survey') {
            return "SURVEY";
        }
        if (this.type == 'subscription') {
            return "SUBSCRIPTION";
        }
        if (this.type == 'unsubscribed') {
            return "UNSUBSCRIBED";
        }

    },
    styleType: function() {
        if (this.type == 'sale') {
            return "badge-success";
        }
        if (this.type == 'failed') {
            return "badge-danger";
        }
        if (this.type == 'survey') {
            return "badge-default";
        }
        if (this.type == 'subscription') {
            return "badge-default";
        }
        if (this.type == 'unsubscribed') {
            return "badge-danger";
        }
    },
    formatOrigin: function() {

        if (this.origin) {

            if (this.origin == 'landing') {
                return "ADS";
            } else if (this.origin == 'blog' || this.origin == 'organic') {

                if (this.type == 'sale' || this.type == 'failed') {
                    return "EMAIL";
                } else {
                    return "ORGANIC";
                }

            } else if (this.origin == 'social') {
                return "SOCIAL";
            } else if (this.origin == 'affiliate') {
                return "AFFILIATE";
            } else if (this.origin == 'direct') {
                return "DIRECT";
            }
        } else {
            return "ORGANIC";
        }

    },
    styleOrigin: function() {
        if (this.origin) {
            if (this.origin == 'landing' || this.origin == 'ads') {
                return "badge-primary";
            } else if (this.origin == 'blog' || this.origin == 'organic') {
                return "badge-warning";
            } else if (this.origin == 'social') {
                return "badge-info";
            } else if (this.origin == 'affiliate') {
                return "badge-danger";
            } else if (this.origin == 'direct') {
                return "badge-warning";
            }
        } else {
            return "badge-warning";
        }
    },
    formatMessage: function() {

        var message = (this.message).replace("Hypnotized Girls Videos", "eCommerce Store");
        return message;

    },
    formatDate: function() {
        return moment(this.timestamp).fromNow();
    },
    image: function() {
        if (this.type == 'sale') {
            return '/credit.png?v=7';
        }
        if (this.type == 'subscription') {
            return '/email.png?v=8';
        }
    },
    important: function() {
        if (this.type == 'sale') {
            return 'important';
        }
    }
});
