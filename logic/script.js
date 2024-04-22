let city = $('#city');
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
};

//finds the forecast
function forecast() {
  let coordinates = JSON.parse(localStorage.getItem('coordinates'));
  const cityName = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0].lat}&lon=${coordinates[0].lon}&appid=${APIKey}&units=imperial`;
  fetch(cityName)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
      let string = JSON.stringify(data);
      removeDuplicates();
      localStorage.setItem('forecast', string);
      weathData();
      printWeather();
    });
};

//read weather data
function weathData() {
  let weather = JSON.parse(localStorage.getItem('forecast'));
  let text = [];
  let cities = readCity();
  for (let i = 0; i < weather.list.length; i += 7) {
    const dailyWeath =
    {
      temp: weather.list[i].main.temp,
      dt: weather.list[i].dt,
      windSpeed: weather.list[i].wind.speed,
      humidity: weather.list[i].main.humidity,
      city: weather.city.name,
    };
    text.push(dailyWeath);
    cities.push(dailyWeath);
  }
  let string = JSON.stringify(text);
  localStorage.setItem('weather', string);
  saveCity(cities);
};

//print weather data
function printWeather() {
  let weather = JSON.parse(localStorage.getItem('weather'));
  let today = $('<div>');
  let temp = $('<p>');
  let windSpeed = $('<p>');
  let humidity = $('<p>');
  today.text(dayjs.unix(weather[0].dt).format('MM/DD/YYYY')).addClass('today').appendTo($('#today'));
  temp.text(`Temp: ${weather[0].temp}F`).appendTo(today);
  windSpeed.text(`Wind-speed: ${weather[0].windSpeed}MPH`).appendTo(today);
  humidity.text(`Humidity: ${weather[0].humidity}%`).appendTo(today);
  for (let i = 1; i < weather.length; i++) {
    let div = $('<div>');
    let temp = $('<p>');
    let windSpeed = $('<p>');
    let humidity = $('<p>');
    div.text(dayjs.unix(weather[i].dt+86400).format('MM/DD/YYYY')).addClass('daily').appendTo($('.weather'));
    temp.text(`Temp: ${weather[i].temp}F`).appendTo(div);
    windSpeed.text(`Wind-speed: ${weather[i].windSpeed}MPH`).appendTo(div);
    humidity.text(`Humidity: ${weather[i].humidity}%`).appendTo(div);
  }
};

//search history
function readCity() {
  let string = localStorage.getItem('cities');
  let cities = JSON.parse(string) || [];
  return cities
}

function saveCity(cities) {
  let string = JSON.stringify(cities);
  localStorage.setItem('cities', string);
}

function printHistory() {
  let cities = readCity();
  for (let i = 0; i < cities.length; i++) {
    let button = $('<button>');
    button.text(cities[i].city).attr('id', cities[i].city).addClass('histBtn').appendTo($('.history'));
  }
};

$('.history').on('click', '.histBtn', function (e) {
  e.preventDefault();
  const cityName = $(this).attr('id');
  $('.daily').remove();
  $('.history').empty();
  $('.today').remove();
  const coordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}`;
  fetch(coordinates)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
      let string = JSON.stringify(data);
      localStorage.setItem('coordinates', string);
      forecast();
    });
})

function removeDuplicates() {
  let cities = readCity();
  let cityName = cities.map(({ city }) => city);
  let filter = cities.filter(({ city }, i) => !cityName.includes(city, i + 1));
  saveCity(filter);
  printHistory();
};

//button
form.on('submit', submitBtn, function (e) {
  e.preventDefault();
  $('.daily').remove();
  $('.history').empty();
  $('.today').remove();
  citySelect();
});
