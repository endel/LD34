// var Module = { TOTAL_MEMORY: 256*1024*1024 };
var Ammo = require('../ammo')

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

  simulate (deltaTime) {
    this.dynamicsWorld.stepSimulation(deltaTime || 1, 2);
  }

}

module.exports = Simulation
