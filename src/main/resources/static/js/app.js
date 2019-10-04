var Module =( function (){
	
	var planodesplegado  = false;
 	var puntosnuevos={author: null,name: null,points: []};
	var planosnuevos=[];

	var sumaDePuntos = function(total,num){
		return total+num;
	};
	
	var mapeador = function(plano){
		if(plano){
				planosnuevos=plano;

				$("#BP tbody").empty();
				
                var objetos = plano.map(function (plane){
					
					return {"name":plane.name,"n_points":plane.points.length}
				}
				)
				
				var numberpoints = objetos.map(function (plano){
					return plano.n_points;
					
				}
				)

				document.getElementById("userPoints").innerHTML = numberpoints.reduce(sumaDePuntos);
				
				var c=0;
				objetos.map(function (obj){
					var name = obj.name;
					var numpoints = obj.n_points;

					var fila = ["<tr><td id=\"planombre",c,"\">",name, "</td><td>",numpoints, "</td><td><button id=\"",name,"button\" type=\"button\" onclick=\"Module.porAutorYNombre(",c,")\">Open</button></td></tr>"]
					var agregarfila=fila.join("");
					$("#BP tbody").append(agregarfila);
					c+=1;
				})
            }
	};
	
	
	
	
	
	var graficador = function(plano,nombre){
		if (plano){
			if (nombre){
				
				
				 plano = plano.filter(Boolean);
			
				puntosnuevos=plano[0];
				
			
				
				var objeto = plano.map(function (plane){
					if (plane.name==nombre){

						return plane.points
					}

				}
				)
				objeto = objeto.filter(Boolean);

				objeto=objeto[0];
				
				var canvas = document.getElementById("blueprintDraw");
				var ctx = canvas.getContext("2d");
				
				
				
				canvas.width=canvas.width;
				
				ctx.moveTo(0,0);

				objeto.map(function (punto){
					var x = punto.x;
					var y = punto.y;
					ctx.lineTo(x,y);
					
					
					
				})
				ctx.stroke();
				
			}
			
		}
		
	};
	
	var porAutorYNombre = function(c){
		var name =  document.getElementById("planombre"+c).innerText ;
		var author = document.getElementById("author").value;
		document.getElementById("planename").innerHTML = name;
		planodesplegado = true;
		apiclient.getBlueprintsByNameAndAuthor(author,name,graficador);
		
	};
	
	
	
	var porAutor = function(){
			author = document.getElementById("author").value;
			document.getElementById("bpname").innerHTML = author;
			apiclient.getBlueprintsByAuthor(author,mapeador);
		};
	
	
	 var getOffset = function (obj) {
          var offsetLeft = 0;
          var offsetTop = 0;
          do {
            if (!isNaN(obj.offsetLeft)) {
                offsetLeft += obj.offsetLeft;
            }
            if (!isNaN(obj.offsetTop)) {
                offsetTop += obj.offsetTop;
            }   
          } while(obj = obj.offsetParent );
          return {left: offsetLeft, top: offsetTop};
      } 
	
	var puedepintar = function(){
		return planodesplegado;
		
	}
	
	//function to initialize application
    var init = function(){
		var canvas = document.getElementById("blueprintDraw");
		var ctx = canvas.getContext("2d");
      console.info('initialized');
       var offset  = getOffset(canvas);
      //if PointerEvent is suppported by the browser:
	  
      if(window.PointerEvent ) {
		  
			canvas.addEventListener("pointerdown", function(event){
				
				if(planodesplegado){
				
					ctx.fillRect(event.pageX-offset["left"],event.pageY-offset["top"],5,5);
					var punto = {"x":event.pageX-offset["left"],"y":event.pageY-offset["top"]};
					puntosnuevos.points.push(punto);
				}
			});
      }
      else {
        canvas.addEventListener("mousedown", function(event){
                    alert('mousedown at '+event.clientX+','+event.clientY);  

          }
        );
      }
    }
	
	
	var actualizarPlano = function(){
		var author = document.getElementById("author").value;
		var name =  document.getElementById("planename").innerText ;
		updateBlueprint().then(blueprintGet);
		puntosnuevos={author: null,name: null,points: []};
		
	};
	
	
	
	
	var updateBlueprint = function () {
		var author = document.getElementById("author").value;
		var name =  document.getElementById("planename").innerText ;
		
		
        var putPromise = $.ajax({
            url: "http://localhost:8080/blueprints/"+author+"/"+name,
            type: 'PUT',    
            data: JSON.stringify(puntosnuevos),
            contentType: 'application/json',
        });

        putPromise.then(
                function () {
                    console.info("OK");
                },
                function () {
                    console.info("ERROR");
                }

        );

        return putPromise;
    };

    var blueprintGet = function () {
		var author = document.getElementById("author").value;
		var name =  document.getElementById("planename").innerText ;
        var promise = $.get("http://localhost:8080/blueprints/"+author);

        promise.then(
                function (data) {
					
                   mapeador(data);
				   apiclient.getBlueprintsByNameAndAuthor(author,name,graficador);
					
                },
                function () {
                    alert("$.get failed!");
                }
        );

        return promise;
    };
	
	var newBlueprintName = function ()
	{
		if (document.getElementById("bpname").innerText!=""){
			var opcion = prompt("New Blueprint Name:", "");
			document.getElementById("planename").innerHTML = opcion;
			 newBlueprint(opcion).then(blueprintGet);
			
		}
		else
		{
			alert("Debe de haber un autor al que asignarle el Blueprint");
		}
		
		

	};
	
	
	
	var newBlueprint = function (nombre) {
		var autor = document.getElementById("author").value;

		var nuevoplano={author: autor,name: nombre,points: []};

		
		
        var putPromise = $.ajax({
            url: "http://localhost:8080/blueprints/",
            type: 'POST',    
            data: JSON.stringify(nuevoplano),
            contentType: 'application/json',
        });

        putPromise.then(
                function () {
                    console.info("OK");
                },
                function () {
                    console.info("ERROR");
                }

        );

        return putPromise;
    };
	
	
	
	var deletePlano = function(){
		var author = document.getElementById("author").value;
		var name =  document.getElementById("planename").innerText ;
		alert(JSON.stringify(puntosnuevos));
		var deletePromise = $.ajax({
            url: "http://localhost:8080/blueprints/"+author+"/"+name,
            type: 'DELETE',  
			data: JSON.stringify(puntosnuevos),
            contentType: 'application/json',
        });

        deletePromise.then(
                function () {
                    console.info("OK");
                },
                function () {
                    console.info("ERROR");
                }

        );

        return deletePromise;
	};
	
	var borrarPlano = function(){
		deletePlano().then(blueprintGet);
		
	};
	
	
	return {
		porAutor: porAutor,
		porAutorYNombre: porAutorYNombre,
		init: init,
		actualizarPlano: actualizarPlano,
		newBlueprintName: newBlueprintName,
		borrarPlano: borrarPlano
	};
})();