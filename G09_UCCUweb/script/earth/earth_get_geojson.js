var jdata;
var cood;
var bounds=[];
var earth_object_list = [];
var earth;
var eColor;
var colors_scope;

var d3Color = {
	'sintai':['RGB(182, 211, 97)','RGB(173, 169, 117)'],
	'ph':['rgb(255,215,93)','rgb(205,17,3)'],
	'drainage':['rgb(0,69,116)','rgb(204, 204, 204)'],
	'slope':['rgb(14,63,1)','rgb(120,51,0)'],
	'shyrhui':['rgb(35,0,100)','rgb(204, 204, 204)'],
	'geo1':['rgb(235, 105, 95)','rgb(120,51,0)'],
	'geo2':['rgb(235, 105, 95)','rgb(120,51,0)'],
	'geo3':['rgb(235, 105, 95)','rgb(120,51,0)'],
	'geo4':['rgb(235, 105, 95)','rgb(120,51,0)'],
	'adm':['rgb(235, 105, 95)','rgb(120,51,0)']
};

var categoryColor= [
'#393b79',
'#5254a3',
'#6b6ecf',
'#9c9ede',

'#cedb9c',
'#b5cf6b',
'#8ca252',
'#637939',

'#8c6d31',
'#bd9e39',
'#e7ba52',
'#e7cb94',

'#843c39',
'#ad494a',
'#d6616b',
'#e7969c',

'#7b4173',
'#a55194',
'#ce6dbd',
'#de9ed6',

'#31a354 ',
'#fd8d3c '
];

var myColor = {
    'blue':'rgb(66,186,207)',
	'red':'rgb(221, 53, 45)',
	'grey':'RGB(204, 204, 204)',
	'green':'RGB(182, 211, 97)',
	'light_blue':'RGB(120, 209, 224)',
	'light_red':'RGB(235, 105, 95)',
	'earth':'RGB(173, 169, 117)'
};

var earth_property;
function initiate_earth_property(){
    earth_property= {
	    'sintai' : {
		           'range':  [1,21],
		           'label':   ['沖積土','紅壤(鐵錳結核 < 60 cm)'],
		           'feature':[[],[]]
		},
        'drainage' : {
			'range':  [1,2,3],
		    'label':   ['良好','不完全','不良'],
			'feature':[[],[],[]]
		},
        'shyrhui' : {
		'range':  [3,13,15],
		'label':    ['石灰性','石灰結核','無'],
		'feature':[[],[],[]]
		},
        'slope' : {
		'range':  [1,2,3,4,5,6,8],
		'label':   ['0%～5%','5%～15%','15%～30%','30%～40%','40%～55%','55%以上',''],
		'feature':[[],[],[],[],[],[],[]]
		},
        'ph' : {
		'range':  [3,4,5,6,7,8],
		'label':    ['5.1～5.5(強酸性)','5.6～6.0(中酸性)','6.1～6.5(微酸性)','6.6～7.3(中性)','7.4～7.8(微鹼性)','7.9～8.4(中鹼性)'],
		'feature':[[],[],[],[],[],[]]
		},
        'geo1' : {
		'range':  [2,3,4,5,6,8],
		'label':    ['細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','壤土','粘壤土，坋質粘壤土'],
		'feature': [[],[],[],[],[],[]]
		},
        'geo2' : {
		'range':  [1,3,4,5,6,8,9],
		'label':    ['粗砂土，砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','壤土','粘壤土，坋質粘壤土','坋質粘土'],
		'feature':[[],[],[],[],[],[],[]]
		},
        'geo3' : {
		'range':  [1,2,3,4,5,8,9,11],
		'label':    ['粗砂土，砂土','細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','粘壤土，坋質粘壤土','坋質粘土','石礫'],
		'feature':[[],[],[],[],[],[],[],[]]
		},
        'geo4' : {
		'range':  [1,2,3,4,5,8,9,11],
		'label':    ['粗砂土，砂土','細砂土，壤質粗砂土，壤質砂土','壤質細砂土，粗砂質壤土，砂質壤土，細砂質壤土','極細砂土，壤質極細砂土，極細砂質壤土','坋土，坋質壤土','粘壤土，坋質粘壤土','坋質粘土','石礫'],
		'feature':[[],[],[],[],[],[],[],[]]
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
					  
		'feature':[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
		}
    };
};

var earthChinese={
    'area':'面積',
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
	'adm':'管理組別'
};

$.ajax({
     url:"https://togetherhoo.github.io/JS/UCCUjsonfile/tainan_earth2.json",
	 async: false,
     type:"GET",
     dataType: "json",
     success: function(Adata){
         tainan_earth = Adata;
	 },
	 error:function(){
     },
});

function draw_polygon(jdata){
    for (var i=0;i < jdata.features.length; i++){
    	var bound= [];
    	for (var j=0;j<jdata.features[i].geometry.coordinates[0].length;j++){
    	    coord = jdata.features[i].geometry.coordinates[0][j];
    		bound.push({lat:coord[1],lng:coord[0]});
    	};
		earth = createPolygon(jdata.features[i],bound);
		earth_object_list.push(earth);
    };
	initiate_earth_property();
}

function createPolygon(data,bound){
	var poly = new google.maps.Polygon({
                paths:bound,
    		    //strokeColor: "#000",
                strokeOpacity: 0,
                //strokeWeight: 0.5,	
				fillColor:myColor.green,
				fillOpacity:0.7,
    		    map:map
    	  });
		poly.properties = {}
		for(var key in data.properties){
			poly.properties[key] = data.properties[key];
		}
		
		
		google.maps.event.addListener(poly,"mouseover",function(){
	        poly.setOptions({
	            strokeColor : "#FF0000",
	            strokeWeight: 2
		        //fillOpacity:0.3
	        });
	    });
		
		google.maps.event.addListener(poly,"mouseout",function(){
	        poly.setOptions({
	            //strokeColor: "#000",
                strokeOpacity: 0
                //strokeWeight: 0.5
	            });
	    });
		
		google.maps.event.addListener(poly, "click", function() { 
		 map.setOptions({
                zoom: 15,
                center: {lat: parseFloat(poly.qe.Ja.I), lng:parseFloat(poly.qe.Ja.J)}
            });
		console.log("poly: ", poly);
		show_earth_information(poly);
		});
	return poly;
};


function drawEarthProperty(property){
	initiate_earth_property();

	var classify = earth_property[property].range.length;
	earth_object_list.forEach((poly)=>{
	    var order = earth_property[property].range.indexOf( poly.properties[property] );

		if(property == 'adm' || property == 'geo1' || property == 'geo2' || property == 'geo3' || property == 'geo4'){
			colors_scope = categoryColor[order];
			poly.setOptions({
	    	    fillColor:colors_scope,
                fillOpacity:0.8
	        });
	    }
		else{
		    colors_scope = d3.scale
                .linear()
                .domain([0,classify - 1])
	    	    .range(d3Color[property]);
            poly.setOptions({
	    	    fillColor:colors_scope(order),
                fillOpacity:0.8
	        });
		}
	    earth_property[property].feature[order].push(poly);	
	});
	
	$("#right_legend").text("");
	var legend_str="";
	legend_str += '<div style="margin-left:10%;">';
	legend_str += '<button class="btn btn-success" onclick="layer_switch(0)" style="margin-bottom: 5px;">全部關閉</button>';
	legend_str += '<button class="btn btn-success" onclick="layer_switch(1)" style="margin-bottom: 5px; margin-left: 17%;">全部顯示</button>';
	legend_str += '</div>';
	
	if(property == 'adm'){
	    legend_str += '<div style="max-height: 275px;overflow-y: scroll;">';
	}
	else{
		legend_str += '<div>';
	};
	for (var k=0;k<classify;k++){
		if(property == 'adm' || property == 'geo1' || property == 'geo2' || property == 'geo3' || property == 'geo4'){
	        legend_str += '<div class="legend_div" style="background-color:' + categoryColor[k] + '"';
		}
		else{
			legend_str += '<div class="legend_div" style="background-color:' + colors_scope(k) + '"';
		};
		legend_str += 'onclick="showByClass(' + '\'' + property + '\'' + ',' + k + ')"' + '>';
		legend_str += earth_property[property].label[k] + '</div>';
	};
	legend_str += '</div>';
	$("#right_legend").append(legend_str);
};

function showByClass(property,k){
	earth_object_list.forEach((poly)=>{
		poly.setOptions({
            fillOpacity:0
	    });
	});
	earth_property[property].feature[k].forEach((poly)=>{
		poly.setOptions({
            fillOpacity:0.8
	    });
	});
};

function layer_switch(onOff){
	switch(onOff){
		case 0:
		    earth_object_list.forEach((poly)=>{
		        poly.setOptions({
                    fillOpacity:0
	            });
	        });
		    break;
		case 1:
		    earth_object_list.forEach((poly)=>{
		        poly.setOptions({
                    fillOpacity:0.8
	            });
	        });
		    break;
	};
};

function show_earth_information(poly){
	$("#farm-attribute-top").css("opacity",1);
    $("#farm_attribute_container").text("");
	var farm_attr_str="";		
	for(var key in poly.properties){
		if(key != 'area' && key != 'mother' && key != 'tesin'){
		    var order = earth_property[key].range.indexOf( poly.properties[key] );
			//poly.properties[key] = data.properties[key];
			farm_attr_str += '<div>' + earthChinese[key] + ' : ' + earth_property[key].label[order] + '</div>';
		}
		}
	$("#farm_attribute_container").append(farm_attr_str);
};