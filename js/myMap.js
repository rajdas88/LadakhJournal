document.getElementById("map").style.height = window.innerHeight-15 + "px";

var map = L.map('map').setView([34, 77], 8);

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

//Change name from leaficon
var LeafIcon = L.Icon.extend({
	options: {
	shadowUrl: 'images/marker-shadow.png',
	iconAnchor:   [12, 20],
	shadowAnchor: [12, 20],
	popupAnchor:  [0, -20]
	}
});
		
var blueIcon = new LeafIcon({iconUrl: 'images/marker-icon-blue.png'}),
	redIcon = new LeafIcon({iconUrl: 'images/marker-icon-red.png'});

// Generalize for more than 2 categories
var link, tpdiv, div;
var cat1 = [];
var cat2 = [];
var marker;
var markerList = {};
var myList = {};
var addFlag;
//alert($.inArray(4, myList));
// Consider using leaflet labels instead of popup?
//https://github.com/Leaflet/Leaflet.label
for (var i = 0; i < LadakhPlaces.length; i++) {
	//link = "<a href='#' class='speciallink'>" + LadakhPlaces[i].Name + "</a>"
	link = $("<a href='#'>" + LadakhPlaces[i].Name + "</a>").on('click', {name: LadakhPlaces[i].Name, desc: LadakhPlaces[i].Description, image: LadakhPlaces[i].Image}, function(event) {
		Lightview.show({
			url: event.data.image,
			title: event.data.name,
			caption: event.data.desc,
			options: {
				width: 600
			}
			});
	});
	addFlag = $.inArray(i, myList) > 0 ? "Remove" : "Add"
	tpdiv = $("<a href='#'>" + "Add" + "</a>").on('click', {name: LadakhPlaces[i].Name, number: i}, function(event) {
		if (!(event.data.number in myList)) {
		
			var scheduleItem = '<li><div class="item cat' + (event.data.number%2) + '">' + event.data.name + '<img src="./images/close.png" id="delete_element_' + event.data.number + '" height="10" width="10"></div></li>'
			
			myList[event.data.number] = scheduleItem;

			jQuery(document).ready(function($) {
				$("ul").append(scheduleItem);
				$("#delete_element_" + event.data.number).click(function() {
					$(this).parent().remove();
					//map.removeControl(myList[event.data.number]);
					delete myList[event.data.number]
				});
			});
			
			Sortable.create("elements");
			//itemList.push(scheduleItem);
			
			//refresh marker add -> remove
			//map.removeLayer(markerList[i]);
			//delete markerList[i];
			//var new_marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon, opacity: 0.8, riseOnHover: true}).bindPopup(div);
			//markerList[i] = new_marker;
			//map.addLayer(markerList[i]);
		} else {
			//map.removeControl(myList[event.data.number]);
			//delete myList[event.data.number];
		}		
	})[0];
	div = $('<div />').append(link).append("<br>").append(tpdiv)[0];
	if (LadakhPlaces[i].Lat != "" && i%2 == 0) {
		marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon, opacity: 0.8, riseOnHover: true}).bindPopup(div);
		//.bindLabel('Look revealing label!').addTo(map);
		/*marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon, opacity: 0.8, riseOnHover: true}).
		on('click', function() {
			Lightview.show({
				url: this.image,
				title: this.name,
				caption: this.desc,
				options: {
					width: 600
				}
			});
		}, {name: LadakhPlaces[i].Name, desc: LadakhPlaces[i].Description, image: LadakhPlaces[i].Image}).
		bindLabel(LadakhPlaces[i].Name);*/
		
		//marker.on('dblclick', function() {
		//alert('dbl');}
		cat1.push(marker);
		markerList[i] = marker;
		map.addLayer(marker);
		//L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon}).addTo(map).bindPopup(link);
	} else {
		marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: redIcon, opacity: 0.8, riseOnHover: true}).bindPopup(div);
		cat2.push(marker);
		markerList[i] = marker;
		map.addLayer(marker);
	}
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = ["Lived", "Visited"],
		labels = [];

	div.innerHTML +=
		'<div style="display: inline;" id="category1"><i style="background: url(images/marker-icon-blue.png)"></i>Lived</div><br />' +
		'<div style="display: inline;" id="category2"><i style="background: url(images/marker-icon-red.png)"></i>Visited</div><br />' +
		'<b id="allcategory">ALL</b>';

    return div;
	};

legend.addTo(map);

// obviously change logic below
document.getElementById("allcategory").onclick = function() {
	for (var i = 0; i < cat2.length; i++) {
		map.addLayer(cat2[i]);
	}
	for (var i = 0; i < cat1.length; i++) {
		map.addLayer(cat1[i]);
	}
}

document.getElementById("category2").onclick = function() {
	for (var i = 0; i < cat2.length; i++) {
		map.addLayer(cat2[i]);
	}
	for (var i = 0; i < cat1.length; i++) {
		map.removeLayer(cat1[i]);
	}
}

document.getElementById("category1").onclick = function() {
	for (var i = 0; i < cat1.length; i++) {
		map.addLayer(cat1[i]);
	}
	for (var i = 0; i < cat2.length; i++) {
		map.removeLayer(cat2[i]);
	}
}

// END CATEGORY LOGIC

