// Base Grid class
Crafty.c('Grid', {
    init: function(){
        this.attr({
           w: Game.map_grid.tile.width,
           h: Game.map_grid.tile.height 
        });
    },

    at: function(x, y){
        if(x === undefined && y === undefined){
            return {x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height}
        }else{
            this.attr({x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height});
            return this;
        }
    }
});


// Base Actor class, encapsulate 2D, Canvas, Color and Grid components into single class.
Crafty.c('Actor', {
    init: function(){
        this.requires('2D, Canvas, Grid');
    }
});


// Tree class, require Actor and set it color and its solid.
Crafty.c('Tree', {
    init: function(){
        this.requires('Actor, Solid, spr_tree');
    }
});


// Bush class, require Actor and set it color and its solid.
Crafty.c('Bush', {
    init: function(){
        this.requires('Actor, Solid, spr_bush');
    }
});


// Player class, require actor and Fourway (to control movement via keyboard)
// and added collision detection to solid object.
Crafty.c('Player', {
    init: function(){
        this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
        .fourway(2)
        .onHit('Solid', this.stopMovement) //Called on collision with solid object.
        .onHit('Village', this.visitVillage) //Called on collision with a Village object.
        .reel('MovingUp', 200, 0, 0, 2)
        .reel('MovingRight', 200, 0, 1, 2)
        .reel('MovingDown', 200, 0, 2, 2)
        .reel('MovingLeft', 200, 0, 3, 2);

        // Set animation speed
        var animation_speed = 8;

        // Watch for direction changes.
        this.bind('NewDirection', function(data){
            if(data.x > 0){
                this.animate('MovingRight', animation_speed, -1);
            }else if(data.x < 0 ){
                this.animate('MovingLeft', animation_speed, -1);
            }else if(data.y > 0 ){
                this.animate('MovingDown', animation_speed, -1);
            }else if(data.y < 0 ){
                this.animate('MovingUp', animation_speed, -1);
            }else{
                this.pauseAnimation();
            }
        });

    },

    stopMovement: function(){
        this._speed = 0;

        if(this._movement){
            this.x -= this._movement.x;
            this.y -= this._movement.y;
        }
    },

    visitVillage: function(data){
        village = data[0].obj;
        village.collect();
    }
});


Crafty.c('Village', {
    init: function(){
        this.requires('Actor, spr_village');
    },

    collect: function(){
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('VillageVisited',  this);
    }
});