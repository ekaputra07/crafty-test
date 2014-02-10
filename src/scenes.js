Crafty.scene('Loading', function(){

    Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css({ 'font-size': '13px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' })

    Crafty.load([
        'assets/16x16_forest_1.gif',
        'assets/hunter.png',
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac',
        'assets/board_room_applause.mp3',
        'assets/board_room_applause.ogg',
        'assets/board_room_applause.aac',
        'assets/game.wav'], function(){

        Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
            spr_tree: [0, 0],
            spr_bush: [1, 0],
            spr_village: [0, 1]
        });

        Crafty.sprite(16, 'assets/hunter.png', {
            spr_player: [0, 2]
        }, 0, 2);

        Crafty.audio.add({
            'knock': ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
            'applause': ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
            'game': ['assets/game.wav']
        });

        Crafty.scene('Game');
    });
});


Crafty.scene('Game', function(){

    Crafty.audio.play('game');

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


    Crafty.audio.stop('game');
    Crafty.audio.play('applause');

    this.restart_game = this.bind('KeyDown', function(){
        Crafty.audio.stop('applause');
        Crafty.scene('Game');
    });
}, function(){
    this.unbind('KeyDown', this.restart_game);
});