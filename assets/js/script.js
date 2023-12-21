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
  var requestURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=` + APIKey;
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
  // Future
  console.log('FUTURE');
  console.log(weatherInfo.futureWeather.list);
  for (var i = 0; i < 5; i++) {
    var currentDay = i + 1;
    //the list has 40 items so output every 8 to get 5 days (8*5=40)
    var futureWeatherDay = weatherInfo.futureWeather.list[i * 8];
    console.log(futureWeatherDay);
    //creating a date object
    var d = new Date(futureWeatherDay.dt * 1000);
    console.log(d.toLocaleTimeString());
    $("#day" + currentDay + " .date").text(d.toLocaleDateString());
    $("#day" + currentDay + " .temperature").html(futureWeatherDay.main.temp + "&deg; F");
    $("#day" + currentDay + " .humidity").html(futureWeatherDay.main.humidity + "%");
    $("#day" + currentDay + " .wind").html(futureWeatherDay.wind.speed + "mph");
  
    //clear any previous image from container
    $("#icon" + currentDay).html("");

    //creating icon object
    var icon = document.createElement("img");
    icon.src = 'https://openweathermap.org/img/wn/' + futureWeatherDay.weather[0].icon + '@2x.png';
    document.getElementById("icon" + currentDay).appendChild(icon);
  }
}
//fetch city from api
function loadCityLocation(cityInput) {
  var cityLocation = JSON.parse(localStorage.getItem("cities"))||[];
  if (!cityLocation.includes(cityInput)) {
    cityLocation.push(cityInput);
    //submit and save to local storage
    localStorage.setItem("cities", JSON.stringify(cityLocation));
    //local storage to hold 5 past cities
  // if (loadCityLocation.length > 5) {
  //   loadCityLocation = loadCityLocation.slice(0,5);
  // }
  }
//jquery to clear out city on search
  $("#cities").html("");
//jquery create buttons for local storage (city buttons)
  $(cityLocation).each(function(){
    var button = document.createElement("button");
    button.innerText = this;
    button.addEventListener("click", function(event) {
      event.preventDefault();
      inputSection.value = this.innerText;
      searchClick();
    });
    //adding button to page
    document.getElementById("cities").appendChild(button);
  });
}