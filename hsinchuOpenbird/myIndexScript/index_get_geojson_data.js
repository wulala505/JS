/*
$.ajax({
     url:"https://togetherhoo.github.io/JS/geojson/hexagon2.json",
	 //url:"https://togetherhoo.github.io/JS/taiwan_fishnet_Export2.json",
	 async: false,
     type:"GET",
     dataType: "json",
     success: function(Adata){
         jdata = Adata;
	 },
	 error:function(){
     },
});
console.log(jdata);
*/

$.ajax({
     url:"https://togetherhoo.github.io/JS/geojson/all_hsinchu_town.json",
	 //url:"https://togetherhoo.github.io/JS/taiwan_fishnet_Export2.json",
	 async: false,
     type:"GET",
     dataType: "json",
     success: function(Adata){
         hsinchu_towns = Adata;
	 },
	 error:function(){
     },
});

console.log("hsinchu_towns: ",hsinchu_towns);

/*towns polygon*/
var town_cood;
var town_bounds=[];
for (var i=0;i < hsinchu_towns.features.length; i++){
	var town_bound= [];
	for (var j=0;j<hsinchu_towns.features[i].geometry.coordinates[0].length;j++){
	    town_coord = hsinchu_towns.features[i].geometry.coordinates[0][j];
		town_bound.push({lat:town_coord[1],lng:town_coord[0]});
	};
	town_bounds.push(town_bound);
};