// var Module = { TOTAL_MEMORY: 256*1024*1024 };
var Ammo = require('../ammo')

var ammoVec1 = new Ammo.btVector3()
  , ammoVec2 = new Ammo.btVector3()

class Simulation {

  constructor () {

    this.transform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking

    // Bullet-interfacing code
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.overlappingPairCache = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
    this.dynamicsWorld.setGravity(new Ammo.btVector3(0, 0, 0));
  }

  add (startX, startY) {
    var groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(startX, startY, 0));

    var mass = 1;
    var localInertia = new Ammo.btVector3(0, 0, 0);
    var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));
    boxShape.calculateLocalInertia(mass, localInertia);

    var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, boxShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    this.dynamicsWorld.addRigidBody(body);

    return body
  }

  remove (body) {
    this.dynamicsWorld.removeRigidBody(body)
  }

  applyForce (body, vec1, vec2) {
    ammoVec1.setValue(vec1.x, vec1.y, 0)
    ammoVec2.setValue(vec2.x, vec2.y, 0)
    body.applyForce(ammoVec1, ammoVec2);
  }

  simulate (deltaTime) {
    this.dynamicsWorld.stepSimulation(deltaTime || 1, 2);
  }

}

module.exports = Simulation
