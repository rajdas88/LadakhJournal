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
	popupAnchor:  [0, -48],
	labelAnchor:  [12, -30]
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
var globalIndex;
//var addFlag;
// Consider using leaflet labels instead of popup?
//https://github.com/Leaflet/Leaflet.label
for (var i = 0; i < LadakhPlaces.length; i++) {
	//link = "<a href='#' class='speciallink'>" + LadakhPlaces[i].Name + "</a>"
	/*link = $("<a href='#'>" + LadakhPlaces[i].Name + "</a>").on('click', {name: LadakhPlaces[i].Name, desc: LadakhPlaces[i].Description, image: LadakhPlaces[i].Image}, function(event) {
		preloadImage(event.data.image, event.data.name, event.data.desc, showModal, loadModal);
		
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
	*/
	//marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {icon: icons[categories.indexOf(LadakhPlaces[i].Category1)], opacity: 0.8, riseOnHover: true}).bindPopup(div);
	marker = L.marker([LadakhPlaces[i].Lat, LadakhPlaces[i].Long], {id: "123Test", icon: icons[categories.indexOf(LadakhPlaces[i].Category1)], opacity: 0.8, riseOnHover: true}).
		on('click', function(event) {
			globalIndex = this.index;
			preloadImage(LadakhPlaces[this.index].Image, LadakhPlaces[this.index].Name, LadakhPlaces[this.index].Description, showModal, loadModal);
		}, {index: i}).
		bindLabel(LadakhPlaces[i].Name);
	
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

// This is used to close modal
function closeModal() {
	console.log(event.target.id);
	if (event.target.id == "overlay") {
		document.getElementById("overlay").style.visibility = "hidden";
		setItemsOpacity(0.2);
	}
}

function showItem(index) {
	// Would highly prefer doing this by some ID instead of by nth child which may "break" easily
	jQuery(document).ready(function($) {
		$(".leaflet-marker-pane > img:nth-child(" + index +")" ).effect( "bounce", {times: 1, distance: 50} );
	});
}

function setItemsOpacity(n) {
	jQuery(document).ready(function($) {
		$(".cat0").css({ 'background': 'rgba(255,255,0,' + n + ')' });
		$(".cat1").css({ 'background': 'rgba(255,0,0,' + n + ')' });
		$(".cat2").css({ 'background': 'rgba(0,0,255,' + n + ')' });
		$(".cat3").css({ 'background': 'rgba(0,255,0,' + n + ')' });
	});
}

function addItem() {
	//Wrong LOGIC - globalIndex changes with new modals...
	// We want the addItem to have an ID input and all this work should be done on the ID
	// I think ultiamtely get rid of globalIndex
	if (!(globalIndex in myList)) {
		
			var scheduleItem = '<li><div onclick="showItem(' + (globalIndex+1) + ');" id="listItem' + globalIndex + '" class="item cat' + categories.indexOf(LadakhPlaces[globalIndex].Category1) + '">' + LadakhPlaces[globalIndex].Name + '<img src="./images/close.png" id="delete_element_' + globalIndex + '" height="10" width="10"></div></li>'
						
			myList[globalIndex] = scheduleItem;

			jQuery(document).ready(function($) {
				$("ul").append(scheduleItem);
				$("#delete_element_" + globalIndex).click(function() {
					$(this).parent().remove();
					// For below, see comments near function declaration
					delete myList[this.id.split("_")[2]]
				});
			});
			
			Sortable.create("elements");

		} else {
			//Already exists!
			jQuery(document).ready(function($) {
				$( "#listItem" + globalIndex ).effect( "shake" );
			});
		}
		setItemsOpacity(0.8);
}

var opts = {color: '#fff',
	top: '80px',
	left: '280px'
};
var spinner = new Spinner(opts); //.spin(document.getElementById("modal-image-holder"));

function showModal(image, title, text, loadingFlag) {
	spinner.stop();
	setItemsOpacity(0.8);
	el = document.getElementById("overlay");
	if (!loadingFlag) {
		el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	}
	document.getElementById("modal-holder").style.left = (window.innerWidth-600) / 2 + "px";
	document.getElementById("modal-image").src = image;
	document.getElementById("modal-image").style.visibility = 'inherit';
	document.getElementById("modal-title").innerHTML = title;
	document.getElementById("modal-text").innerHTML = text;
}

function loadModal() {
	setItemsOpacity(0.8);
	el = document.getElementById("overlay");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	document.getElementById("modal-holder").style.left = (window.innerWidth-600) / 2 + "px";
	//target = document.getElementById("modal-image");
	//target.src = "";
	//target.style.backgroundColor = "black";
	//target.style.height = "200px";
	document.getElementById("modal-image").style.visibility = 'hidden';
	document.getElementById("modal-title").innerHTML = "";
	document.getElementById("modal-text").innerHTML = "";
	spinner.spin(document.getElementById("modal-image-holder"));

	//var spinner = new Spinner(opts).spin();
	//target.appendChild(spinner.el);
}

// http://stackoverflow.com/questions/51352/how-to-show-a-spinner-while-loading-an-image-via-javascript
function preloadImage(image, title, text, callback, spinnerCallback){
	/*
	callback("", title, text);
	target = document.getElementById("modal-image");
	var spinner = new Spinner().spin();
	target.appendChild(spinner.el);*/
	/*
	setTimeout(function() {
    b = 3 + 4;
	}, (3 * 1000));
	*/
  var objImagePreloader = new Image();

  objImagePreloader.src = image;
  if(objImagePreloader.complete){
    callback(image, title, text, false);
    objImagePreloader.onload=function(){};

  }
  else{
	spinnerCallback();
    objImagePreloader.onload = function() {
      callback(image, title, text, true);
      //    clear onLoad, IE behaves irratically with animated gifs otherwise
      objImagePreloader.onload=function(){};
    }
  }
}
