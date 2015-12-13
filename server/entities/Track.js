var directions = {
  // http://www.mathmistakes.info/facts/TrigFacts/learn/images/ucar.gif
  top: Math.PI * 2, // = right
  right: Math.PI / 2, // = top
  bottom: Math.PI, // = left
  left: (Math.PI * 3) / 2 // = bottom
}

class Track {

  constructor(track) {
    this.cols = track.cols
    this.tileSize = track.tileSize
    this.map = track.map
    this.chunks = track.chunks
    this.size = this.tileSize * this.cols;

    for (var i = 0, len = this.map.length; i < len; i++) {
      var type = this.map[i];
      var px = Math.floor(i % this.cols);
      var py = Math.floor(i / this.cols);
      var color = type ? 0x3333FF : 0x33FF33;

      if (this.chunks[type].indexOf('start') === 0) {
        var direction = this.chunks[type].match(/start:(.*)/)
        this.spawnPosition = {
          x: px,
          y: py,
          rotation: directions[direction[1]]
        }

      }
      // var quad = new Quad(color, size, size, 0, 0);
      // this.base.addChild(quad);
      // quad.position.x = px*size;
      // quad.position.y = py*size;
    }
  }

}

module.exports = Track
