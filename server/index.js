"use strict";

var colyseus = require('colyseus')
  , http = require('http')
  , express = require('express')
  , cors = require('cors')
  // , Leaderboard = require('./db/leaderboard')

  , tmx = require('tmx-parser')
  , MatchRoom = require('./rooms/match_room')

  , port = process.env.PORT || 3553
  , app = express()
  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

  , tracks = require('./data/tracks')

for (let name in tracks) {
  gameServer.register(name, MatchRoom, { track: tracks[name] })
}

if (process.env.ENVIRONMENT !== "production") {
  app.use(cors())
} else {
  var whitelist = ['http://talk.itch.zone'];
  app.use(cors({
    origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  }))
}
app.use(express.static( __dirname + '/public' ))

// leaderboard requests
app.get('leaderboard', function(req, res) {
  // Leaderboard.listByTime(req.query.map, function(err, data) {
  //   res.json(data)
  // })
})

server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
