export default class Leaderboard extends PIXI.Container {

  constructor (width = 120, height = 200) {
    super();

    var margin = 6;

    this.bg = new PIXI.Graphics()
    this.bg.beginFill(0x000000)
    this.bg.drawRect(0, 0, width, height)
    this.bg.endFill()
    this.bg.alpha = 0.6
    this.addChild(this.bg)

    var textConfig = { font : '14px Arial', fill : 0xffffff, align : 'left' }

    this.title = new PIXI.Text("Leaderboard", textConfig)
    this.title.x = margin
    this.title.y = margin
    this.addChild(this.title)

    this.entries = new PIXI.Container()
    this.entries.x = margin
    this.entries.y = this.title.y + this.title.height + margin
    this.addChild(this.entries)

    this.entries.addChild(new PIXI.Text("1. Guest 1", textConfig))
    this.entries.addChild(new PIXI.Text("2. Guest 4", textConfig))
    this.entries.addChild(new PIXI.Text("3. Guest 11", textConfig))
    this.entries.addChild(new PIXI.Text("4. Guest 20", textConfig))
    this.entries.addChild(new PIXI.Text("5. Guest 25", textConfig))
    this.entries.addChild(new PIXI.Text("6. Guest 35", textConfig))
    this.entries.addChild(new PIXI.Text("7. Guest 327", textConfig))
    this.entries.addChild(new PIXI.Text("8. Guest 19308", textConfig))
    this.entries.addChild(new PIXI.Text("9. Guest 148", textConfig))
    this.entries.addChild(new PIXI.Text("10. Guest 1262", textConfig))

    this.sort()
  }

  update () {
  }

  sort () {
    this.entries.children.forEach((text, i) => {
      text.y = text.height * i
    })
  }

}
