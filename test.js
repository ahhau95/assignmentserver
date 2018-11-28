const axios = require('axios');

axios
  .get(
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CmRaAAAAux_80GaVGw59CWiVutuUkGx44-iucybXQ76IOqvCMTo219y7IDt3lYvU6cY0Q9USmXXMgQATtiTX3tUEQ-rl_lh08t3whFV863EB_bIA43ElhqMizu_Acoi6HycrBnzzEhDixmU9aJ3Nns6nSV_XwsQuGhQrNN2CRvu9ZY5UomRSjytUA0HsKA&key=AIzaSyCAXQy6-XpDCGZq81m_lumb_3jIOngnwK4`
  )
  .then(response => {
    console.log(response);
  });
