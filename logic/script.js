const city = $('#city');
const submitBtn = $('#submitBtn');
const form = $('#form');
const APIKey = '65ea7f0bc4bc6877c37099a77bad2248';

//finds a city's coordinates
function citySelect() {
  const coordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city.val()}&appid=${APIKey}`;
  fetch(coordinates)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
      let string = JSON.stringify(data);
      localStorage.setItem('coordinates', string);
      forecast();
    });
}

//finds the forecast
function forecast() {
  let coordinates = JSON.parse(localStorage.getItem('coordinates'));
  const cityName = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0].lat}&lon=${coordinates[0].lon}&appid=${APIKey}`;
  fetch(cityName)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
      let string = JSON.stringify(data);
      localStorage.setItem('forecast', string);
      weathData();
    });
}

//read weather data
function weathData() {
  let weather = JSON.parse(localStorage.getItem('forecast'));
  let text = [];
  for (let i = 0; i < weather.list.length; i += 7) {
    text.push(weather.list[i]);
  }
  let string = JSON.stringify(text);
  localStorage.setItem('weather', string);
}

//print weather data

//button
form.on('submit', submitBtn, function (e) {
  e.preventDefault();
  citySelect();
});

