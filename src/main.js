import Stage from './tools/Stage';
import Colyseus from 'colyseus.js'

var colyseus = new Colyseus("ws://localhost:3553")

console.log(Ammo)

var room = colyseus.join('map1')
room.on('setup', function(data) {
  console.log("initial data!", data)
})
room.on('patch', function(patches) {
  console.log("patched ", patches)
})

var stage = new Stage({
  targetWidth: 800,
  targetHeight: 500,
  width: 800,
  height: 500
});

console.log('main');
