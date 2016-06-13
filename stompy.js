var canvas;
var ctx;
var player;
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false
}
var platforms = [];
var timestamp = Date.now();

var ACCEL = 200;
var MAX_VELOCITY = 100;
var MIN_VELOCITY = .5;
var FRICTION_FACTOR = 3;
var MAX_DELTA = .03;

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    player = new entity(0, 0, 50, 50);

    platforms.push(new entity(100, 100, 50, 50));
    platforms.push(new entity(200, 400, 50, 50));
    platforms.push(new entity(400, 300, 50, 50));

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    gameLoop();
}

function gameLoop() {
    updatePosition();
    updateCanvas();
    window.requestAnimationFrame(gameLoop);
}

function updatePosition() {
    var now = Date.now();
    var delta = (now - timestamp) / 1000;
    if(delta > MAX_DELTA) delta = MAX_DELTA;
    timestamp = now;

    if(inputs.left) {
        player.vx -= delta * ACCEL;
    } else if(inputs.right) {
        player.vx += delta * ACCEL;
    } else {
        player.vx -= delta * player.vx * FRICTION_FACTOR;
    }

    if(inputs.up) {
        player.vy -= delta * ACCEL;
    } else if(inputs.down) {
        player.vy += delta * ACCEL;
    } else {
        player.vy -= delta * player.vy * FRICTION_FACTOR;
    }

    if(player.vx > MAX_VELOCITY) {
        player.vx = MAX_VELOCITY;
    } else if(player.vx < -MAX_VELOCITY) {
        player.vx = -MAX_VELOCITY;
    } else if(Math.abs(player.vx) < MIN_VELOCITY) {
        player.vx = 0;
    }

    if(player.vy > MAX_VELOCITY) {
        player.vy = MAX_VELOCITY;
    } else if(player.vy < -MAX_VELOCITY) {
        player.vy = -MAX_VELOCITY;
    } else if(Math.abs(player.vy) < MIN_VELOCITY) {
        player.vy = 0;
    }

    player.x += delta * player.vx;
    player.y += delta * player.vy;

    if(player.getLeft() < 0) {
        player.setLeft(0);
        player.vx = 0;
    } else if(player.getRight() > canvas.width) {
        player.setRight(canvas.width);
        player.vx = 0;
    }

    if(player.getTop() < 0) {
        player.setTop(0);
        player.vy = 0;
    } else if(player.getBottom() > canvas.height) {
        player.setBottom(canvas.height);
        player.vy = 0;
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'red';
    var platform;
    for(var p=0; p<platforms.length; p++) {
        platform = platforms[p];
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function keyDown(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37:
            inputs.left = true;
            break;
        case 38:
            inputs.up = true;
            break;
        case 39:
            inputs.right = true;
            break;
        case 40:
            inputs.down = true;
            break;
    }
}

function keyUp(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37:
            inputs.left = false;
            break;
        case 38:
            inputs.up = false;
            break;
        case 39:
            inputs.right = false;
            break;
        case 40:
            inputs.down = false;
            break;
    }
}
