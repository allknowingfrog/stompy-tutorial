var canvas;
var ctx;
var score;
var highScore = 0;
var player;
var airborn;
var jumpTimer = 0;
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false
}
var spritesheet = new Image();
var sprites = {
    left: new sprite(30, 38, 30, 38),
    right: new sprite(0, 0, 30, 38),
    rightJump: new sprite(30, 0, 30, 38),
    leftJump: new sprite(0, 38, 30, 38)
};
var facingRight = true;
var platforms = [];
var target;
var timestamp = Date.now();

var ACCEL = 200;
var MAX_VELOCITY = 100;
var MIN_VELOCITY = .5;
var JUMP_VELOCITY = 300;
var JUMP_TIME = .2;
var FRICTION_FACTOR = 3;
var DROP_FACTOR = 3;
var GRAVITY = 500;
var LETHAL_VELOCITY = 400;
var MAX_DELTA = .03;
var EDGE_CREEP = 7;
var SCORE_SIZE = 8;

function init() {
    spritesheet.src = 'hatguy.png';

    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    platforms.push(new entity(100, 550, 50, 50));
    platforms.push(new entity(200, 425, 50, 50));
    platforms.push(new entity(400, 350, 50, 50));

    target = new entity(0, 0, 10, 10);
    moveTarget();

    player = new entity(0, 0, 30, 38);
    reset();

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    gameLoop();
}

function reset() {
    score = 0;
    player.vx = 0;
    player.vy = 0;
    player.setLeft(0);
    player.setBottom(canvas.height);
    moveTarget();
}

function moveTarget(hit) {
    if(hit) {
        score += 5;
        if(score > highScore) highScore = score;
    }

    var platform = pick(platforms);
    target.setMidX(platform.getMidX());
    target.setMidY(platform.getTop() - platform.halfHeight);
}

function gameLoop() {
    updatePosition();
    handleCollision();
    updateCanvas();
    window.requestAnimationFrame(gameLoop);
}

function updatePosition() {
    var now = Date.now();
    var delta = (now - timestamp) / 1000;
    if(delta > MAX_DELTA) delta = MAX_DELTA;
    timestamp = now;

    if(inputs.left) {
        if(!airborn && player.vx > 0) {
            player.vx -= delta * player.vx * FRICTION_FACTOR;
        }
        player.vx -= delta * ACCEL;
    } else if(inputs.right) {
        if(!airborn && player.vx < 0) {
            player.vx -= delta * player.vx * FRICTION_FACTOR;
        }
        player.vx += delta * ACCEL;
    } else if(!airborn) {
        player.vx -= delta * player.vx * FRICTION_FACTOR;
    }

    if(inputs.up) {
        if(!airborn) {
            jumpTimer = JUMP_TIME;
            player.vy = -JUMP_VELOCITY;
        }

        if(jumpTimer > 0) {
            jumpTimer -= delta;
        } else {
            player.vy += delta * GRAVITY;
        }

    } else {
        if(jumpTimer) jumpTimer = 0;
        if(player.vy < 0) player.vy -= delta * player.vy * DROP_FACTOR;
        player.vy += delta * GRAVITY;
    }

    if(player.vx > MAX_VELOCITY) {
        player.vx = MAX_VELOCITY;
    } else if(player.vx < -MAX_VELOCITY) {
        player.vx = -MAX_VELOCITY;
    } else if(Math.abs(player.vx) < MIN_VELOCITY) {
        player.vx = 0;
    }

    player.x += delta * player.vx;
    player.y += delta * player.vy;
}

function handleCollision() {
    airborn = true;

    var platform, dx, dy;
    for(var p=0; p<platforms.length; p++) {
        platform = platforms[p];
        if(collideRect(player, platform)) {
            dx = (platform.getMidX() - player.getMidX()) / platform.width;
            dy = (platform.getMidY() - player.getMidY()) / platform.height;

            //horizontal
            if(Math.abs(dx) > Math.abs(dy)) {
                if(dx < 0) {
                    if(player.vx < 0) player.vx = 0;
                    player.setLeft(platform.getRight());
                } else {
                    if(player.vx > 0) player.vx = 0;
                    player.setRight(platform.getLeft());
                }

                //vertical
            } else {
                if(dy < 0) {
                    if(player.vy < 0) player.vy = 0;
                    player.setTop(platform.getBottom());
                } else {
                    if(player.vy > 0) player.vy = 0;
                    if(player.vy > LETHAL_VELOCITY) reset();
                    player.setBottom(platform.getTop());
                    if(Math.abs(player.vx) < EDGE_CREEP) {
                        var x = player.getMidX();
                        if(x < platform.getLeft() && !inputs.right) {
                            player.vx = -EDGE_CREEP;
                        } else if(x > platform.getRight() && !inputs.left) {
                            player.vx = EDGE_CREEP;
                        }
                    }
                    airborn = false;
                }
            }
        }
    }

    if(collideRect(player, target)) moveTarget(true);

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
        if(player.vy > LETHAL_VELOCITY) reset();
        player.setBottom(canvas.height);
        player.vy = 0;
        airborn = false;
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(pad(highScore, SCORE_SIZE), 30, 40);
    ctx.fillText(pad(score, SCORE_SIZE), 30, 70);

    if(player.vx > 0) {
        facingRight = true;
    } else if(player.vx < 0) {
        facingRight = false;
    }

    var sprite;
    if(airborn) {
        if(facingRight) {
            sprite = sprites.rightJump;
        } else {
            sprite = sprites.leftJump;
        }
    } else {
        if(facingRight) {
            sprite = sprites.right;
        } else {
            sprite = sprites.left;
        }
    }

    ctx.drawImage(spritesheet, sprite.x, sprite.y, sprite.width, sprite.height, player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'red';
    var platform;
    for(var p=0; p<platforms.length; p++) {
        platform = platforms[p];
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    ctx.fillStyle = 'blue';
    ctx.fillRect(target.x, target.y, target.width, target.height);
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

function collideRect(a, b) {
    if(a.getLeft() > b.getRight()) return false;

    if(a.getTop() > b.getBottom()) return false;

    if(a.getRight() < b.getLeft()) return false;

    if(a.getBottom() < b.getTop()) return false;

    return true;
}
