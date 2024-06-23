// Replace with your OpenWeatherMap API key
const WEATHER_API_KEY = '5c1b47d8d4817fd0c7bbe5fcc214b949';

// Initialize Google Maps
let map;
let service;
let infowindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

    const input = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', () => {
        const location = input.value;
        searchLocation(location);
    });
}

// Search for a location using Google Maps API
function searchLocation(location) {
    const request = {
        query: location,
        fields: ['name', 'geometry'],
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const place = results[0];
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            map.setCenter(place.geometry.location);

            new google.maps.Marker({
                map: map,
                position: place.geometry.location,
            });

            getWeather(lat, lng);
        }
    });
}

// Fetch weather data from OpenWeatherMap API
function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = `
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
            document.getElementById('weather-info').innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Initialize the map when the window loads
window.onload = initMap;
