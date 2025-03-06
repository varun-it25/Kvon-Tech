self.onmessage = function(e) {
    const { latitude, longitude } = e.data;

    function fetchWeather() {
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=fc2cb480a5ff4253ba670008250902&q=${latitude},${longitude}&aqi=no`;

        fetch(weatherUrl).then(response => response.json())
        .then(data => {
            const weatherData = { city: data.location.name, temp: data.current.temp_c, condition: data.current.condition.text };
            self.postMessage(weatherData);
        })
        .catch(error => {
            console.error("Failed to fetch weather data:", error);
        });
    }

    fetchWeather();
    setInterval(fetchWeather, 300000);
};