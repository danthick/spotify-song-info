var express = require("express");
const bodyParser = require('body-parser');
var path = require("path")
var SpotifyWebApi = require('spotify-web-api-node');

var app = express();

var server = app.listen(9000, function (request, response) {
    console.log("Listening on 9000");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '91d4c3ded5a64cff97cbf6e693e369cd',
  clientSecret: 'eab2ba4ad0c4485087fb25d4603a0e82',
  redirectUri: 'localhost:9000/callback'
});

// Retrieve an access token.
var token = "";
async function getAuth(){
  await spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
  
      // Save the access token so that it's used in future calls
      token = data.body['access_token'];
      return data.body['access_token'];
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
}

getAuth().then(async res => {
  spotifyApi.setAccessToken(token);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'))
  
});

app.post('/info', function(req, res){
  spotifyApi.getTrack(req.body.track).then(
    function(data){
      var artist_id = data.body.artists[0].external_urls.spotify.substring(data.body.artists[0].external_urls.spotify.lastIndexOf('/')+1)
      spotifyApi.getArtist(artist_id).then(
        function(data){
          for(var i = 0; i < data.body.genres.length - 1; i++){
            console.log(data.body.genres[i])
            
          }
          res.send({genre: data.body.genres})
        }
      )
    },
    function(err) {
      console.error(err);
    }
  )
})