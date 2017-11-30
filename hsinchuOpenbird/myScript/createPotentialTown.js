var town_properties = [
"C_Name",
"County_ID",
"OBJECTID",
"T_Name",
"Town_ID",
"x",
"y"
];

var basicValue = ["closed_rat","rec_a_2017","pop_pr","ccn_pr","rent_pr","dependency","childhood","adult","elderly","bet_pr"];

var propertyChar;
var pr_list = {};
for(var i=0;i<basicValue.length;i++){
	pr_list[ basicValue[i] ] = [];
};

var property_chinese = {
	"closed_rat":"歇業率",
	"rec_a_2017":"消費金額指數",
	"pop_pr":"人口數PR值",
	"ccn_pr":"開業數PR值",
	"rent_pr":"租金PR值",
	"dependency":"扶養比",
	"childhood":"幼年人口比",
	"adult":"壯年人口比",
	"elderly":"老年人口比",
	"bet_pr":"路網連結度PR值"
};

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

var right_rectangle_list = [];

function createTownPolygon(boundary,source_properties,mape_type) {
		var town = new google.maps.Polygon({
            paths:boundary,
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
        
		google.maps.event.addListener(town,"mouseover",function(){
	        town.setOptions({
	            strokeColor : "#FF0000",
	            strokeWeight: 2,
		        fillOpacity:0.3
	        });
	
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
			
	    });
		
        google.maps.event.addListener(town, "click", function() { 

			map.setOptions({
                zoom: 13,
                center: {lat: town.properties["y"], lng:town.properties["x"]}
            });
			
			$.ajax({
                url:"https://togetherhoo.github.io/JS/geojson/hexagon" + town.properties["Town_ID"] + ".json",
	            async: false,
                type:"GET",
                dataType: "json",
                success: function(Adata){
                    jdata = Adata;
	            },
	            error:function(){
                },
            });
			$(".right_panel").css("opacity","1");
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

function createRecs(mape_type){       
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
    for (var i=0;i<jrec_len;i++){
        rec = createRectangle(mape_type,bounds[i],jrec[i].properties,map);
		
		
		var basicValue_len = basicValue.length;
		for( var k=0;k<basicValue_len;k++){
			pr_list[ basicValue[k] ].push(rec.properties[ basicValue[k] ]);
		};
    };
};
 
 
 function createRectangle(map_type,boundary,source_properties) {

		var rectangle = new google.maps.Polygon({
            paths:boundary,
		    strokeColor: "#000",
            strokeOpacity: 1.0,
            strokeWeight: 0.5,
		    fillColor:"#000",
			fillOpacity:0,
		    map:map
	    });
		basicValue_len = basicValue.length;
		rectangle.properties={};
		for(var i = 0 ; i < basicValue_len ; i++){
			rectangle.properties[basicValue[i]] = source_properties[basicValue[i]];
			var year = String(basicValue[i].substring(1,5));
			if (year == "1990"){
				rectangle.properties["all_year"][year][basicValue[i].substring(5,basicValue[i].length)] = source_properties[basicValue[i]];
			};
		};
		
		rec_object_list.push(rectangle);
        /*
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
        });
		*/
    return rectangle;  
}