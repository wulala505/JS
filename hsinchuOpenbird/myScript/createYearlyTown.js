var town_properties = [
"C_Name",
"County_ID",
"OBJECTID",
"T_Name",
"Town_ID",
"x",
"y"
];

var jdata;
var rec_object_list = [];
var town_object_list = [];
var bounds=[];

function createTowns(mape_type){
    var jrec = hsinchu_towns.features;
    var jrec_len = hsinchu_towns.features.length;
    for (var i=0;i<jrec_len;i++){
        town = createTownPolygon(town_bounds[i],jrec[i].properties,mape_type);
    };
};
	
function createTownPolygon(boundary,source_properties,mape_type) {
		var town = new google.maps.Polygon({
            paths:boundary,
			//labelContent:"sdgdfhd",
			//labelStyle: {opacity: 1.0},
			//labelAnchor: new google.maps.Point(24,120),
		    strokeColor: "#000",
            strokeOpacity: 1.0,
            strokeWeight: 0.5,
		    fillColor:"RGB(111,203,218)",
			fillOpacity:0,
		    map:map
	    });
		
		town.properties = {}
		for (var i =0;i < town_properties.length;i++){
			town.properties[town_properties[i]] = source_properties[town_properties[i]];
		};
		town_object_list.push(town);
		
		/*
		town.infoWindow = new google.maps.InfoWindow({
		    content: '<div class="infoWindow">' + town.properties["T_Name"] +  '</div>',
	    });
		*/

		google.maps.event.addListener(town,"mouseover",function(){
	        town.setOptions({
	            strokeColor : "#FF0000",
	            strokeWeight: 2,
		        fillOpacity:0.3
	        });
			/*
			var latLng = {lat:town.properties["y"],lng:town.properties["x"]};
		    town.infoWindow.setPosition(latLng);
		    town.infoWindow.open(map);
            */			
	    });
		
	    google.maps.event.addListener(town,"mouseout",function(){
	        town.setOptions({
	                strokeColor : "#000",
	                strokeWeight: 0.5
	            });
			if (town.fillColor != "RGB(246,197,85)"){
				town.setOptions({
	    		    fillOpacity:0
	            });    
			};
			//town.infoWindow.close();
			
	    });
		
        google.maps.event.addListener(town, "click", function() { 
			clear_all();
			map.setOptions({
                zoom: 13,
                center: {lat: town.properties["y"], lng:town.properties["x"]}
            });
			
			//console.log("https://togetherhoo.github.io/JS/geojson/hexagon" + town.properties["Town_ID"] + ".json");
			
			$.ajax({
                //url:"https://togetherhoo.github.io/JS/geojson/hexagon" + town.properties["Town_ID"] + ".json",
				url:"https://togetherhoo.github.io/JS/geojson/wen3.json",
	            async: false,
                type:"GET",
                dataType: "json",
                success: function(Adata){
                    jdata = Adata;
					//console.log(jdata)
	            },
	            error:function(){
                },
            });
			//console.log(town.properties);
			town_object_list.forEach((val) => {
	    	    val.setMap(null);
	    	});
			switch(mape_type){
	    	    case "yearly":
			        createRecs("yearly");
			    	break;
			    case "potential":
			        createRecs("potential")
			};
        });
    return town;  
};

var all_properties = [
	"main2011",
	"main2012",
	"main2013",
	"main2014",
	"main2015",
	"main2016",
	
	"main2011value",
	"main2012value",
	"main2013value",
	"main2014value",
	"main2015value",
	"main2016value",

	"K2011A101",
	"K2011A102",
	"K2011A103",
	"K2011A104",
	
	"K2012A101",
	"K2012A102",
	"K2012A103",
	"K2012A104",
	
	"K2013A101",
	"K2013A102",
	"K2013A103",
	"K2013A104",
	
	"K2014A101",
	"K2014A102",
	"K2014A103",
	"K2014A104",
	
	"K2015A101",
	"K2015A102",
	"K2015A103",
	"K2015A104",
	
	"K2016A101",
	"K2016A102",
	"K2016A103",
	"K2016A104"
	];
	
var property_chinese = {
    "A101":"餐飲業",
	"A102":"輕工業",
	"A103":"重工業",
	"A104":"資訊業"
};

var industry_color = {
	"A101":"rgb(255, 99, 132)",
	"A102":"rgb(75, 192, 192)",
	"A103":"rgb(153, 102, 255)",
	"A104":"rgb(54, 162, 235)"
};

var main_industry_col = {
	"2011":"main2011",
	"2012":"main2012",
	"2013":"main2013",
	"2014":"main2014",
	"2015":"main2015",
	"2016":"main2016"
};

var year_list = ["2011","2012","2013","2014","2015","2016"];

var all_year_data = {};

function createRecs(mape_type){       
	population_list = [];
    households_list = [];
	
	var coord;
    var bounds=[];
    for (var i=0;i < jdata.features.length; i++){
	    var bound = [];
	    for (var j=0;j<jdata.features[i].geometry.coordinates[0].length;j++){
	        coord = jdata.features[i].geometry.coordinates[0][j];
		    bound.push({lat:coord[1],lng:coord[0]});
	    };
	    bounds.push(bound);
    };
		
	var jrec = jdata.features;
    var jrec_len = jdata.features.length;
	//console.log(jrec[27]);
	//console.log(jrec[28]);
    for (var i=0;i<jrec_len;i++){
		//console.log("jrec[i]: ",i ,jrec[i]);
        rec = createRectangle(mape_type,bounds[i],jrec[i].properties);
		//population_list.push(rec.properties["population"]);
		//households_list.push(rec.properties["households"]);
		//console.log(i, "rec: ",rec);
    };
	
	//population_list = population_list.sort(function(b,a){return a-b});
	//households_list = households_list.sort(function(b,a){return a-b});
};
 
 
 function createRectangle(map_type,boundary,source_properties) {
		/*
		console.log("map_type: ",map_type);
		console.log("boundary: ",boundary);
		console.log("source_properties: ",source_properties);
		console.log("jdata: ",jdata);
		*/
		var rectangle = new google.maps.Polygon({
            paths:boundary,
		    strokeColor: "#000",
            strokeOpacity: 1.0,
            strokeWeight: 0.5,
		    fillColor:"#000",
			fillOpacity:0,
		    map:map
	    });
		
		//console.log("rectangle: ",rectangle);
		
		rectangle.properties = {
			"all_year":{
				"2011":{},
				"2012":{},
				"2013":{},
				"2014":{},
				"2015":{},
				"2016":{}			
			}
		};
		
		all_properties_len = all_properties.length;
		for(var i = 0 ; i < all_properties_len ; i++){
			rectangle.properties[all_properties[i]] = source_properties[all_properties[i]];
			//console.log(all_properties[i].substring(1,5));
			var year = String(all_properties[i].substring(1,5));
			//if (year == "1990"){
			if(year >= 2011 && year <=2016 ){
				//console.log('rectangle.properties: ',rectangle.properties);
				//console.log('rectangle.properties["all_year"][year.toString()]: ',[year.toString()]);
				rectangle.properties["all_year"][year.toString()][all_properties[i].substring(5,all_properties[i].length)] = source_properties[all_properties[i]];
				//console.log("rectangle.properties:",rectangle.properties);
			//};
			};
		};
		
		rec_object_list.push(rectangle);

		google.maps.event.addListener(rectangle,"mouseover",function(){
	    rectangle.setOptions({
	    strokeColor : "#FF0000",
	    strokeWeight: 2,
		fillOpacity:0.3
	    });
	    });
	    google.maps.event.addListener(rectangle,"mouseout",function(){
	        rectangle.setOptions({
	                strokeColor : "#000",
	                strokeWeight: 0.5
	            });
			if (rectangle.fillColor != "RGB(246,197,85)"){
				rectangle.setOptions({
	    		    fillOpacity:0
	            });    
			};
			
	    });
        google.maps.event.addListener(rectangle, "click", function() { 
            rec_object_list.forEach((val) => {
	    	    val.setOptions({
	    		    fillColor:"#000",
	    			fillOpacity:0
	    		});
	    	});
	    	rectangle.setOptions({
	            strokeColor : "#000",
				strokeWeight: 0.5,
				fillColor:"RGB(246,197,85)",
	    		fillOpacity:0.6
	        });
	    	clear_all();
			switch(map_type){
	    	    case "potential":
			        createMessagePotential(rectangle);
					break;
				case "yearly":
				    all_year_data = rectangle.properties["all_year"];
					//console.log("all_year_data: ",all_year_data);
				    createMessageYearly(rectangle);
					//set_doughnut_data(rectangle);
			}
						
        });
    return rectangle;  
}

function CellVsAvg(avg,cellvalue){
	this.avg = avg;
	this.cellvalue = cellvalue;
};
	
function createMessageYearly(rectangle){
	$("#bar_area").text("");
	$("#bar_area").append('<div>歷年主要產業</div>');
	year_list.forEach((year)=>{
		var elem_id = "#main" + year;
		var html_str = "";
		html_str +=  '<div class="bar_base_div" onclick="chart_js_doughnut(doughnutData,' + year + ')">';
		html_str +=    '<div class="col-md-2">' + year + '</div>' ;
		html_str +=    '<div class="col-md-10">';
		html_str +=      '<div class="col-md-6">';
		html_str +=        '<div class= "bar_color" id="' + "main" + year + '">' + '</div>';
		html_str +=      '</div>';
		html_str +=      '<div class="col-md-6">' + property_chinese [ rectangle.properties["main" + year].substring(5,9) ];
		
		console.log(rectangle.properties["main" + year] );
		console.log("rectangle: ",rectangle);
		
		html_str +=      '</div>';
		html_str +=    '</div>';
		html_str +=  '</div>';
		$("#bar_area").append(html_str);
	    var elem_id = "main" + year;
		var max_width = parseInt((rectangle.properties["main" + year + "value"]) * 100);
		console.log("elem_id: ",elem_id,'rectangle.properties["main" + year + "value"] :',rectangle.properties["main" + year + "value"],"max_width: ",max_width);
		
		console.log("rectangle.properties: ",rectangle.properties);
		//console.log("max_width: ",max_width);
		
	    myMove(elem_id,max_width);
		function myMove(elem_id,max_width) {
            var elem = document.getElementById(elem_id);	
            var bar_width = 0;
            var id = setInterval(frame, 5);
            
			function frame() {
	            if (max_width == 0){
		            elem.style.width = '1%';
		        }
		        else{
                    if (bar_width == max_width) {
                        clearInterval(id);
                    } 
					else {
                        bar_width++; 
                        elem.style.width = bar_width + '%'; 
                    }
		        }
            }
		}
		});
	};
