var jdata;
var cood;
var bounds=[];
var town_object_list = [];
var farm_object_list = [];
var town,farm;
var farm_on_small_map_list =[];

$.ajax({
     url:"https://togetherhoo.github.io/JS/UCCUjsonfile/tainan_town.json",
	 async: false,
     type:"GET",
     dataType: "json",
     success: function(Adata){
         tainan_town = Adata;
	 },
	 error:function(){
     },
});

var earth_property= {
	    'sintai' : {
		           'range':  [1,21],
		           'label':   ['沖積土','紅壤(鐵錳結核 < 60 cm)'],
				   'chinese':'土壤形態'
		},
        'drainage' : {
			'range':  [1,2,3],
		    'label':   ['良好','不完全','不良'],
			'chinese':'排水等級'
		},
        'shyrhui' : {
		'range':  [3,13,15],
		'label':    ['石灰性','石灰結核','無'],
		'chinese':'石灰性'
		},
        'slope' : {
		'range':  [1,2,3,4,5,6,8],
		'label':   ['0%～5%','5%～15%','15%～30%','30%～40%','40%～55%','55%以上',''],
		'chinese':'坡度'
		},
        'ph' : {
		'range':  [3,4,5,6,7,8],
		'label':    ['5.1～5.5(強酸性)','5.6～6.0(中酸性)','6.1～6.5(微酸性)','6.6～7.3(中性)','7.4～7.8(微鹼性)','7.9～8.4(中鹼性)'],
		'chinese':'表土酸鹼度'
		},
        'geo1' : {
		'range':  [2,3,4,5,6,8],
		'label':    ['細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','壤土','粘壤土，坋質粘壤土'],
		'chinese':'第一層質地'
		},
        'geo2' : {
		'range':  [1,3,4,5,6,8,9],
		'label':    ['粗砂土，砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','壤土','粘壤土，坋質粘壤土','坋質粘土'],
		'chinese':'第二層質地'
		},
        'geo3' : {
		'range':  [1,2,3,4,5,8,9,11],
		'label':    ['粗砂土，砂土','細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','粘壤土，坋質粘壤土','坋質粘土','石礫'],
		'chinese':'第三層質地'
		},
        'geo4' : {
		'range':  [1,2,3,4,5,8,9,11],
		'label':    ['粗砂土，砂土','細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','粘壤土，坋質粘壤土','坋質粘土','石礫'],
		'chinese':'第四層質地'
		},
        'adm' : {
		'range':  ['Y2a','T1a','Y1a','T2a','T2b','L2a','T3a','L3a','L2b','T1b','Y3a','L3b','T3b','L4a','L1b','L5a','T4a','L1a','Y4a','L4b','T4b'],
		'label':   ['低地石灰性細質地排水良好沖積土',
		              '低地石灰性細質地排水不完全沖積土',					  
					  '低地石灰性中質地排水良好沖積土',
		              '低地石灰性中質地排水不完全沖積土',
					  
					  '低地石灰性中粗質地排水良好沖積土',
					  '低地石灰性中粗質地排水不完全沖積土',
					  
					  '低地石灰性粗質地排水良好沖積土',
					  '低地石灰性粗質地不完全沖積土',
					  
					  '低地石灰性淺層排水良好沖積土',
					  
					  
					  '低台地細質地排水良好沖積土',
					  '低台地細質地排水不完全沖積土',
					  
					  '低台地中質地排水良好沖積土',
					  '低台地中質地排水不完全沖積土',
					  
					  '低台地中粗質地排水良好沖積土',
					  '低台地中粗質地排水不完全沖積土',
					  '低台地粗質地排水良好沖積土',
					  '低台地粗質地排水不完全沖積土',
					  
					  '細質地排水良好老沖積土',
					  '中質地排水良好老沖積土',
					  '中粗質地排水良好老沖積土',
					  '粗質地排水良好老沖積土'],
		'chinese':'管理組別'
		}
    };

var earthChinese={
    'Shape_Area':'面積',
	'mother':'母質種類',
	'tesin':'土壤特性',
	'sintai':'土壤形態',
	'drainage':'排水等級',
	'shyrhui':'石灰性',
	'slope':'坡度',
	'ph':'表土酸鹼度',
	'geo1':'第一層質地(0~30cm)',
	'geo2':'第二層質地(30~60cm)',
	'geo3':'第三層質地(60~90cm)',
	'geo4':'第四層質地(90~150cm)',
	'adm':'管理組別',
	'land_num' : '地籍址(代碼)',
    'land_numC' :'地籍址',
    'now_use' : '使用現況',
    'urban_use' : '都市土地使用分區',
    'Nurban_use' : '非都市土地使用'
};

function draw_polygon(jdata,poly_type){
    for (var i=0;i < jdata.features.length; i++){
    	var bound= [];
    	for (var j=0;j<jdata.features[i].geometry.coordinates[0].length;j++){
    	    coord = jdata.features[i].geometry.coordinates[0][j];
    		bound.push({lat:coord[1],lng:coord[0]});
    	};
		switch(poly_type){
			case "town":
			    town = createPolygon(jdata.features[i],bound,poly_type);
		        town_object_list.push(town);
				break;
			case "farm":
			    farm = createPolygon(jdata.features[i],bound,poly_type);
		        farm_object_list.push(farm);
				break;
		};
		
    };
}

function createPolygon(data,bound,poly_type){
	var poly = new google.maps.Polygon({
                paths:bound,
    		    strokeColor: "#000",
                strokeOpacity: 1.0,
                strokeWeight: 0.5,
    		    fillColor:"RGB(111,203,218)",
    			fillOpacity:0,
    		    map:map
    	    });
		poly.properties = {}
		for(var key in data.properties){
			poly.properties[key] = data.properties[key];
		}
		google.maps.event.addListener(poly,"mouseover",function(){
	        poly.setOptions({
	            strokeColor : "#FF0000",
	            strokeWeight: 2,
		        fillOpacity:0.3
	        });
	    });
		google.maps.event.addListener(poly,"mouseout",function(){
	        poly.setOptions({
	                strokeColor : "#000",
	                strokeWeight: 0.5
	            });
			if (poly.fillColor != "RGB(246,197,85)"){
				poly.setOptions({
	    		    fillOpacity:0
	            });    
			};	
	    });
		
		switch(poly_type){
		case "town":
		    google.maps.event.addListener(poly, "click", function() { 
			    map.setOptions({
                    zoom: 15,
                    //center: {lat: parseFloat(poly.properties["canter_y"]), lng:parseFloat(poly.properties["center_x"])}
					center:{lat:23.160057, lng:120.313162}
                });

			    $.ajax({
			    	//url:"https://togetherhoo.github.io/JS/geojson/DA0136.json",
	                url:"https://togetherhoo.github.io/JS/UCCUjsonfile/shanhua_farm_and_earth.json",
					async: false,
                    type:"GET",
                    dataType: "json",
                    success: function(Adata){
                        farmdata = Adata;
	                },
	                error:function(){
                    },
                });
			    town_object_list.forEach((val) => {
	    	        val.setMap(null);
	    	    });
				draw_polygon(farmdata,"farm");

		    });
		    break;
		case "farm":
		    google.maps.event.addListener(poly, "click", function() {
				
				if (farm_on_small_map_list.length == 1){
				    farm_on_small_map_list[0].setOptions({
					    map:null
				    });
				    farm_on_small_map_list = [];
			    };
				var farm_on_small_map = new google.maps.Polygon({
                    paths:bound,
    		        strokeColor: "#000",
                    strokeOpacity: 1.0,
                    strokeWeight: 0.5,
    		        fillColor:myColor.green,
    			    fillOpacity:0.6,
    		        map:farmMap
    	        });
				farmMap.setOptions({
                    zoom: 17,
					center: {
						lat: farm_on_small_map.qe.Ja.I, 
					    lng:farm_on_small_map.qe.Ja.J
					}
                });
				farm_on_small_map_list.push(farm_on_small_map);
				
				$("#farm-attribute-top").css("opacity",1);
		        $("#farm_attribute_container").text("");
				var farm_attr_str="";
				/*
				farm_attr_str += '<div>面積: ' + poly.properties["Shape_Area"].toFixed(2) + '</div>';
				farm_attr_str += '<div>周長: ' + poly.properties["Shape_Length"].toFixed(2) + '</div>';
				farm_attr_str += '<div>地籍址: ' + poly.properties["地籍址"] + '</div>';
				farm_attr_str += '<div>農盤分類: ' + poly.properties["農盤分類"] + '</div>';
			    */
				for(var key in poly.properties){
					
					if(key == 'sintai'  || key == 'drainage'  || key == 'shyrhui'  || key == 'slope'  || key == 'ph'  || key == 'geo1'  || key == 'geo2'  || key == 'geo3'  || key == 'geo4'  || key == 'adm'){
						var order = earth_property[key].range.indexOf(poly.properties[key]);
						farm_attr_str += '<div>' + earthChinese[key] + ' : ' + earth_property[key].label[order] + '</div>';
						
					}
					else{
						
						farm_attr_str += '<div>' + earthChinese[key] + ' : ' + poly.properties[key] + '</div>';
					}	
				};
				console.log("poly: ",poly);
				$("#farm_attribute_container").append(farm_attr_str);
			});			
		    break;
	};
	return poly;
};
