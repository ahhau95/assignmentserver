const mongoose = require('mongoose');

const db = 'mongodb://ahhau95:hau81838826@ds125716.mlab.com:25716/assignment';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('mongoose connected to mongodb');
  })

  .catch(error => {
    console.log('mongoose connection error', error);
  });

const sensorSchema = mongoose.Schema({
  title: {
    type: String
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  rating: {
    type: String
  },
  mapslink: {
    type: String
  },

  youtubelink: {
    type: String
  },

  picturelink: {
    type: String
  }
});

const youtubegeo = mongoose.model('assignment', sensorSchema, 'youtubegeo');

module.exports = youtubegeo;
