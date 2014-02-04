Crafty.scene('Loading', function(){

    Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css({ 'font-size': '13px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' })

    Crafty.load(['assets/16x16_forest_1.gif'], function(){

        Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
            spr_tree: [0, 0],
            spr_bush: [1, 0],
            spr_village: [0, 1],
            spr_player: [1 ,1]
        });

        Crafty.scene('Game');
    });
});


Crafty.scene('Game', function(){

    // Create an array to store grid that has been used/occupied.
    this.occupied = new Array(Game.map_grid.xtimes);

    for(var x=0; x<Game.map_grid.xtimes; x++){
        this.occupied[x] = new Array(Game.map_grid.ytimes);

        for(var y=0; y<Game.map_grid.ytimes; y++){
            this.occupied[x][y] = false;
        }
    }

    // Create Player object
    Crafty.e('Player').at(1, 1);
    this.occupied[1][1] = true;


    // Create terrain
    for(var x=0; x<Game.map_grid.xtimes; x++){
        for(var y=0; y<Game.map_grid.ytimes; y++){

            // Detect if the position at edge of map
            var at_edge = x == 0 || x == Game.map_grid.xtimes - 1 || y == 0 || y == Game.map_grid.ytimes - 1;

            // If at egde, build tile entities and color it green
            if(at_edge){
                // Create Tree object
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;

            // Else, build tile randomly an color it light green
            // place it only if the tile is not yet occupied.
            }else if(Math.random() < 0.06 && !this.occupied[x][y]){
                // Create Bush object
                Crafty.e('Bush').at(x, y);
                this.occupied[x][y] = true;

            }
        }
    }


    // Create the villages

    // Max. Villages on map
    var max_villages = 5;

    for(var x=0; x<Game.map_grid.xtimes; x++){
        for(var y=0; y<Game.map_grid.ytimes; y++){
            if(Math.random() < 0.02){
                // Create villages
                if(Crafty('Village').length < max_villages && !this.occupied[x][y]){
                    Crafty.e('Village').at(x, y);
                    this.occupied[x][y];
                }
            }
        }
    }

    this.show_victory = this.bind('VillageVisited', function(){
        if(!Crafty('Village').length){
            Crafty.scene('Victory');
        }
    });

}, function(){
    this.unbind('VillageVisited', this.show_victory);
});


Crafty.scene('Victory', function(){
    Crafty.e('2D, DOM, Text')
    .attr({x: 0, y: Game.height()/2 - 24, w: Game.width()})
    .text('Congrats!! press any KEY to continue...')
    .css({'color': 'white', 'text-align': 'center', 'font-size': '13px', 'font-family': 'Arial'});

    this.restart_game = this.bind('KeyDown', function(){
        Crafty.scene('Game');
    });
}, function(){
    this.unbind('KeyDown', this.restart_game);
});