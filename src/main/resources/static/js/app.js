var Module =( function (){
	
	var sumaDePuntos = function(total,num){
		return total+num;
	};
	
	var mapeador = function(plano){
		if(plano){
				
				
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
		apiclient.getBlueprintsByNameAndAuthor(author,name,graficador);
	};
	
	
	
	var porAutor = function(){
			author = document.getElementById("author").value;
			document.getElementById("bpname").innerHTML = author;
			apiclient.getBlueprintsByAuthor(author,mapeador);
		};
	
	return {
		porAutor: porAutor,
		porAutorYNombre: porAutorYNombre
	};
})();