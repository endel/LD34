"use strict";

var colyseus = require('colyseus')
  , http = require('http')
  , express = require('express')
  , cors = require('cors')

  , tmx = require('tmx-parser')
  , MatchRoom = require('./rooms/match_room')

  , port = process.env.PORT || 3553
  , app = express()
  , server = http.createServer(app)
  , gameServer = new colyseus.Server({server: server})

// register room for map1
tmx.parseFile("maps/map1.tmx", function(err, data) {
  gameServer.register("map1", MatchRoom, { map: data })
})

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
server.listen(port);

console.log(`Listening on http://localhost:${ port }`)
