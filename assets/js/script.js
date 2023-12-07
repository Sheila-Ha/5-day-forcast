//Your API key is 8d43b91350520bddbdbe05651cf109c0
//endpoint api.openweathermap.org for your API calls

// var APIKey="8d43b91350520bddbdbe05651cf109c0";
// var queryURL="https://home.openweathermap.org/api_keys"

var searchBtn = document.querySelector('.search-btn');

//add event listener
searchBtn.addEventListener('click', function() {
  fetchWeatherApi();
})

function fetchWeatherApi() {
  //fetch request
  var requestURL = 'https://home.openweathermap.org/api_keys';

  fetch(requestURL)
    .then(function(response) {
      return response.jason();
    })
    .then(function(data) {
      //console.log(data)
      fetchWeatherWithLatLon(data);
    })
}