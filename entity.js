function entity(x, y, w, h) {
    this.x = x;
    this.y = y;

    this.width = w;
    this.height = h;

    this.vx = 0;
    this.vy = 0;

    this.getLeft = function() {
        return this.x;
    };

    this.getRight = function() {
        return this.x + this.width;
    };

    this.getTop = function() {
        return this.y;
    };

    this.getBottom = function() {
        return this.y + this.height;
    };

    this.setLeft = function(val) {
        this.x = val;
    };

    this.setRight = function(val) {
        this.x = val - this.width;
    };

    this.setTop = function(val) {
        this.y = val;
    };

    this.setBottom = function(val) {
        this.y = val - this.height;
    };
}
