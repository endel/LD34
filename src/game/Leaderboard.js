export default class Leaderboard extends PIXI.Container {

  constructor (players, width = 200) {
    super();

    this.players = players

    this.margin = 10;

    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, 0, width, 200)
    this.bg.endFill()
    this.bg.alpha = 0.6
    this.addChild(this.bg)

    this.title = new PIXI.Text("Leaderboard", DEFAULT_FONT, 3)
    this.title.x = this.margin
    this.title.y = this.margin
    this.addChild(this.title)

    this.entries = new PIXI.Container()
    this.entries.x = this.margin
    this.entries.y = this.title.y + this.title.height + this.margin
    this.addChild(this.entries)

    this.entries.addChild(new PIXI.Text("1. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("2. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("3. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("4. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("5. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("6. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("7. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("8. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("9. ", DEFAULT_FONT, 3))
    this.entries.addChild(new PIXI.Text("10. ", DEFAULT_FONT, 3))

    this.update()
  }

  update () {
    var values = []
    for (var i in this.players) {
      values.push(this.players[i])
    }

    var headerHeight = this.entries.y
    var top10 = values. // filter(player => player.lapCount > 0).
      sort((a,b) => (b.bestLap === 0 || a.bestLap === 0)  ? true : a.bestLap > b.bestLap).
      slice(0, 10)

    this.bg.height = headerHeight + this.margin + top10.length * this.entries.children[0].height

    this.entries.children.forEach((entry, i) => {
      if (top10[i]) {
        var seconds = (!top10[i].bestLap) ? '?' : Math.floor(top10[i].bestLap / 1000)
        entry.text = `${ i + 1 }. ${ top10[i].playerName.text } - ${ seconds }`
        entry.y = i * entry.height
        entry.visible = true
      } else {
        entry.visible = false
      }
    })
  }

}
