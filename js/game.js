/**
 * Copyright (c) Dylan Jenken 26/04/2016.
 */

var game = (function(){

    function Game(){

        var self = this;
        self.minefield = new Minefield(15,15,18);

    }

    Game.prototype.init = function(){
        this.minefield.init($('#game-area'));
        this.initClickHandlers();
    };

    //Could do well to transfer this into the minefield
    Game.prototype.initClickHandlers = function(){

        var self = this;

        /* TODO: Implement fancy click/drag visuals when clicking cells

        $('.square').mousedown(function(event) {
            var clickedX = $(this).data("row");
            var clickedY = $(this).data("column");

            $(this).css('background-image', 'url(./images/emptysquareclicked.png');
        });
        */

        $('.square').mousedown(function(event) {

            var clickedX = $(this).data("row");
            var clickedY = $(this).data("column");

            switch (event.which) {
                case 1:
                    //Check if cell is a mine or not
                    self.minefield.revealSquare(clickedX, clickedY);

                    //end game
                    //or
                    //reveal square contents
                    break;
                case 2:
                    break;
                case 3:
                    //If not clicked
                        //$(this).css('background-image', 'url(./images/flaggedsquare.png)');
                    self.minefield.flagSquare(clickedX, clickedY);
                    break;
                default:
            }

            //Check if game won
        });

        $('.square').on('contextmenu', function(e){
            e.preventDefault();
        });
    };



    Game.prototype.update = function(){

    };

    return new Game();

})();

$(document).ready(function(){
    game.init();
    game.update();
});