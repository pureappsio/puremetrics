Template.products.helpers({
  products: function() {
    return Products.find({websiteId: this._id}, {sort: {"earnings.total": -1}});
  },
  availableProducts: function() {
    return AvailableProducts.find({websiteId: this._id});
  }
});

Template.products.events({

  'click #add-product': function() {

    productsId = [];
    for (i = 0; i < Session.get('productsIndex'); i++) {
      productsId.push($('#select-product-' + i + ' :selected').val());
    }

  	var productData = {
      productsId: productsId,
      websiteId: this._id,
      userId: Meteor.user()._id,
      salesPage: $('#product-sales').val(),
      checkoutPage: $('#product-checkout').val()
    };
    Meteor.call('addProduct', productData);

  },
  'click #more-product': function() {

  	AvailableProducts.find({websiteId: this._id}, function(err, data) {

      index = Session.get('productsIndex');
      $('#products-selector').append($("<select id='select-product-" + index + "' class='form-control'></select>"));

  	  for (i in data) {
  	    $('#select-product-' + index).append($('<option>', {
  	      value: data[i]._id,
  	      text: data[i].name
  	    }));
	    }

      index = index + 1;
      Session.set('productsIndex', index);

  	});

  }

});

Template.products.rendered = function() {

  // Index
  Session.set('productsIndex', 1);

}
