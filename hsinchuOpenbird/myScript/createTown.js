var town_properties = [
"C_Name",
"County_ID",
"OBJECTID",
"T_Name",
"Town_ID",
"x",
"y"
];

var basicValue = ["comm_num","closed_rat","period_mea","population","betweeness","rent_mean","rec_a_2017","pop_pr","ccn_pr"];
var propertyChar;
var pr_list = {};
for(var i=0;i<basicValue.length;i++){
	pr_list[ basicValue[i] ] = [];
};

var property_chinese = {
    "comm_num":"商業登記家數",
	"closed_rat":"歇業率",
	"period_mea":"歇業平均店齡",
	"population":"人口數",
	"betweeness":"路網連結性",
	"rent_mean":"平均租金",
	"rec_a_2017":"消費金額指數",
	"pop_pr":"人口數PR值",
	"ccn_pr":"開業數PR值"
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
		pr_list["comm_num"].push(rec.properties["comm_num"]);
		pr_list["period_mea"].push(rec.properties["period_mea"]);
		pr_list["population"].push(rec.properties["population"]);
		pr_list["closed_rat"].push(rec.properties["closed_rat"]);
		pr_list["betweeness"].push(rec.properties["betweeness"]);
		pr_list["rent_mean"].push(rec.properties["rent_mean"]);
		pr_list["rec_a_2017"].push(rec.properties["rec_a_2017"]);
		pr_list["pop_pr"].push(rec.properties["pop_pr"]);
		pr_list["ccn_pr"].push(rec.properties["ccn_pr"]);
    };
	
	
	comm_nummax = d3.max(pr_list["comm_num"]);
	closed_ratmax = d3.max(pr_list["closed_rat"]);
	//period_meamax = d3.max(pr_list["period_mea"]);
	period_meamax = 54;
	populationmax = d3.max(pr_list["population"]);
	betweenessmax = d3.max(pr_list["betweeness"]);
	rent_meanmax = d3.max(pr_list["rent_mean"]);
	rec_a_2017max = d3.max(pr_list["rec_a_2017"]);
	
	comm_nummean = d3.mean(pr_list["comm_num"]);
	closed_ratmean = d3.mean(pr_list["closed_rat"]);
	period_meamean = d3.mean(pr_list["period_mea"]);
	populationmean = d3.mean(pr_list["population"]);
	betweenessmean = d3.mean(pr_list["betweeness"]);
	rent_meanmean = d3.mean(pr_list["rent_mean"]);
	rec_a_2017mean = d3.mean(pr_list["rec_a_2017"]);
	
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
		
		rectangle.properties = {"all_year":{"1990":{}}};
		basicValue_len = basicValue.length;
		
		for(var i = 0 ; i < basicValue_len ; i++){
			rectangle.properties[basicValue[i]] = source_properties[basicValue[i]];
			var year = String(basicValue[i].substring(1,5));
			if (year == "1990"){
				rectangle.properties["all_year"][year][basicValue[i].substring(5,basicValue[i].length)] = source_properties[basicValue[i]];
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
            
			//console.log("rectangle.properties: ",rectangle.properties );
			
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
    return rectangle;  
}