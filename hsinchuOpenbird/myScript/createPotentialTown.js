var town_properties = [
"C_Name",
"County_ID",
"OBJECTID",
"T_Name",
"Town_ID",
"x",
"y"
];

//var basicValue = ["comm_num","closed_rat","period_mea","population","betweeness","rent_mean","rec_a_2017","pop_pr","ccn_pr"];
var basicValue = ["closed_rat","rec_a_2017","pop_pr","ccn_pr","rent_pr","dependency","childhood","adult","elderly","bet_pr"];

/*
"aging_inde": 35.7142857143,
        "dependency": 17.1428571429,
        "childhood": 7.44680851065,
        "adult": 87.2340425532,
        "elderly": 5.31914893615,
        "rec_n_2014": 99,
        "rec_a_2014": 29,
        "rec_c_2014": "零售業",
        "rec_n_2015": 30,
        "rec_a_2015": 30,
        "rec_c_2015": "零售業",
        "rec_n_2016": 0,
        "rec_a_2016": 0,
        "rec_c_2016": "",
        "rec_n_2017": 30,
        "rec_a_2017": 29,
        "rec_c_2017": "零售業"
*/

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
		/*
		pr_list["closed_rat"].push(rec.properties["closed_rat"]);
		pr_list["rec_a_2017"].push(rec.properties["rec_a_2017"]);
		pr_list["pop_pr"].push(rec.properties["pop_pr"]);
		pr_list["ccn_pr"].push(rec.properties["ccn_pr"]);
		pr_list["rent_pr"].push(rec.properties["rent_pr"]);
		pr_list["rent_pr"].push(rec.properties["rent_pr"]);
		*/
		/*
		pr_list["comm_num"].push(rec.properties["comm_num"]);
		pr_list["period_mea"].push(rec.properties["period_mea"]);
		pr_list["population"].push(rec.properties["population"]);
		pr_list["closed_rat"].push(rec.properties["closed_rat"]);
		pr_list["betweeness"].push(rec.properties["betweeness"]);
		pr_list["rent_mean"].push(rec.properties["rent_mean"]);
		pr_list["rec_a_2017"].push(rec.properties["rec_a_2017"]);
		pr_list["pop_pr"].push(rec.properties["pop_pr"]);
		pr_list["ccn_pr"].push(rec.properties["ccn_pr"]);
		*/
    };
	
	/*
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
	*/
	
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