var Game = {

    // Specify tiles dimension.
    // xtimes: how many times tile repeated to the horizontally to build the map width
    // ytimes: how many times tile repeated to the vertically to build the map height
    map_grid: {
        tile: {
            width: 16,
            height: 16
        },
        xtimes: 24,
        ytimes: 16
    },

    // Total map width = tile width * xtimes
    width: function(){
        return this.map_grid.xtimes * this.map_grid.tile.width;
    },

    // Total map hegight = tile height * ytimes
    height: function(){
        return this.map_grid.ytimes * this.map_grid.tile.height;
    },

    // Start the game 
    start: function(){
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(87, 109, 20)');


        // Start the Game scene
        Crafty.scene('Loading');
    }
}