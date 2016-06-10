var canvas;
var ctx;
var pos = {
    x: 0,
    y: 0
};
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

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    gameLoop();
}

function gameLoop() {
    if(inputs.left) {
        pos.x--;
    } else if(inputs.right) {
        pos.x++;
    }

    if(inputs.up) {
        pos.y--;
    } else if(inputs.down) {
        pos.y++;
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(pos.x, pos.y, 50, 50);

    window.requestAnimationFrame(gameLoop);
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
