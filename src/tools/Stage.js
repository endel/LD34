import PIXI from 'pixi.js';

export default class Stage {
  constructor(config) {
    this.config = config;

    var rendererWidth = window.innerWidth;
    var rendererHeight = window.innerHeight;

    this.pixelRatio = 1;

    if (window.devicePixelRatio) {
      this.pixelRatio = window.devicePixelRatio;
    }

    this.windowWidth = rendererWidth*this.pixelRatio;
    this.windowHeight = rendererHeight*this.pixelRatio;
    this.scale = this.windowHeight/config.targetHeight;
    this.width = config.targetWidth*this.scale;
    this.height = config.targetHeight*this.scale;

    this.width = this.windowWidth/this.scale;
    this.height = this.windowHeight/this.scale;
    this.targetWidth = config.targetWidth;
    this.targetHeight = config.targetHeight;

    this.root = new PIXI.Container();
    this.container = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.windowWidth, this.windowHeight);
    this.root.addChild(this.container);
    this.container.position.x = this.windowWidth/2;
    this.container.position.y = this.windowHeight/2;
    this.container.scale.set(this.scale);
    this.rendering = false;
    this.onRender = null;
    this.canvas = this.renderer.view;

    this.canvas.style.width = rendererWidth + 'px';
    this.canvas.style.height = rendererHeight + 'px';
    document.body.appendChild(this.renderer.view);
  }

  render() {
    this.renderer.render(this.root);
  }

  toString() {
    var list = [];
    for (var f in this) {
      var v = this[f];
      if (typeof v === 'function' || typeof v === 'object') {
        continue;
      }
      list.push('[Stage] ' + f + ': ' + v);
    }
    return list.join('\n');
  }
}
