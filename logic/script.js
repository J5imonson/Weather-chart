const APIKey = '65ea7f0bc4bc6877c37099a77bad2248';
const cityName = `https://api.openweathermap.org/data/2.5/forecast?lat=${ lat }&lon=${ lon }&appid=${ APIKey }`;
const coordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${ city }&appid=${ APIKey }`;

const city = $('#city')

//finds a city's coordinates
function citySelect() {
  fetch(coordinates)
    .then(function (response) {
      return response.json();
    })
  .then(function (data) {
      console.log(data)
    });
}

city.on('click', citySelect());
