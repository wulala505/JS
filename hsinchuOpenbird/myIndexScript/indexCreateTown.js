var town_properties = [
"C_Name",
"County_ID",
"OBJECTID",
"T_Name",
"Town_ID",
"x",
"y"
];

var basicValue = ["comm_num","closed_rat","population","betweeness","rent_mean","rec_a_2017"];
var propertyChar;
var pr_list = {};
for(var i=0;i<basicValue.length;i++){
	pr_list[ basicValue[i] ] = [];
};

var property_chinese = {
    "comm_num":"商業登記家數",
	"closed_rat":"歇業率",
	//"period_mea":"歇業平均店齡",
	"population":"人口數",
	"betweeness":"路網連結性",
	"rent_mean":"平均租金",
	"rec_a_2017":"消費金額指數"
};

var jdata;
var rec_object_list = [];
var town_object_list = [];
var bounds=[];

function createTowns(mape_type,map){
    var jrec = hsinchu_towns.features;
    var jrec_len = hsinchu_towns.features.length;
    for (var i=0;i<jrec_len;i++){
        town = createTownPolygon(town_bounds[i],jrec[i].properties,mape_type,map);
    };
};

var right_rectangle_list = [];

function createTownPolygon(boundary,source_properties,mape_type,map) {
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
			        createRecs("yearly",map);
			    	break;
			    case "potential":
			        createRecs("potential",map)
			};
        });
    return town;  
};

function createRecs(mape_type,map){       
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
		//pr_list["period_mea"].push(rec.properties["period_mea"]);
		pr_list["population"].push(rec.properties["population"]);
		pr_list["closed_rat"].push(rec.properties["closed_rat"]);
		pr_list["betweeness"].push(rec.properties["betweeness"]);
		pr_list["rent_mean"].push(rec.properties["rent_mean"]);
		pr_list["rec_a_2017"].push(rec.properties["rec_a_2017"]);

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
	//period_meamean = d3.mean(pr_list["period_mea"]);
	populationmean = d3.mean(pr_list["population"]);
	betweenessmean = d3.mean(pr_list["betweeness"]);
	rent_meanmean = d3.mean(pr_list["rent_mean"]);
	rec_a_2017mean = d3.mean(pr_list["rec_a_2017"]);
	
};
 
 
 function createRectangle(map_type,boundary,source_properties,map) {

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
			//////////////////Start setting right map////////////////////
			var lat_list = [];
			var lng_list = [];
			for (i=0;i<7;i++){
				lat_list.push(rectangle.getPaths().getAt(0).getAt(i).lat());
				lng_list.push(rectangle.getPaths().getAt(0).getAt(i).lng());
			};
			
			right_map.setOptions({ 
                zoom: 17,
                center: {lat: d3.mean(lat_list), lng:d3.mean(lng_list)}
			});
			
			if (right_rectangle_list.length == 1){
				right_rectangle_list[0].setOptions({
					map:null
				});
				right_rectangle_list = [];
			};
			
			var right_rectangle = new google.maps.Polygon({
                paths:boundary,
		        strokeColor: "#000",
                strokeOpacity: 1.0,
                strokeWeight: 5,
		        fillColor:"#000",
			    fillOpacity:0,
		        map:right_map
	        });
			right_rectangle_list.push(right_rectangle);
			//////////////////End setting right map////////////////////
			createInfo(rectangle);
			//console.log("this rectangle: ",rectangle);
			
			/////////////////////////////////////////////////////////////
        });
    return rectangle;  
}

function createInfo(rectangle){
	$("#right-map-stat-info").text("");
	$("#right-map-info").text("");
	var info_str = "";
	var rank;
	var pr;
	var maxValue;
    var meanValue;
	
	for(var i =0;i<basicValue.length;i++){
        var propertyValue = parseInt(rectangle.properties[ basicValue[i] ]);
		propertyChar = property_chinese[ basicValue[i] ];
		console.log(propertyChar);
        switch (basicValue[i]){
	    	case "comm_num":
			    maxValue = comm_nummax;
				meanValue = comm_nummean;
			    pr = 100 * propertyValue / maxValue;
				break;
	    	case "closed_rat":
			    maxValue = closed_ratmax;
				meanValue = closed_ratmean;
			    pr = 100 * propertyValue / maxValue;
				break;
	    	case "period_mea":
			    maxValue = period_meamax;
				meanValue = period_meamean;
				if (propertyValue == 9999){
					pr = 0;
				}
				else {
			        pr = 100 * propertyValue / maxValue;
				}
				break;
	    	case "population":
			    maxValue = populationmax;
				meanValue = populationmean;
			    pr = 100 * propertyValue / maxValue;
				break;
			case "betweeness":
			    maxValue = betweenessmax;
				meanValue = betweenessmean;
			    pr = 100 * propertyValue / maxValue;
				break;
			case "rent_mean":
			    maxValue = rent_meanmax;
				meanValue = rent_meanmean;
			    pr = 100 * propertyValue / maxValue;
				break;
			case "rec_a_2017":
			    maxValue = rec_a_2017max;
				meanValue = rec_a_2017mean;
			    pr = 100 * propertyValue / maxValue;
				break;
	        };
		
        info_str = "";
	    info_str +=  '<div class="bar_base_div"' + 'id="base_' + basicValue[i] + '" ' +  ' onclick="stat_info(this,propertyChar' + ',' + propertyValue + ',' + maxValue + ',' + meanValue + ')">';
	    info_str +=    '<div class="col-md-3">' + property_chinese[ basicValue[i] ] + '</div>' ;
	    info_str +=    '<div class="col-md-9" style="padding-left:5px;">';
	    info_str +=      '<div class="col-md-6">';
	    info_str +=        '<div class= "index_bar_color" id="id_' + basicValue[i] + '">' + '</div>';
	    info_str +=      '</div>';
		if (propertyValue ==9999 && basicValue[i] =="period_mea"){
			info_str +=      '<div class="col-md-6">' + '無店家歇業';
		}
		else{
		    info_str +=      '<div class="col-md-6">' + propertyValue.toFixed(2);
	    }
		info_str +=      '</div>';
	    info_str +=    '</div>';
	    info_str +=  '</div>';
	    
	    $("#right-map-info").append(info_str);
	    
	    var max_width = parseInt(pr);
	    var elem_id = "id_" + basicValue[i];
	    myMove(elem_id,max_width);
	};
	//myMove(elem_id,max_width);
		function myMove(elem_id,max_width) {
            var elem = document.getElementById(elem_id);	
            var bar_width = 0;
            var id = setInterval(frame, 5);
            
			function frame() {
	            if (max_width == 0){
		            elem.style.width = '1%';
		        }
		        else{
                    if (bar_width >= max_width) {
                        clearInterval(id);
                    } 
					else {
                        bar_width++; 
                        elem.style.width = bar_width + '%'; 
                    }
		        }
            }
		};
};

function stat_info(e,propertyChar,propertyValue,maxValue,meanValue){
	$("#right-map-stat-info").text("");
	$(".bar_base_div").css("color","black");
	var this_id = "#" + e.id;
	$(this_id).css("color","RGB(255, 99, 132)");
	console.log($(this_id).children("#id_period_mea").innerHTML);
	console.log($(this_id).innerHTML);
	//console.log("propertyChar: ",propertyChar);
	var stat_info_str="";
	stat_info_str += '<div>';
	//stat_info_str += '<div>' + propertyChar + '</br>';
	//stat_info_str += '平均值: ' + meanValue.toFixed(2) + '</br>';
	if(propertyValue == 9999){
		stat_info_str += '此網格: 無店家歇業' + '</br>';
	}
	else{
	    stat_info_str += '此網格: ' + propertyValue.toFixed(2) + '</br>';
	}
	stat_info_str += '最大值: ' + maxValue.toFixed(2) + '</br>';
	stat_info_str += '</div>'
	$("#right-map-stat-info").append(stat_info_str);
};