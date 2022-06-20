const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEL = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById('country');     
const weatherForecast = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const API_KEY = "76cb89d5224c15037b1c31d9f908409c";

const days = ["sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hour = time.getHours();
    const hours = hour >=13 ? hour %12: hour
    const minute = time.getMinutes();

    const ampm = hour >= 12 ? "PM" : "AM";

    timeEl.innerHTML = formatTime(hours) + ":" + formatTime(minute) + "" + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + "  " +","+" " + date + "" + months[month];
}, 1000);

function formatTime(time){
    return time <10 ? (`0${time}`) : time;
}

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                showWeatherData(data);
        })
    })
}

getWeatherData();

function showWeatherData(data) {

    timezone.innerHTML =  ` <div class="first">${data.timezone}</div>`
    countryEl.innerHTML =`<div class="div"> ${data.lat + " N" + " -- " + data.lon + " E"} </div>`;

    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    currentWeatherItemsEL.innerHTML =
        `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind speed</div>
                        <div>${wind_speed}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunrise</div>
                        <div>${window.moment(sunrise *1000).format("HH:mm a")}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunset</div>
                        <div>${window.moment(sunset *1000).format("HH:mm a")}</div>
                    </div>
                    `;
    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt *1000).format("ddd")}</div>
                <div class="temp">Night-${day.temp.night}</div>
                <div class="temp">Day-${day.temp.day}</div>
            </div>
            `
        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt *1000).format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Night-${day.temp.night}</div>
                <div class="temp">Day-${day.temp.day}</div>
            </div>
            `
        }
    })
    weatherForecast.innerHTML = otherDayForecast;

}