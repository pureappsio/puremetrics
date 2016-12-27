Template.product.events({

  'click .delete-product': function() {

    Meteor.call('deleteProduct', this._id);

  }

});

Template.product.helpers({

  productsNaming: function() {

  	var names = "";
    for (i = 0; i < this.productsId.length; i++) {
      names += AvailableProducts.findOne(this.productsId[i]).name;
    }
    return names;

  }

});
