'use strict';

var directions = {
  // http://www.mathmistakes.info/facts/TrigFacts/learn/images/ucar.gif
  top: Math.PI * 2,
  right: Math.PI / 2,
  bottom: Math.PI,
  left: (Math.PI * 3) / 2
}

var chunkSize = 9

class Track {

  constructor(track) {
    this.cols = track.cols
    this.tileSize = track.tileSize

    this.map = track.map
    this.checkpoints = track.checkpoints
    this.lastCheckpoint = Math.max.apply(null, this.checkpoints)

    this.chunks = track.chunks
    this.size = this.tileSize * chunkSize;

    for (var i = 0, len = this.map.length; i < len; i++) {
      var type = this.map[i];
      var px = Math.floor(i % this.cols);
      var py = Math.floor(i / this.cols);
      var color = type ? 0x3333FF : 0x33FF33;

      if (this.chunks[type].indexOf('start') === 0) {
        var direction = this.chunks[type].match(/start:(.*)/)
        this.spawnPosition = {
          x: px * this.size + (this.size * 0.5),
          y: py * this.size + (this.size * 0.5),
          rotation: directions[direction[1]]
        }
      }

    }
  }

  collide(player) {
    var currentTileX = Math.floor(player.position.x / this.size)
      , currentTileY = Math.floor(player.position.y / this.size)
      , currentTile = this.map[ (this.cols * currentTileY) + currentTileX ]
      , currentCheckpoint = this.checkpoints[ (this.cols * currentTileY) + currentTileX ]

      , nextPlayerPosition = player.getNextPosition()
      , nextTileX = Math.floor(nextPlayerPosition.x / this.size)
      , nextTileY = Math.floor(nextPlayerPosition.y / this.size)
      , nextTile = this.map[ (this.cols * nextTileY) + nextTileX ]

    // check lap completion (through checkpoints)
    if (currentCheckpoint !== 0) {
      if (player.lap.checkpoint(currentCheckpoint) &&
          currentCheckpoint === this.lastCheckpoint &&
          player.lap.validate(this.lastCheckpoint)) {
        player.lap.clear()
        player.emit('lap-complete')
      }
    }

    // prevent from colliding with grass
    if (nextTile === 0 && currentTile !== 0) {
      player.accelerationX /= 1.3
      player.accelerationY /= 1.3

      if (nextTileX !== currentTileX) {
        player.accelerationX = 0

      } else if (nextTileY !== currentTileY) {
        player.accelerationY = 0
      }

    } else if (currentTile === 0) {
      player.accelerationX /= 1.3
      player.accelerationY /= 1.3
    }

  }

}

module.exports = Track
