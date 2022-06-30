var cron = require('node-cron');
const moment = require('moment-timezone');
const User = require('../DB/schema/user-schema');
const { getWeatherData } = require('../handler/data-provider');
const formatedMessage = require('../interface/message-generator');

const subscription = async (bot, msg, url, api) => {
  const chatId = msg.chat.id;
  cron.schedule('* * * * *', async () => {
    try {
      const date = new Date();
      const convTime = moment.tz(date, 'HH:mm').utc().format('HH:mm');
      const users = await User.find({ time: convTime });
      if (users.length === 0) {
        return;
      }
      users.map(async (elem) => {
        const { city } = elem;
        const { data } = await getWeatherData(city, api, url);

        const weatherMsg = formatedMessage({ data });

        return bot.sendMessage(chatId, weatherMsg, { parse_mode: 'HTML' });
      });
    } catch (err) {
      return err.message;
    }
  });
};

module.exports = { subscription };
