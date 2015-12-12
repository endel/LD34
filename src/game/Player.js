import Entity from './Entity';

export default class Player extends Entity {
  constructor() {
    super(0xFFFF00, 32, 64);
  }

  update(delta) {
  }
}
