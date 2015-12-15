var shuffle = function(array) {
  for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}

var i = 0
  , names = shuffle([
    'Bobby Joe',
    'Billy Bob',
    'Baby Jack',
    'Daryl Dixon',
    'Jack O\'Boy',
    'Merle Dixon',
    'Jerry Cluster',
    'Duke the Dog',
    'Toe Jam',
    'Bob the Billy',
    'Jerry Wet Hands',
    'Cletus Lee',
    'Earl Springs',
    'Floyd 4Fingers',
    'George John Paul',
    'Harley Hell',
    'Jessie Redmann',
    'Joe Bob',
    'Ricky Maru',
    'Tommy Clumpsy Fits'
  ])




module.exports = function() {
  var next = names[i++]
  if (names.length == i) { i = 0; }
  return next
}
