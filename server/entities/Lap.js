'use strict';

class Lap {

  constructor () {
    this.clear()
  }

  checkpoint (number) {
    var index = this.checkpoints.indexOf(number)
      , previousIndex = this.checkpoints.indexOf(number-1);

    if (index === -1 && (number === 1 || previousIndex === number - 2)) {
      console.log("Checkpoint: ", number)
      this.checkpoints.push(number)
      return true;
    }
  }

  validate (lastCheckpoint) {
    return (
      (this.checkpoints[ this.checkpoints.length-1 ] === lastCheckpoint) &&
      (this.checkpoints.length == lastCheckpoint)
    )
  }

  clear () {
    this.checkpoints = []
  }

}

module.exports = Lap
