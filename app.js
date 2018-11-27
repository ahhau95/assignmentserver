const express = require('express');
const app = express();
const Youtubegeo = require('./youtubegeo');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 2000;

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
        const image = places.data.candidates[0].photos[0].photo_reference;
        const lat = places.data.candidates[0].geometry.location.lat;
        const lng = places.data.candidates[0].geometry.location.lng;
        const mapsurl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`;
        const picture = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${image}&key=${placekey}`;

        const place = new Youtubegeo({
          title: title,
          name: placename,
          address: places.data.candidates[0].formatted_address,
          rating: places.data.candidates[0].rating,
          mapslink: mapsurl,
          youtubelink: youtubeurl,
          picturelink: picture
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

app.get('/getallplace', (req, res) => {
  Youtubegeo.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      console.log(error);
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

app.listen(port, () => {
  console.log('Server listening on port', port);
});
