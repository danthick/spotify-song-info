var express = require("express");
var app = express();
const request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');

var server = app.listen(9000, function (request, response) {
    console.log("Listening on 9000");
})

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

app.get('/info', function (req, res) {
  res.send('Hello World!')
  spotifyApi.getTrack('0rohJsT6NWsThpukt0Xxdc').then(
    function(data){
      var artist_id = data.body.artists[0].external_urls.spotify.substring(data.body.artists[0].external_urls.spotify.lastIndexOf('/')+1)
      spotifyApi.getArtist(artist_id).then(
        function(data){
          console.log(data.body)
          for(var i = 0; i < data.body.genres.length - 1; i++){
            console.log(data.body.genres[i])
          }
          
        }
      )

    },
    function(err) {
      console.error(err);
    }
  )
});