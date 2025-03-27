jQuery(document).ready(function() {
	// With strict mode, you can not use undeclared variables.
  // Strict mode makes it easier to write "secure" JavaScript. https://www.w3schools.com/js/js_strict.as
	"use strict";
  
  //Meteors Project
  var map,aDiv;
  var centerlatlng = L.latLng(16.97274101999902, 14.062500000000002);

  var southWest = L.latLng(-85, 180),
      northEast = L.latLng(85, -180),
      bounds = L.latLngBounds(southWest, northEast);

      //Basemap Light
      var aLayerOne = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh">NASA Open Data Portal</a> &#124; <a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; JawgMaps</a> 	&#124; <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 19,
        accessToken: '4YmVGNg8dWF0Opi5nCBGEH4cXyOVkbBZeGvBBdI4DHyPangsiKL60obTbtMAQJJw'
      });
      //Basemap Satellite 
      var aLayerTwo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '<a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh">NASA Open Data Portal</a> 	&#124; Basemap Powered by <a href="https://www.esri.com/">Esri</a> &#124; Source: Esri, Maxar, Earthstar Geographics and the GIS User Community',
        maxZoom: 19
      });

      //Meteors
      var aLayerThree = L.featureGroup()
      
      //adding a layer control
      var baseLayers = {
        "Streets" : aLayerOne,
        "Satellite": aLayerTwo
      };
                        
      var overLayers = {
        "Meteors" : aLayerThree
        };
      
      //Map creation
      map = L.map('myMap', {
          center: centerlatlng,
          zoom:	2,
                                  minZoom: 2,
          maxBounds: bounds,
          layers: [aLayerThree, aLayerOne]
      })      

      L.control.scale().addTo(map);
        
    // Function to load meteor data
    const loadMeteorData = () => {
      $.ajax({
          dataType: "json",
          type: "GET",
          url: "https://data.nasa.gov/resource/y77d-th95.json", // Fireball data
          data: {
              "$limit": 50000
          },
          success: function(resultData) {
              resultData.forEach(meteor => {
                  if (meteor.geolocation && meteor.geolocation.coordinates) {
                      const [lng, lat] = meteor.geolocation.coordinates;
                      const mass = parseFloat(meteor.mass) || 0;
                      const radius = (mass / 60000000) * 50; // Normalized radius
                      
                      const marker = L.circleMarker([lat, lng], {
                          radius: radius,
                          color: "rgb(238, 0, 0)",
                          weight: 1,
                          opacity: 0.5,
                          fillColor: "rgb(227, 23, 13)"
                      }).bindPopup(`
                          <strong>Name:</strong> ${meteor.name || 'N/A'}<br>
                          <strong>Classification:</strong> ${meteor.recclass || 'N/A'}<br>
                          <strong>ID:</strong> ${meteor.id || 'N/A'}<br>
                          <strong>Mass:</strong> ${meteor.mass || 'N/A'} grams
                      `);
                      
                      aLayerThree.addLayer(marker);
                  }
              });
              console.info(`Retrieved ${resultData.length} records from the dataset!`);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.error("Error fetching meteor data:", textStatus, errorThrown);
          }
      });
    };
    
        // Load meteor data initially if aLayerThree is active
        if (map.hasLayer(aLayerThree)) {
          loadMeteorData();
      }
  
      // Event listeners for layer controls
      map.on('overlayadd', function(e) {
          if (e.layer === aLayerThree) {
              loadMeteorData();
          }
      });
      // Event listeners for ClearLayer
      map.on('overlayremove', function(e) {
          if (e.layer === aLayerThree) {
              aLayerThree.clearLayers();
          }
      });
      
      L.control.layers(baseLayers, overLayers).addTo(map);
                  
                  var aControl = L.control({position: 'bottomright'});
        
      // part 2/3 : Should contain code that creates all the neccessary DOM elements for the control
      aControl.onAdd = function () {
      
          aDiv = L.DomUtil.create('div', 'aCustomC'); // create a div with a class "aCustomC"
          aDiv.innerHTML = "<h4>Displayed is a map of historic meteorite remnants with the circles representing the normalized mass in grams. </h4> <div id='BigCircle'></div> <p> 1.0 </p> <div id='SmallCircle'></div> <p> 0.0 </p>";
          return aDiv;
      }; // end function onAdd
  
      aControl.addTo(map);
                  
                  $("#Description").on("click", function(){
                          console.info("Switch");
                          $("#Maplink").removeClass("active");
                          $("#Description").addClass("active");
                          
                          aDiv.innerHTML = "<h3 class='MeteorWebmap'>Meteor, Meteoroid or Meteorite?</h3><h4 class='MeteorWebmap'>A Meteor</h4><p> is the flash of light that we see in the night sky when a small chunk of interplanetary debris burns up as it passes through our atmosphere. Meteor refers to the flash of light caused by the debris, not the debris itself.</p><h4 class='MeteorWebmap'>A Meteoroid</h4><p> is the debris of a Meteor. It tends to be smaller than a kilometer and frequently only millimeters in size. Most meteoroids that enter the Earth's atmosphere are so small that they vaporize completely and never reach the planet's surface. If any part of a meteoroid survives the fall through the atmosphere and lands on Earth, it is called a meteorite.</p><h4 class='MeteorWebmap'>A Meteorite</h4><p>Although the vast majority of meteorites are very small, their size can range from about a fraction of a gram (the size of a pebble) to 100 kilograms (220 lbs) or more (the size of a huge, life-destroying boulder).</p>";
                          
                          $(".aCustomC").css({"height": "470px", "width": "320px"});
                  }); //End Description Click
                  
                  $("#Maplink").on("click", function(){
                          console.info("Switch");
                          $("#Description").removeClass("active");
                          $("#Maplink").addClass("active");
                          
                          aDiv.innerHTML = "<h4 >Displayed is a map of historic meteorite remnants with the circles representing the normalized mass in grams. </h4> <div id='BigCircle'></div> <p> 1.0 </p> <div id='SmallCircle'></div> <p> 0.0 </p>";
                          
                          $(".aCustomC").css({"height": "320px", "width": "220px"});
  
                          legend.addTo(map);
                  }); //End Maplink Click		





                  
filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

});

