const OPENWEATHER_API_KEY = "7e53c6cadf84313185c97c2cf6608bcd";

export async function getWeatherForUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`);
      const data = await res.json();
      const desc = data.weather[0].description;
      const temp = data.main.temp;
      resolve(`It's currently ${temp}°C with ${desc} in your area.`);
    }, () => reject("Unable to get location."));
  });
}
