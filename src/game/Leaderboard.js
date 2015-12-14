export default class Leaderboard extends PIXI.Container {

  constructor (players, width = 120, height = 200) {
    super();

    this.players = players

    this.margin = 6;

    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, 0, width, height)
    this.bg.endFill()
    this.bg.alpha = 0.6
    this.addChild(this.bg)

    var textConfig = { font : '14px Arial', fill : 0xffffff, align : 'left' }

    this.title = new PIXI.Text("Leaderboard", textConfig)
    this.title.x = this.margin
    this.title.y = this.margin
    this.addChild(this.title)

    this.entries = new PIXI.Container()
    this.entries.x = this.margin
    this.entries.y = this.title.y + this.title.height + this.margin
    this.addChild(this.entries)

    this.entries.addChild(new PIXI.Text("1. ", textConfig))
    this.entries.addChild(new PIXI.Text("2. ", textConfig))
    this.entries.addChild(new PIXI.Text("3. ", textConfig))
    this.entries.addChild(new PIXI.Text("4. ", textConfig))
    this.entries.addChild(new PIXI.Text("5. ", textConfig))
    this.entries.addChild(new PIXI.Text("6. ", textConfig))
    this.entries.addChild(new PIXI.Text("7. ", textConfig))
    this.entries.addChild(new PIXI.Text("8. ", textConfig))
    this.entries.addChild(new PIXI.Text("9. ", textConfig))
    this.entries.addChild(new PIXI.Text("10. ", textConfig))
  }

  update () {
    var values = []
    for (var i in this.players) {
      values.push(this.players[i])
    }

    var headerHeight = this.entries.y
    var top10 = values.filter(player => player.lapCount > 0).
      sort((a,b) => a.bestLap > b.bestLap).
      slice(0, 10)

    this.bg.height = headerHeight + this.margin + top10.length * this.entries.children[0].height

    this.entries.children.forEach((entry, i) => {
      if (top10[i]) {
        var seconds = Math.floor((top10[i].bestLap || 0) / 1000)
        entry.text = `${ i + 1 }. ${ top10[i].playerName.text } - ${ seconds }`
        entry.y = i * entry.height
        entry.visible = true
      } else {
        entry.visible = false
      }
    })

    console.log("update", top10)
  }

}
