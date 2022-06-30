require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const connectingToDB = require('./DB/mongoose');
const User = require('./DB/schema/user-schema');
const createUser = require('./DB/create-user');
const { subscription } = require('./scheduler/cron');
const { getWeatherData } = require('./handler/data-provider.js');

const { TOKEN, HOST, PORT, URL, W_URL, API_KEY, MDB_URL } = process.env;

connectingToDB(MDB_URL);

const regExp = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/;

// const bot = new TelegramBot(TOKEN, {
//   webHook: {
//     host: HOST,
//     port: PORT,
//   },
// });
// bot.setWebHook(URL + TOKEN);

const bot = new TelegramBot(TOKEN, { polling: true });

bot.setMyCommands([
  { command: '/start', description: "Let's get started" },
  { command: '/help', description: 'Instruction' },
  { command: '/subscribe', description: 'Start subscribing' },
]);

bot.on('message', async (msg) => {
  try {
    let time = msg.text.match(regExp);
    const { text } = msg;
    const { data } = await getWeatherData(text, API_KEY, W_URL);
    if (text === '/start') {
      await createUser(msg.from.first_name, msg.chat.id);
      return bot.sendMessage(
        msg.chat.id,
        `Hello ${msg.chat.first_name}, please type city name to get weather information.`
      );
    } else if (typeof data === 'object') {
      const timezone = Math.floor(data.timezone / 60 / 60);
      await User.updateOne(
        { chatId: msg.chat.id },
        { city: msg.text, timezone }
      );
      bot.sendMessage(
        msg.chat.id,
        `Temperatura in ${data.name} curently is ${Math.floor(
          data.main.temp
        )}°C, and feels like ${Math.floor(data.main.feels_like)}°C.`
      );
      return bot.sendMessage(
        msg.chat.id,
        `To subscribe the bot for this city please enter the time when you want to get information!\n<b>Format: HH:mm.</b>`,
        { parse_mode: 'HTML' }
      );
    } else if (text === '/subscribe') {
      return bot.sendMessage(
        msg.chat.id,
        `To subscribe the bot please enter the city name and the time when you want to get information.`
      );
    } else if (time) {
      const { timezone } = await User.findOne({ chatId: msg.chat.id });
      const hour = +time[1] - timezone;
      time = time[0].replace(+time[1], hour);
      await User.updateOne({ chatId: msg.chat.id }, { time });
      bot.sendMessage(
        msg.chat.id,
        `You have subscribed the bot! You will get information every day at ${msg.text} by the city time.\nIf you want to change the time or city, please send preferred data again.\nIf you want to unsubscribe the bot, please press '/unsubscribe'.`
      );

      return subscription(bot, msg, W_URL, API_KEY);
    } else if (text === '/stop') {
      await User.updateOne({ chatId: msg.chat.id }, { $unset: { time: '' } });
      return bot.sendMessage(msg.chat.id, `You have unsubscribed the bot!`);
    } else if (text === '/help') {
      return bot.sendMessage(
        msg.chat.id,
        `To receive information about the weather in any city please send city name you are interested in.\nIf you want to subscribe the weather bot please enter the city name and the time to get information for particular city at fixed time.\nIf you want to stop subscribing bot, please press '/unsubscribe' button.`
      );
    } else
      return bot.sendMessage(msg.chat.id, `"${msg.text}" is wrong command`);
  } catch (error) {
    return error.message;
  }
});

const shutdown = () => process.exit();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
