//Your API key is 8d43b91350520bddbdbe05651cf109c0
//endpoint api.openweathermap.org for your API calls

// var APIKey="8d43b91350520bddbdbe05651cf109c0";
// var queryURL="https://home.openweathermap.org/api_keys"

var searchBtn = document.querySelector('.search-btn');


function fetchWeatherApi(city) {
  //fetch request
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=8d43b91350520bddbdbe05651cf109c0`;


  fetch(requestURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data)
      //fetchWeatherWithLatLon(data);
    })
}

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
  var result = fetchWeatherApi(userCity.city);
  console.log(result);
  });