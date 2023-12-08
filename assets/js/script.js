//Your API key is 8d43b91350520bddbdbe05651cf109c0
//endpoint api.openweathermap.org for your API calls

// var APIKey="8d43b91350520bddbdbe05651cf109c0";
// var queryURL="https://home.openweathermap.org/api_keys"

var searchBtn = document.querySelector('.search-btn');



searchBtn.addEventListener("click", function(event) {
  event.preventDefault();
  //create user initials from submission
  var inputSection = document.querySelector("#city-search");
  var cityInput = inputSection.value.trim();
  var userCity = {
    city: cityInput
  }
  console.log(userCity);

  //clear out city once submitted
  inputSection.value = "";

  //load city look up history
  cityLocation = JSON.parse(localStorage. getItem('city'));
    if(userCity == null){
      userCity =[];
    }
  //submit to local storage
  localStorage.setItem("city", JSON.stringify(cityLocation));
  //loadCityLocation();
  var weatherInfo = {
    currentWeather: [],
    futureWeather: []
  };
  //fetching forecast weather for current city
  fetchWeatherForecastApi(userCity.city).then(function(result) {
    weatherInfo.futureWeather = result;
    
    var latitude = result.city.coord.lat;
    var longitude = result.city.coord.lon;

    //fetching current weather for city
    fetchCurrentWeatherApi(latitude, longitude).then(function(result) {
      weatherInfo.currentWeather = result;
      
      displayWeather(weatherInfo);
    });

  });
});

async function fetchWeatherForecastApi(city) {
  //fetch request
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=8d43b91350520bddbdbe05651cf109c0`;
  var response = await fetch(requestURL);
  var result = await response.json();
  return result;
}

async function fetchCurrentWeatherApi(latitude, longitude) {
  //fetch request
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=imperial&appid=6d60041c25e2a27c932aebc09b988073`
  var response = await fetch(requestURL);
  var result = await response.json();
  return result;
}
//display current weather
function displayWeather(weatherInfo){
  // Current
  console.log('CURRENT');
  console.log(weatherInfo.currentWeather);
  var windSpeed = weatherInfo.currentWeather.wind.speed;
  //console.log(windSpeed);
  var humidity = weatherInfo.currentWeather.main.humidity;
  //current temp
  var temp = weatherInfo.currentWeather.main.temp;
  console.log(temp);
  //current city
  var city = weatherInfo.currentWeather.name;
  console.log(city);
  var icon = 'https://openweathermap.org/img/wn/' + weatherInfo.currentWeather.weather[0].icon + '@2x.png';
  // Future
  //console.log('FUTURE');
  $(weatherInfo.futureWeather.list).each(function(){
    //console.log(this);
  });
}