var canvas;
var ctx;
var player;
var inputs = {
    left: false,
    up: false,
    right: false,
    down: false
}

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    player = new entity(0, 0, 50, 50);

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
    if(inputs.left) {
        player.x--;
    } else if(inputs.right) {
        player.x++;
    }

    if(inputs.up) {
        player.y--;
    } else if(inputs.down) {
        player.y++;
    }

    if(player.getLeft() < 0) {
        player.setLeft(0);
    } else if(player.getRight() > canvas.width) {
        player.setRight(canvas.width);
    }

    if(player.getTop() < 0) {
        player.setTop(0);
    } else if(player.getBottom() > canvas.height) {
        player.setBottom(canvas.height);
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
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
