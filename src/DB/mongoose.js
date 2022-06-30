const mongoose = require('mongoose');

const connectingToDB = async (url) => {
  mongoose.connect(url);
  mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
      console.log('Error', error);
    });
};

module.exports = connectingToDB;
