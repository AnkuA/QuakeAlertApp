/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var ajax = require('ajax');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Earthquake alert',
  subtitle:'Fetching...',
  
  scrollable: true
});

// Make a list of menu items
var options = [
  {
    title: "Yes.",
    subtitle: "I am ok, how are you?"
  },
  {
    title: "No",
    subtitle: "I need help"
  },
  {
    title: "Skip",
  }
];

/*
// Make a list of menu items
var options = [
  {
    title: "Status Report",
    subtitle: "Are you ok?"
  },
  {
    title: "Find your location",
    subtitle: "Latititude-Longitude"
  },
  
];*/

var Accel = require('ui/accel');


// Create the Menu
var MessageMenu = new UI.Menu({
  sections: [{
    title: 'Are you okay?',
    items: options
  }]
});

// Add a click listener for select button click
MessageMenu.on('select', function(event) {

  // Show a card with clicked item details
  var detailCard = new UI.Card({
    title: options[event.itemIndex].title,
    body: options[event.itemIndex].subtitle
    
  });

  // Show the new Card
  detailCard.show();
  
});

// Display the Card
card.show();



// Construct URL
var URL = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=2015-01-02&limit=1';


// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched earthquake data!');
    
    // Extract data
  var location = data.features[0].properties.place;
  var time=new Date(data.features[0].properties.time);
  var magnitude=data.features[0].properties.mag;
  
    card.body("Location: "+location + ". Time: "+time +". Magnitude: "+ magnitude);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching earthquake data: ' + error);
  }
  
);


// Send a long vibration to the user wrist
Vibe.vibrate('long');
Light.on('long');


// Prepare the accelerometer
Accel.init();




//Extract geolocation information
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}


// Show the Menu to send Message when the user shakes
card.on('accelTap', function(e) {
  MessageMenu.show();
  
});
function getLocation(){
   navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
}

//TRying to call this for displaying location
getLocation();
