module.exports =

var colyseus = new Colyseus("ws://localhost:3553")
var room = colyseus.join('map1')
  , players = {}

room.on('setup', function(data) {
  for(var clientId in data.players) {
    let player = new PIXI.Graphics();
    players[clientId] = player

    player.beginFill(0xFFFF00);
    player.lineStyle(1, 0xFF0000);
    player.drawRect(0, 0, 10, 10);
    player.x = data.players[clientId].x
    player.y = data.players[clientId].y
    player.rotation = data.players[clientId].rotation
    stage.container.addChild(player);
  }

  console.log("initial data!", data)
})

room.on('update', function(state) {
  // TODO: move to patches
  for (var clientId in state.players) {
    players[ clientId ].x = state.players[ clientId ].x
    players[ clientId ].y = state.players[ clientId ].y
    players[ clientId ].rotation = state.players[ clientId ].angle
  }
})

room.on('patch', function(patches) {
  console.log("patched ", patches)
})

