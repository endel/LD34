module.exports = {
  cols: 7,
  tileSize: 32,
  map: [
    0, 1, 1, 1, 1, 3, 1,
    0, 1, 0, 0, 0, 0, 1,
    1, 1, 0, 1, 1, 4, 1,
    4, 0, 0, 3, 0, 4, 0,
    1, 1, 0, 1, 1, 4, 1,
    0, 1, 0, 0, 0, 0, 1,
    0, 1, 2, 1, 1, 1, 1,
  ],
  chunks: [
    'grass',
    'water',
    'start:right',
    'prizes',
    'woods'
  ]
};
