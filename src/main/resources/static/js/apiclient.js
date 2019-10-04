var apiclient = (function () {


	var getBlueprintsByAuthor	= function (author, callback) {
        $.get("http://localhost:8080/blueprints/"+author, function(data){
            callback(
                data
            );
        });
      };
	  
	var getBlueprintsByNameAndAuthor = function (author, name, callback) {

        $.get( "http://localhost:8080/blueprints/"+author+"/"+name, function(data){
            callback(
                [data],name
            );
        });
      };
	  
	  
	  
	  
	  
	 
	  
	
    return {
      getBlueprintsByAuthor: getBlueprintsByAuthor,
	  getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor
    };
  
  })();