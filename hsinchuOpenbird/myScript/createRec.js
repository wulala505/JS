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

var all_properties = [
    "population",
	"households",
	"main1990",
	"main1991",
	"main1992",
	"main1990value",
	"main1991value",
	"main1992value",
	"K1990A101",
	"K1990A102",
	"K1990A103",
	"K1990A104",
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
	"1990":"main1990",
	"1991":"main1991",
	"1992":"main1992"
};

var year_list = ["1990","1991","1992"];

var all_year_data = {};

 function createRecs(mape_type){
        var jrec = jdata.features;
        var jrec_len = jdata.features.length;
		//console.log(jrec[27]);
		//console.log(jrec[28]);
        for (var i=0;i<jrec_len;i++){
			//console.log("jrec[i]: ",i ,jrec[i]);
            rec = createRectangle(mape_type,bounds[i],jrec[i].properties);
			console.log(i, "rec: ",rec);
        };
    };
 
 function createRectangle(map_type,boundary,source_properties) {
		console.log("map_type: ",map_type);
		console.log("boundary: ",boundary);
		console.log("source_properties: ",source_properties);
		var rectangle = new google.maps.Polygon({
            paths:boundary,
		    strokeColor: "#000",
            strokeOpacity: 1.0,
            strokeWeight: 0.5,
		    fillColor:"#000",
			fillOpacity:0,
		    map:map
	    });
		
		console.log("rectangle: ",rectangle);
		
		rectangle.properties = {"all_year":{"1990":{}}};
		all_properties_len = all_properties.length;
		for(var i = 0 ; i < all_properties_len ; i++){
			rectangle.properties[all_properties[i]] = source_properties[all_properties[i]];
			//console.log(all_properties[i].substring(1,5));
			var year = String(all_properties[i].substring(1,5));
			if (year == "1990"){
				rectangle.properties["all_year"][year][all_properties[i].substring(5,all_properties[i].length)] = source_properties[all_properties[i]];
				//console.log("rectangle.properties:",rectangle.properties);
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
			        createMessage(rectangle);
					break;
				case "yearly":
				    all_year_data = rectangle.properties["all_year"];
					console.log("all_year_data: ",all_year_data);
				    createMessageYearly(rectangle);
					//set_doughnut_data(rectangle);
			}
						
        });
    return rectangle;  
}

	
	
function createMessage(rectangle){
    var pr_json = [['pop_bar',0],['house_bar',0]];
    var html_str = "";
    html_str = create_html_str('pop_bar','人口',rectangle.properties["population"],population_list,html_str);
	html_str = create_html_str('house_bar','住宅數',rectangle.properties["households"],households_list,html_str);
	$("#test").text("");
    $("#test").append(html_str);
	
	for (var i=0;i<pr_json.length;i++ ){
			myMove(pr_json[i][0],pr_json[i][1]);
	    };

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
            } else {
              bar_width++; 
              elem.style.width = bar_width + '%'; 
            }
		}
      }
    }
    
    var sum_str = "";
	sum_str = create_sum_str('人口',rectangle.properties["population"],population_list,sum_str,"人");
	sum_str = create_sum_str('住宅數',rectangle.properties["households"],households_list,sum_str,"戶");
	$("#test").append(sum_str);
	
	function create_html_str(bar_id,attr_name,attribute,attribute_list,html_str){
	    rank = attribute_list.indexOf(attribute) + 1;
        pr = Math.round(((attribute_list.length - rank) / (attribute_list.length) * 100));
		for (var i=0;i<pr_json.length;i++ ){
		    if(pr_json[i][0] == bar_id){
			    pr_json[i][1] = pr;
			};
	    };
		html_str +=  '<label>' + attr_name + '</label>' ;
        html_str +=  '<div class="attr_bar">';
        html_str += '<div class="attr_str attr_value" ' + 'id="' + bar_id + '">';
        html_str += '<p>' + attribute + '</p>';
        html_str += '</div>';
        html_str += '</div>';
		return html_str;
	};
	function create_sum_str(attr_name,attribute,attribute_list,sum_str,unit){
	    rank = attribute_list.indexOf(attribute) + 1;
        pr = Math.round(((attribute_list.length - rank) / (attribute_list.length) * 100));
		sum_str += "此區域的" + attr_name + "是" + attribute + unit +"，PR值為" + pr + "。";
		return sum_str;
	};
};


function createMessageYearly(rectangle){
	$("#bar_area").text("");
	$("#bar_area").append('<div>歷年主要產業</div>');
	year_list.forEach((year)=>{
		var html_str = "";
		html_str +=  '<div class="bar_base_div" onclick="chart_js_doughnut(doughnutData,' + year + ')">';
		html_str +=    '<div class="col-md-2">' + year + '</div>' ;
		html_str +=    '<div class="col-md-10">';
		html_str +=      '<div class="col-md-6">';
		html_str +=        '<div class= "bar_color" id="' + "main" + year + '">' + '</div>';
		html_str +=      '</div>';
		html_str +=      '<div class="col-md-6">' + property_chinese [ rectangle.properties["main" + year] ];
		html_str +=      '</div>';
		html_str +=    '</div>';
		html_str +=  '</div>';
		$("#bar_area").append(html_str);
	    var elem_id = "main" + year;
		var max_width = rectangle.properties["main" + year + "value"];
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