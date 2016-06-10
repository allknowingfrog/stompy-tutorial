var canvas;
var ctx;
var pos = {
    x: 0,
    y: 0
};

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    document.addEventListener('keydown', keyDown, false);

    gameLoop();
}

function gameLoop() {
    ctx.fillStyle = 'white';
    ctx.fillRect(pos.x, pos.y, 50, 50);

    window.requestAnimationFrame(gameLoop);
}

function keyDown(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37:
            pos.x--;
            break;
        case 38:
            pos.y--;
            break;
        case 39:
            pos.x++;
            break;
        case 40:
            pos.y++;
            break;
    }
}
