document.getElementById('location-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    document.getElementById('content').classList.add('hidden'); // Hide content
    document.getElementById('loading-spinner').classList.remove('hidden'); // Show spinner
    setTimeout(() => {
        getWeatherData(location);
    }, 1000); // 2-second delay
});

document.getElementById('current-location-btn').addEventListener('click', function() {
    if (navigator.geolocation) {
        document.getElementById('content').classList.add('hidden'); // Hide content
        document.getElementById('loading-spinner').classList.remove('hidden'); // Show spinner
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setTimeout(() => {
                getWeatherDataByCoordinates(lat, lon);
            }, 1000); // 2-second delay
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

document.getElementById('save-preferences').addEventListener('click', function() {
    const units = document.getElementById('units').value;
    localStorage.setItem('units', units);
    alert('Preferences saved!');
});

function loadPreferences() {
    const units = localStorage.getItem('units') || 'metric';
    document.getElementById('units').value = units;
    return units;
}

async function getWeatherData(location) {
    const apiKey = 'a7fbe7efd2e3984169f6a41f32d1c405';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    
    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);
        initMap(currentWeatherData.coord.lat, currentWeatherData.coord.lon);

        const forecastWeatherResponse = await fetch(forecastWeatherUrl);
        const forecastWeatherData = await forecastWeatherResponse.json();
        displayHourlyForecast(forecastWeatherData);
        displayDailyForecast(forecastWeatherData);

        document.getElementById('content').classList.remove('hidden'); // Show content
        document.getElementById('loading-spinner').classList.add('hidden'); // Hide spinner
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('loading-spinner').classList.add('hidden'); // Hide spinner in case of error
    }
}

async function getWeatherDataByCoordinates(lat, lon) {
    const apiKey = 'a7fbe7efd2e3984169f6a41f32d1c405';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    try {
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);
        initMap(currentWeatherData.coord.lat, currentWeatherData.coord.lon);

        const forecastWeatherResponse = await fetch(forecastWeatherUrl);
        const forecastWeatherData = await forecastWeatherResponse.json();
        displayHourlyForecast(forecastWeatherData);
        displayDailyForecast(forecastWeatherData);

        document.getElementById('content').classList.remove('hidden'); // Show content
        document.getElementById('loading-spinner').classList.add('hidden'); // Hide spinner
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('loading-spinner').classList.add('hidden'); // Hide spinner in case of error
    }
}

function displayCurrentWeather(data) {
    const weatherIconMap = {
        '01d': 'wi-day-sunny',
        '01n': 'wi-night-clear',
        '02d': 'wi-day-cloudy',
        '02n': 'wi-night-alt-cloudy',
        '03d': 'wi-cloud',
        '03n': 'wi-cloud',
        '04d': 'wi-cloudy',
        '04n': 'wi-cloudy',
        '09d': 'wi-showers',
        '09n': 'wi-showers',
        '10d': 'wi-day-rain',
        '10n': 'wi-night-alt-rain',
        '11d': 'wi-thunderstorm',
        '11n': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '13n': 'wi-snow',
        '50d': 'wi-fog',
        '50n': 'wi-fog'
    };

    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <div class="weather-details">
            <div class="weather-box large-box"><i class="fas fa-thermometer-half"></i> <strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</div>
            <div class="weather-box"><i class="fas fa-tint"></i> <strong>Humidity:</strong> ${data.main.humidity}%</div>
            <div class="weather-box"><i class="fas fa-wind"></i> <strong>Wind Speed:</strong> ${data.wind.speed} m/s</div>
            <div class="weather-box"><i class="fas fa-tachometer-alt"></i> <strong>Pressure:</strong> ${data.main.pressure} hPa</div>
            <div class="weather-box"><i class="fas fa-eye"></i> <strong>Visibility:</strong> ${data.visibility / 1000} km</div>
            <div class="weather-box"><i class="fas fa-sun"></i> <strong>Sunrise:</strong> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</div>
            <div class="weather-box"><i class="fas fa-moon"></i> <strong>Sunset:</strong> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</div>
        </div>
        <div class="text-center">
            <i class="wi ${weatherIconMap[data.weather[0].icon]} weather-icon"></i>
            <p>${data.weather[0].description}</p>
        </div>
    `;
}

function displayHourlyForecast(data) {
    const weatherIconMap = {
        '01d': 'wi-day-sunny',
        '01n': 'wi-night-clear',
        '02d': 'wi-day-cloudy',
        '02n': 'wi-night-alt-cloudy',
        '03d': 'wi-cloud',
        '03n': 'wi-cloud',
        '04d': 'wi-cloudy',
        '04n': 'wi-cloudy',
        '09d': 'wi-showers',
        '09n': 'wi-showers',
        '10d': 'wi-day-rain',
        '10n': 'wi-night-alt-rain',
        '11d': 'wi-thunderstorm',
        '11n': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '13n': 'wi-snow',
        '50d': 'wi-fog',
        '50n': 'wi-fog'
    };

    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '<h2 class="mb-3">Hourly Forecast</h2>';

    const forecastList = data.list.slice(0, 5).map(item => `
        <div class="forecast-item">
            <div class="forecast-time"><strong>${new Date(item.dt_txt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></div>
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <div class="forecast-icon"><i class="wi ${weatherIconMap[item.weather[0].icon]}"></i></div>
            <div class="forecast-desc">${item.weather[0].description}</div>
        </div>
    `).join('');

    hourlyForecastDiv.innerHTML += forecastList;
}

function displayDailyForecast(data) {
    const weatherIconMap = {
        '01d': 'wi-day-sunny',
        '01n': 'wi-night-clear',
        '02d': 'wi-day-cloudy',
        '02n': 'wi-night-alt-cloudy',
        '03d': 'wi-cloud',
        '03n': 'wi-cloud',
        '04d': 'wi-cloudy',
        '04n': 'wi-cloudy',
        '09d': 'wi-showers',
        '09n': 'wi-showers',
        '10d': 'wi-day-rain',
        '10n': 'wi-night-alt-rain',
        '11d': 'wi-thunderstorm',
        '11n': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '13n': 'wi-snow',
        '50d': 'wi-fog',
        '50n': 'wi-fog'
    };

    const dailyForecastDiv = document.getElementById('daily-forecast');
    dailyForecastDiv.innerHTML = '<h2 class="mb-3">5-Day Forecast</h2>';
    
    const forecastList = data.list.filter((_, index) => index % 8 === 0).map(item => `
        <div class="forecast-item">
            <div class="forecast-time"><strong>${new Date(item.dt_txt).toLocaleDateString()}</strong></div>
            <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
            <div class="forecast-icon"><i class="wi ${weatherIconMap[item.weather[0].icon]}"></i></div>
            <div class="forecast-desc">${item.weather[0].description}</div>
        </div>
    `).join('');

    dailyForecastDiv.innerHTML += forecastList;
}

function initMap(lat, lon) {
    const map = new google.maps.Map(document.getElementById('weather-map'), {
        center: { lat, lng: lon },
        zoom: 10
    });
    new google.maps.Marker({ position: { lat, lng: lon }, map });
}