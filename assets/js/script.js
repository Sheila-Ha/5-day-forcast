//Your API key is 8d43b91350520bddbdbe05651cf109c0
//endpoint api.openweathermap.org for your API calls

var APIKey="8d43b91350520bddbdbe05651cf109c0";
// var queryURL="https://home.openweathermap.org/api_keys"

var inputSection = document.querySelector("#city-search");
var searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener("click", function(event) {
  event.preventDefault();
  searchClick();
});

function searchClick() {
  var cityInput = inputSection.value.trim();

  //clear out city once submitted
  inputSection.value = "";

  var weatherInfo = {
    currentWeather: [],
    futureWeather: []
  };
  //fetching city coordinates
  fetchCityCoordinates(cityInput).then(function(result) {
    if (result.length > 0) {      
      console.log(result);
      var latitude = result[0].lat;
      var longitude = result[0].lon;

      //fetching current weather for city
      fetchCurrentWeatherApi(latitude, longitude).then(function(result) {
        console.log(result);
        weatherInfo.currentWeather = result;

        //fetching forecast weather for current city
        fetchWeatherForecastApi(latitude, longitude).then(function(result) {
          console.log(result);
          weatherInfo.futureWeather = result;
        
          console.log(weatherInfo);
          displayWeather(weatherInfo);

          //load city look up history
          loadCityLocation(cityInput);
        });
      })
    }
    else {
      alert("Invalid city!")
    }
  });  
}

async function fetchCityCoordinates(city) {
  //fetch request
  var requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=` + APIKey;
  var response = await fetch(requestURL);
  var result = await response.json();
  return result;
}

async function fetchCurrentWeatherApi(latitude, longitude) {
  //fetch request
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=imperial&appid=` + APIKey;
  var response = await fetch(requestURL);
  var result = await response.json();
  return result;
}

async function fetchWeatherForecastApi(latitude, longitude) {
  //fetch request
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=imperial&appid=` + APIKey;
  var response = await fetch(requestURL);
  var result = await response.json();
  return result;
}

//display current weather
function displayWeather(weatherInfo){
  // Current
  console.log('CURRENT');
  console.log(weatherInfo.currentWeather);
  var d = new Date(weatherInfo.currentWeather.dt * 1000);
  $("#date").text("(" + d.toLocaleDateString() + ")");
  var windSpeed = weatherInfo.currentWeather.wind.speed;
  $("#wind").text(windSpeed + "mph");
  //console.log(windSpeed);
  var humidity = weatherInfo.currentWeather.main.humidity;
  $("#humidity").text(humidity + "%");
  //current temp
  var temp = weatherInfo.currentWeather.main.temp;
  $("#temperature").html(temp + "&deg; F");
  //current city
  var city = weatherInfo.currentWeather.name;
  $("#currentCity").text(city);

  
 //clear any previous image from container
  $("#icon").html("");

  //icon to display for weather
  var icon = document.createElement("img");
  icon.src = 'https://openweathermap.org/img/wn/' + weatherInfo.currentWeather.weather[0].icon + '@2x.png';
  document.getElementById("icon").appendChild(icon);
 
  // var icon =  document.querySelector(".search-btn");
  // icon.value = "";
  


  // Future
  console.log('FUTURE');
  var currentDay = 1;
  $(weatherInfo.futureWeather.list).each(function(index){
    console.log(this);
    var d = new Date(this.dt * 1000);
    //only output the noon weather
    if (d.toLocaleTimeString() == "12:00:00 PM") {
      // working on bringing html into script
      /*var displayHtml = "<div>";
      displayHtml += "<h3>" + d.toLocaleDateString() + "</h3>";
      displayHtml +=
      displayHtml += "</div>";
      $(".forecast-container").append(displayHtml);*/
      $("#day" + currentDay + " .date").text(d.toLocaleDateString());
      $("#day" + currentDay + " .temperature").html(this.main.temp + "&deg; F");
      $("#day" + currentDay + " .humidity").html(this.main.humidity + "%");
      $("#day" + currentDay + " .wind").html(this.wind.speed + "mph");
    
      //clear any previous image from container
      $("#icon" + currentDay).html("");

      //icon
      var icon = document.createElement("img");
      icon.src = 'https://openweathermap.org/img/wn/' + this.weather[0].icon + '@2x.png';
      document.getElementById("icon" + currentDay).appendChild(icon);

      currentDay++;
    }
  });
}

function loadCityLocation(cityInput) {
  var cityLocation = JSON.parse(localStorage.getItem("cities"))||[];
  if (!cityLocation.includes(cityInput)) {
    cityLocation.push(cityInput);
    //submit to local storage
    localStorage.setItem("cities", JSON.stringify(cityLocation));
    //local storage to hold 5 past cities
  // if (loadCityLocation.length > 5) {
  //   loadCityLocation = loadCityLocation.slice(0,5);
  // }
  }

  $("#cities").html("");
  $(cityLocation).each(function(){
    var button = document.createElement("button");
    button.innerText = this;
    button.addEventListener("click", function(event) {
      event.preventDefault();
      inputSection.value = this.innerText;
      searchClick();
    });
    document.getElementById("cities").appendChild(button);
//TODO add functionality when these buttons are clicked
    //attach a click event listener to each button
    //  button.addEventListener("click", function () {
      // handle the click event
      // console.log("Button clicked for city search", city);
    // })

    //TODO when click city in history present weather
// function clearIcon



    //TODO style buttons
  });
}