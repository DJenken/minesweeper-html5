/**
 *  Copyright (c) Dylan Jenken 26/04/2016.
 */

function Minefield(width, height, numMines){

    var self = this;
    self.width = width;
    self.height = height;
    self.mines = [];
    self.totalMines = numMines;

    self.grid = null;
    self.view = null;
    //Generate grid of xsize and ysize
    //self.init();
}

Minefield.prototype.init = function(gameboardElement){
    this.grid = this.generateGrid();
    this.view = this.generateView(gameboardElement);
    this.placeMines();
    this.populateAdjacentSquares();
};

Minefield.prototype.generateView = function(viewElement){


    var gridMarkup = '';

    gridMarkup += '<table id="minefield">';

    for(var curRow = 0; curRow < this.width; curRow++) {
        gridMarkup += '<tr>';

        for(var curCol = 0; curCol < this.height; curCol++) {
            gridMarkup += '<td data-row ="' + curRow + '"' + 'data-column ="' + curCol + '"';
            gridMarkup += 'class="square"></td>';
        }
    }

    gridMarkup += '</tr>';
    gridMarkup += '</table>';

    viewElement.html(gridMarkup);
    return viewElement;
};

Minefield.prototype.generateGrid = function(){

    //Create array of size
    var grid = [];

    for(var curX = 0; curX < this.width; curX++)
    {
        grid[curX] = [];
        for(var curY = 0; curY < this.height; curY++)
        {
            grid[curX][curY] = new Square();
        }
    }

    return grid;
};

Minefield.prototype.placeMines = function(){

    for(var curMine = 0; curMine < this.totalMines; curMine++)
    {
        var placingMine = true;

        var randX = 0;
        var randY = 0;

        //Put mine in random position
        while(placingMine) {
            //Generate random values between 0 and width/height
            randX = Math.floor(Math.random() * this.width);
            randY = Math.floor(Math.random() * this.height);

            //Do not overlap
            if (this.cellHasMine(randX, randY) == false) {
                this.grid[randX][randY].occupied = true;
                this.mines[this.mines.length] = {x:randX, y:randY};
                placingMine = false;
            }

        }

    }

};

Minefield.prototype.populateAdjacentSquares = function(){

    //populate adjacent squares values
    for(var curMine = 0; curMine < this.mines.length; curMine++)
    {
        //Iterate adjacent squares
        for(var adjX = this.mines[curMine].x - 1; adjX < this.mines[curMine].x + 2; adjX++){
            if(adjX < 0 || adjX >= this.grid.length){
                continue;
            }

            for(var adjY = this.mines[curMine].y - 1; adjY < this.mines[curMine].y + 2; adjY++){

                if(adjY < 0 || adjY >= this.grid.length){
                    continue;
                }
                this.grid[adjX][adjY].adjacentMines++;

            }
        }
    }

};

Minefield.prototype.cellHasMine     = function(x,y){
    return this.grid[x][y].occupied;
};

Minefield.prototype.flagSquare      = function(x,y){
    if(!this.grid[x][y].revealed && !this.grid[x][y].flagged)
    {
        this.grid[x][y].flagged = true;
        $('.square[data-row="' + x + '"][data-column="'+y+'"]').css('background-image', 'url(./images/flaggedsquare.png)');
    }
    else if(!this.grid[x][y].revealed && this.grid[x][y].flagged){
        this.grid[x][y].flagged = false;
        $('.square[data-row="' + x + '"][data-column="'+y+'"]').css('background-image', 'url(./images/emptysquare.png)');
    }
};

Minefield.prototype.revealSquare    = function(x,y){
    var revealQueue = [];

    var squareElement = $('.square[data-row="' + x + '"][data-column="'+y+'"]');

    if(this.cellHasMine(x,y)){
        squareElement.css('background-image', 'url(./images/mine.png)');
        //this.init(this.view);
        return;
    }

    revealQueue.push({x: x, y: y});

    //For every square in the squares to reveal queue
    for(var curQueue = 0; curQueue < revealQueue.length; curQueue++){

        //If the square is already revealed skip it
        if(this.grid[revealQueue[curQueue].x][revealQueue[curQueue].y].revealed) {
            continue;
        }
        //Otherwise, reveal it
        else
        {
            //Get the DOM element for current square
            squareElement = $('.square[data-row="' + revealQueue[curQueue].x + '"][data-column="'+revealQueue[curQueue].y+'"]');

            squareElement.css('background-image', 'url(./images/emptysquareclicked.png)');
            //if the square has adjacent mines
            if(this.grid[revealQueue[curQueue].x][revealQueue[curQueue].y].adjacentMines > 0){
                //reveal it and stop revealing
                switch(this.grid[revealQueue[curQueue].x][revealQueue[curQueue].y].adjacentMines){
                    case 1:
                        squareElement.css('color', '#0000ff');
                        break;
                    case 2:
                        squareElement.css('color', '#00ff00');
                        break;
                    case 3:
                        squareElement.css('color', '#ff0000');
                        break;
                    case 4:
                        squareElement.css('color', '#00ffff');
                        break;
                    case 5:
                        squareElement.css('color', '#ffff00');
                        break;
                    case 6:
                        squareElement.css('color', '#ff00ff');
                        break;
                    case 7:
                        squareElement.css('color', '#ffffff');
                        break;
                    case 8:
                        squareElement.css('color', '#000000');
                        break;
                }
                squareElement.html(this.grid[revealQueue[curQueue].x][revealQueue[curQueue].y].adjacentMines);
            }
            //otherwise, if the square has no adjacent mines, reveal the squares adjacent to this one
            else
            {
                //iterate through adjacent cells
                for(var adjX = revealQueue[curQueue].x - 1; adjX < revealQueue[curQueue].x + 2; adjX++){
                    //If the coordinate is invalid, move on to the next one
                    if(adjX < 0 || adjX >= this.grid.length){
                        continue;
                    }
                    for(var adjY = revealQueue[curQueue].y - 1; adjY < revealQueue[curQueue].y + 2; adjY++){
                        //If the coordinate is invalid, move on to the next one
                        if(adjY < 0 || adjY >= this.grid.length || (adjX == revealQueue[curQueue].x && adjY == revealQueue[curQueue].y)){
                            continue;
                        }
                        //Add the square to the queue to reveal, if it hasn't already been revealed
                        if(this.grid[adjX][adjY].revealed)
                        {
                            continue;
                        }
                        revealQueue.push({x:adjX, y:adjY});
                    }
                }
            }
        }

        this.grid[revealQueue[curQueue].x][revealQueue[curQueue].y].revealed = true;
    }
};