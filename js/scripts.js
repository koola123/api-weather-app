const key = '3c06fe0421fae9effc3dfd76b513ad4c';

async function search() {
  const inputText = document.querySelector('input[type="text"]').value;
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputText}&limit=5&appid=${key}`);
  const data = await response.json();
  const ul = document.querySelector('form ul');
  ul.innerHTML = '';
  for (let i = 0; i<data.length; i++) {
  const {name, lat, lon, country} = data[i];
  ul.innerHTML += `<li
  data-lat="${lat}"
  data-lon="${lon}"
  data-name="${name}">
  ${name} &nbsp;<span>${country}</span></li>`;
  }
}

async function showWeather(lat, lon, name) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
  const data = await response.json();
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = Math.round(data.main.humidity);
  const wind = Math.round(data.wind.speed);
  const icon = data.weather[0].icon;
  // console.log({temp, feelsLike, humidity, wind, icon, data});
  document.getElementById('city').innerHTML = name;
  document.getElementById('degrees').innerHTML = temp + '<span>&#8451</span>';
  document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span>&#8451</span>';
  document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
  document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
  document.querySelector('.icon').src = `http://openweathermap.org/img/wn/10d@4x.png`;
  document.querySelector('form').style.display = 'none';
  document.getElementById('weather').style.display = 'block';
}

const debounced_search = _.debounce(() => {
  search();
}, 700);

document.querySelector('input[type="text"]').addEventListener('keyup', debounced_search);
document.body.addEventListener('click',(e) => {
  const li = e.target;
  const {lat, lon, name} = li.dataset;
  localStorage.setItem('lat', lat);
  localStorage.setItem('lon', lon);
  localStorage.setItem('name', name);
  if (!lat) {
    return;
  }
  showWeather(lat, lon, name);
});

document.getElementById('change').addEventListener('click', () => {
  document.getElementById('weather').style.display = 'none';
  document.querySelector('form').style.display = 'block';
});

document.body.onload = () => {
  if (localStorage.getItem('lat')) {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    showWeather(lat, lon, name);
  }
}
