import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';
import chokidar from 'chokidar';
import spritesheet from 'spritesheet-js';

var taskname = process.argv[2] || 'release';
var taskmap = {
  'release': release,
  'dev': dev
}
run(taskmap[taskname]);

async function release() {
  await run(clean);
  await run(atlas);
  await run(copy);
  await run(css);
  await run(js);
}

async function dev() {
  await run(clean);
  await run(watch);
}

async function clean() {
  shell.exec('find . -name \'*.DS_Store\' -type f -delete');
  fs.emptyDirSync('release');
}

async function copy() {
  fs.ensureDirSync('release');
  fs.copySync('res/html/index.html', 'release/index.html');
}

async function css() {
  fs.emptyDirSync('release/css');
  var cmd = 'stylus res/styles/main.styl --out release/css/main.css --compress';
  shell.exec(cmd);
}

async function atlas() {
  fs.emptyDirSync('release/atlas');
  var list = [];
  forEach('res/atlas/', function(item, path) {
    list.push(new Promise(function(resolve, reject) {
      createSpritesheet(item, path, resolve, reject);
    }));
  });
  return Promise.all(list);
}

async function js() {
  fs.emptyDirSync('release/js');
  var cmd = 'browserify src/main.js -t [babelify --stage 0] | uglifyjs -mc > release/js/main.js';
  shell.exec(cmd);
}

async function watch() {
  run(atlas);
  run(copy);
  fs.emptyDirSync('release/js');
  fs.emptyDirSync('release/css');
  var cmdJs = 'watchify src/main.js -t [babelify --stage 0] -o release/js/main.js -d -v';
  var cmdCss = 'stylus res/styles/main.styl --out release/css/main.css -w';
  var cmdServer = 'http-server release -p 8080 -s';
  watchDir('res/atlas', atlas);
  watchDir('res/html', copy);
  shell.exec(`${cmdJs} & ${cmdCss} & ${cmdServer}`, {async:true});
}

// TOOLS -------------------------------------------------

function createSpritesheet(item, path, onComplete, onError) {
  var opt = {
    name: item,
    format: 'json',
    path: 'release/atlas',
    format: 'json',
    padding: 1,
    trim: true,
    powerOfTwo: false
  };

  spritesheet(path + '/**/*.png', opt, function (err) {
    if (err) {
      onError(err);
    } else {
      onComplete();
    }
  });
}

function watchDir(dir, callback) {
  var running = false;
  var watcher = chokidar.watch(dir, {
    ignored: /[\/\\]\./,
    persistent: true,
    recursive: true
  });
  watcher.on('ready', function() {
    watcher.on('change', _cb);
    watcher.on('add', _cb);
    watcher.on('unlink', _cb);
  });

  function _cb() {
    run(callback);
  }
}

function forEach(dir, fn) {
  let list = fs.readdirSync(dir);
  for (let i in list) {
    let n = list[i];
    if (n.match('DS_Store')) {
      continue;
    }
    let p = path.join(dir, n);
    fn(n, p, i);
  }
}

function log(msg) {
  console.log('[tasks]', msg);
}

function getTime() {
  var d = new Date();
  return d.getTime();
}

async function run(fn) {
  const start = getTime();
  log(`${fn.name} - start`);
  await fn();
  const time = getTime() - start;
  log(`${fn.name} - finish after ${time} ms`);
}
