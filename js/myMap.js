document.getElementById("map").style.height = window.innerHeight-16 + "px";

var map = L.map('map').setView([34, 77], 8);

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

//Change name from leaficon
var LeafIcon = L.Icon.extend({
	options: {
	iconAnchor:   [24, 48],
	popupAnchor:  [0, -48]
	}
});
		

var icons = [new LeafIcon({iconUrl: 'images/categories/Spiritual.png'}),
			new LeafIcon({iconUrl: 'images/categories/DailyLife.png'}),
			new LeafIcon({iconUrl: 'images/categories/Historical.png'}),
			new LeafIcon({iconUrl: 'images/categories/Nature.png'})];


var link, tpdiv, div;
var categories = ["Spiritual", "Daily Life", "Historical", "Nature"];
var marker;
var markerList = {}; // list of marker objects
var myList = {}; // "itiniterary" list of boxes that appear on right
//var addFlag;
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
	tpdiv = $("<a href='#'>" + "Add" + "</a>").on('click', {name: LadakhPlaces[i].Name, number: i, category: categories.indexOf(LadakhPlaces[i].Category1)}, function(event) {
		if (!(event.data.number in myList)) {
		
			var scheduleItem = '<li><div onclick="markerList[' + event.data.number + '].openPopup();" class="item cat' + event.data.category + '">' + event.data.name + '<img src="./images/close.png" id="delete_element_' + event.data.number + '" height="10" width="10"></div></li>'
			
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
	
	
	marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: icons[categories.indexOf(LadakhPlaces[i].Category1)], opacity: 0.8, riseOnHover: true}).bindPopup(div);
		markerList[i] = marker;
		map.addLayer(marker);
	
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	
	for (var i = 0; i < categories.length; i++) {
		div.innerHTML += '<div style="display: inline;" id="category_' + i + '"><i style="width: 48px; height: 37px; background: url(images/categories/' + categories[i].replace(" ", "") + '.png)"></i>' + categories[i] + '</div><br />'
	}
		
	div.innerHTML += '<div style="display: inline;" id="category_all"><i style="width: 48px; height: 37px; background: url(images/categories/All.png)"></i>All</div>';

    return div;
	};

legend.addTo(map);

for (var i = 0; i < categories.length; i++) {
	document.getElementById("category_" + i).onclick = function() {
		for (var j = 0; j < LadakhPlaces.length; j++) {
			if (Number(this.id.charAt(this.id.length-1)) == categories.indexOf(LadakhPlaces[j].Category1)) {
				map.addLayer(markerList[j]);
			} else {
				map.removeLayer(markerList[j]);
			}
		}
	}
}

document.getElementById("category_all").onclick = function() {
	for (var j = 0; j < LadakhPlaces.length; j++) {
		map.addLayer(markerList[j]);
	}
}
