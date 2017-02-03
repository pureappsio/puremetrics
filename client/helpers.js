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

Handlebars.registerHelper('darkTheme', function () {

  if (Meteor.user().theme) {

    if (Meteor.user().theme == 'light') {
      return false;
    }
    else {
      return true;
    }

  }
  else {
    return false;
  }

});


Handlebars.registerHelper('displayNumber', function (number) {

   if (number < 0.1) {
    return number.toFixed(2);
  }
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

  var dateRange = Metas.findOne({type: 'dateRange'}).value;

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

Handlebars.registerHelper('funnelDateRange', function () {

  var dateRange = Metas.findOne({type: 'funnelDateRange'}).value;

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

