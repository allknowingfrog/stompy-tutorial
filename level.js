function level() {
    this.current = 0;
    this.levels = [
        [
            [100, 550, 50, 50],
            [200, 425, 50, 50],
            [400, 350, 50, 50],
            [300, 500, 50, 50],
            [500, 300, 50, 50]
        ],
        [
            [100, 550, 50, 50]
        ]
    ];

    this.next = function() {
        var level;
        if(this.current < this.levels.length) {
            level = this.levels[this.current];
            this.current++;
        } else {
            level = [];
        }
        return level;
    };
}
