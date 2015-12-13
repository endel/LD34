var MongoClient = require('mongodb').MongoClient
  , url = 'mongodb://localhost:27017/racer'
  , lapsCollection = null
  , usersCollection = null


// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  lapsCollection = db.collection('laps')
  usersCollection = db.collection('users')
});

module.exports.listByTime = function(map, callback) {
  var cursor = lapsCollection.find({map: map}).sort({time: 1}).limit(10)
  cursor.toArray(function(err, data) {
    callback(err, data)
  })
}

module.exports.listByLaps = function(map, callback) {
  var cursor = usersCollection.find({map: map}).sort({laps: -1}).limit(10)
  cursor.toArray(function(err, data) {
    callback(err, data)
  })
}

module.exports.insert = function(clientId, map, userName, time) {
  lapsCollection.find({ cid: clientId, name: userName, map: map }).count(function(err, count) {
    if (count > 0) {
      // only update laps which time is lesser
      lapsCollection.update({ cid: clientId, name: userName, map: map, time: {'$gt': time} }, { time: time })
      usersCollection.update({ cid: clientId, name: userName, map: map }, { $inc: { laps: 1 } })

    } else {
      lapsCollection.insert({ cid: clientId, name: userName, map: map, time: time, date: new Date() })
      usersCollection.insert({ cid: clientId, name: userName, map: map, laps: 1, date: new Date() })

    }

  })

}
