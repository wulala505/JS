function sliderChange(){
	clear_all();
	var now_year = ageInputId.value;
	ageOutputId.value = now_year;
	draw_color_by_main_industry(now_year);
};

function play_draw_color(max_step) {
clear_all();
var legend_str="";
legend_str += '<div class="legend_div" style="background-color:' + industry_color["A101"] +  ';">' + property_chinese["A101"] +  '</div>';
legend_str += '<div class="legend_div" style="background-color:' + industry_color["A102"] +  ';">' + property_chinese["A102"] +  '</div>';
legend_str += '<div class="legend_div" style="background-color:' + industry_color["A103"] +  ';">' + property_chinese["A103"] +  '</div>';
legend_str += '<div class="legend_div" style="background-color:' + industry_color["A104"] +  ';">' + property_chinese["A104"] +  '</div>';
$("#test").append(legend_str);
	
var step = 2011;
var id = setInterval(frame, 2016);
function frame() {
      if (step > max_step) {
        clearInterval(id);
      } 
	  else {
        draw_color_by_main_industry(String(step));
		step = step + 1;
      }
};
};
function draw_color_by_main_industry(year){
	rec_object_list.forEach((rec) => {
		rec.setOptions({
			fillOpacity:0
		});
		var industry = rec.properties[main_industry_col[year]];
		var present_color =  industry_color[industry];
		rec.setOptions({
			fillColor:present_color,
			fillOpacity:0.5
		});
		
		/*
		switch (rec.properties[key]){
			case "":
			    rec.setOptions({
					fillColor:industry_color["2600"],
					fillOpacity:0.5
				});
		};
		*/
		
		
	});
};

