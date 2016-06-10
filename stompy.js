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

    gameLoop();
}

function gameLoop() {
    pos.x++;
    pos.y++;
    ctx.fillStyle = 'white';
    ctx.fillRect(pos.x, pos.y, 50, 50);

    window.requestAnimationFrame(gameLoop);
}
