const apiKey = "fe0a478e67f09ff15d5e65eafa23d009"; // Your API key

// Fetch weather by city
async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        document.getElementById("weatherResult").innerHTML = "Please enter a city name.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            document.getElementById("weatherResult").innerHTML = "City not found or API error.";
            return;
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = "Error fetching data.";
        console.error(error);
    }
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            document.getElementById("weatherResult").innerHTML = "Error fetching weather for your location.";
            return;
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = "Error fetching data.";
        console.error(error);
    }
}

// Display weather on the page
function displayWeather(data) {
    document.getElementById("weatherResult").innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Feels Like: ${data.main.feels_like}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p class="condition">
            Condition: ${data.weather[0].description}
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
        </p>
    `;
}

// Get weather based on user's location
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            (error) => {
                let errorMsg = "Location access denied.";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = "❌ Permission Denied: You blocked location access. Check browser settings to allow it.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = "⚠️ Position Unavailable: Your browser couldn't determine your location.";
                        break;
                    case error.TIMEOUT:
                        errorMsg = "⏱️ Timeout: Location request took too long.";
                        break;
                }
                document.getElementById("weatherResult").innerHTML = errorMsg;
                console.error("Geolocation error:", error);
            }
        );
    } else {
        document.getElementById("weatherResult").innerHTML = "Geolocation not supported by your browser.";
    }
}

// Automatically fetch weather when page loads
//window.onload = getLocationWeather;