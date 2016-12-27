Meteor.methods({

  calculateVariation: function(current, past) {

  	if (past == 0) {
  	  return 0;
  	}
  	else {
  	  return (current - past) / past * 100;
  	}
  	
  }
  
});