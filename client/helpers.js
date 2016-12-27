Handlebars.registerHelper('variationSign', function (variation){

  if (variation > 0) {return '+' + variation.toFixed(0);}
  if (variation == 0) {return '0'}
  if (variation < 0) {return variation.toFixed(0);}

});

Handlebars.registerHelper('variationColor', function (variation) {

  if (variation >= 0) {return 'green indicator-variation';}
  if (variation < 0) {return 'red indicator-variation';}

});

Handlebars.registerHelper('variationBack', function (variation) {

  if (variation > 0) {return 'back-green';}
  if (variation < 0) {return 'back-red';}

});

Handlebars.registerHelper('displayNumber', function (number) {

  if (number < 1) {
    return number.toFixed(1);
  }
  else {
    return number.toFixed(0);
  }

});

Handlebars.registerHelper('negVariationColor', function (variation) {

  if (variation > 0) {return 'red indicator-variation';}
  if (variation <= 0) {return 'green indicator-variation';}

});

Handlebars.registerHelper('truncateTitle', function (title) {

  if (title.length > 10) {return title.substring(0, 10) + '...';}
  else {return title;}

});

Handlebars.registerHelper('editMode', function (title) {

  return Session.get('editMode');

});

Handlebars.registerHelper('dateRange', function () {

  var dateRange = Meteor.user().dateRange;

  if (dateRange == 'today') {
    return 'Today';
  }
  if (dateRange == 'yesterday') {
    return 'Yesterday';
  }
  if (dateRange == '3-days') {
    return 'Past 3 Days';
  }
  if (dateRange == '7-days') {
    return 'Past 7 Days';
  }
  if (dateRange == '30-days') {
    return 'Past 30 Days';
  }

});

