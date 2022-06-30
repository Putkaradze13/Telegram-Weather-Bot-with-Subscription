const axios = require('axios');

async function getWeatherData(city, api, url) {
  try {
    const { data } = await axios.get(
      `${url}q=${city}&units=metric&appid=${api}`
    );
    return { data };
  } catch (err) {
    return err.message;
  }
}

module.exports = { getWeatherData };
