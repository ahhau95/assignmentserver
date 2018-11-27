const express = require('express');
const app = express();
const Youtubegeo = require('./youtubegeo');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const apikey = 'AIzaSyCjtpdLiL5biVAP81UOvYACP0PBPvXtsgw';
const placekey = 'AIzaSyCAXQy6-XpDCGZq81m_lumb_3jIOngnwK4';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getplace', (req, res) => {
  const title = req.query.title;

  axios
    .all([
      axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title}&maxResults=1&key=${apikey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${title}&inputtype=textquery&fields=place_id,photos,formatted_address,name,rating,opening_hours,geometry&key=${placekey}`
      )
    ])
    .then(
      axios.spread((youtuberes, places) => {
        const youtubeId = youtuberes.data.items[0].id.videoId;
        const youtubeurl = `www.youtube.com/watch?v=${youtubeId}`;
        const placename = places.data.candidates[0].name;
        const place_id = places.data.candidates[0].place_id;
        const lat = places.data.candidates[0].geometry.location.lat;
        const lng = places.data.candidates[0].geometry.location.lng;
        const mapsurl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`;

        const place = new Youtubegeo({
          title: title,
          name: placename,
          address: places.data.candidates[0].formatted_address,
          rating: places.data.candidates[0].rating,
          mapslink: mapsurl,
          youtubelink: youtubeurl
        });

        // if (!Youtubegeo.title) {
        //   res.status(200).json('Not found');
        //   return;
        // }
        return place.save();
      })
    )
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    });
});

// app.get('/create', (req, res) => {
//   const sensorValue = new sensorvalue({
//     name: req.query.name,
//     value: req.query.value
//   });

//   sensorValue
//     .save()
//     .then(response => {
//       res.status(200).json(response);
//     })

//     .catch(error => {
//       res.status(400).json(error);
//     });
// });

// app.post('/postcreate', (req, res) => {
//   const sensorValue = new sensorvalue({
//     name: req.body.name,
//     value: req.body.value
//   });

//   sensorValue
//     .save()
//     .then(response => {
//       res.status(200).json(response);
//     })

//     .catch(error => {
//       res.status(400).json(error);
//     });
// });

// app.get('/delete', (req, res) => {
//   const query = {
//     name: req.query.name
//   };

//   sensorvalue
//     .deleteMany(query)
//     .then(response => {
//       res.status(200).json(response);
//     })
//     .catch(errors => {
//       res.status(400).json(errors);
//     });
// });

// app.get('/getallmovies', (req, res) => {
//   Movie.find({})
//     .then(response => {
//       res.status(200).json(response);
//     })
//     .catch(error => {
//       res.status(400).json(error);
//     });
// });

// app.get('/getalldata', (req, res) => {
//   sensorvalue.find({}).then(result => {
//     res.status(200).json(result);
//   });
// });

// app.get('/deletemovie', (req, res) => {
//   Movie.deleteMany({ title: req.query.title })
//     .then(response => {
//       res.status(200).json(response);
//     })
//     .catch(error => {
//       res.status(400).json(error);
//     });
// });

app.get('/getallplace', (req, res) => {
  Youtubegeo.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:5000/deletemovie?title=MovieTitle
app.get('/deleteplace', (req, res) => {
  Youtubegeo.deleteMany({ title: req.query.title })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.listen(2000, () => {
  console.log('Server listening on port 2000');
});