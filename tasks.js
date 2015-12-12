import path from 'path';
import fs from 'fs-extra';
import shell from 'shelljs';
import chokidar from 'chokidar';

var taskname = process.argv[2] || 'release';
var taskmap = {
  'release': release,
  'dev': dev
}
run(taskmap[taskname]);

async function release() {
  await run(clean);
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

async function js() {
  fs.emptyDirSync('release/js');
  var cmd = 'browserify src/main.js -t [babelify --stage 0] | uglifyjs -mc > release/js/main.js';
  shell.exec(cmd);
}

async function watch() {
  run(copy);
  fs.emptyDirSync('release/js');
  fs.emptyDirSync('release/css');
  var cmdJs = 'watchify src/main.js -t [babelify --stage 0] -o release/js/main.js -d -v';
  var cmdCss = 'stylus res/styles/main.styl --out release/css/main.css -w';
  var cmdServer = 'http-server release -p 8080 -s';
  watchDir('res/html', copy);
  shell.exec(`${cmdJs} & ${cmdCss} & ${cmdServer}`, {async:true});
}

// TOOLS -------------------------------------------------

function watchDir(dir, callback) {
  var watcher = chokidar.watch(dir, {
    ignored: /[\/\\]\./,
    persistent: true
  });
  watcher.on('change', function() {
    run(callback);
  });
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
