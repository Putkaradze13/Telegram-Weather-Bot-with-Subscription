function formatedMessage(properties) {
  return `<b>Weather Forecast:
    \nCity: ${properties.data.name}</b>
    \t\t\t<b>temperature:</b> ${Math.floor(properties.data.main.temp)}°c,
    \t\t\t<b>feels like:</b> ${Math.floor(properties.data.main.feels_like)}°c, 
    \t\t\t<b>humidity:</b> ${properties.data.main.humidity}%,
    \t\t\t<b>sunrise:</b> ${new Date(
      parseInt(properties.data.sys.sunrise, 10) * 1000
    ).toLocaleTimeString()},
    \t\t\t<b>sunset:</b> ${new Date(
      parseInt(properties.data.sys.sunset, 10) * 1000
    ).toLocaleTimeString()},
    \t\t\t<b>country:</b> ${properties.data.sys.country}`;
}
module.exports = formatedMessage;
