Template.productEdit.events({

  'click #edit-product': function() {

    product = {
      salesPage: $("#sales-page").val(),
      _id: this._id
    };
    Meteor.call('editProduct', product);
  }

});