const User = require('./schema/user-schema');

async function createUser(name, chatId) {
  const user = await User.findOne({ chatId });
  if (!user) {
    await User.create({
      name,
      chatId,
    });
  }
}

module.exports = createUser;
