document.getElementById("map").style.height = window.innerHeight-15 + "px";

var map = L.map('map').setView([34, 77], 8);

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

var LeafIcon = L.Icon.extend({
	options: {
	shadowUrl: 'images/marker-shadow.png',
	iconAnchor:   [12, 41],
	shadowAnchor: [12, 41],
	popupAnchor:  [0, -34]
	}
});
		
var blueIcon = new LeafIcon({iconUrl: 'images/marker-icon-blue.png'}),
	redIcon = new LeafIcon({iconUrl: 'images/marker-icon-red.png'});

var link;
var cat1 = [];
var cat2 = [];
var marker
for (var i = 0; i < LadakhPlaces.length; i++) {
	link = "<a href='#' class='speciallink'>" + LadakhPlaces[i].Name + "</a>"
	link = $("<a href='#'>" + LadakhPlaces[i].Name + "</a>").on('click', {name: LadakhPlaces[i].Name, desc: LadakhPlaces[i].Description, image: LadakhPlaces[i].Image}, function(event) {
		Lightview.show({
			url: event.data.image,
			title: event.data.name,
			caption: event.data.desc,
			options: {
				width: 600
			}
			});
	})[0];
	if (LadakhPlaces[i].Lat != "" && i%2==0) {
		marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon, opacity: 0.8, riseOnHover: true}).bindPopup(link);
		cat1.push(marker)
		map.addLayer(marker);
		//L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: blueIcon}).addTo(map).bindPopup(link);
	} else {
		marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: redIcon, opacity: 0.8, riseOnHover: true}).bindPopup(link);
		cat2.push(marker)
		map.addLayer(marker);
	}
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = ["Lived", "Visited"],
		labels = [];

	div.innerHTML +=
		'<i style="background: url(images/marker-icon-blue.png)" id="category1"></i> ' + 'Lived' + '<br>' +
		'<i style="background: url(images/marker-icon-red.png)" id="category2"></i> ' + 'Visited' + '<br>' +
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
