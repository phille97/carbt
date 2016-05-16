var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Control object
var Control = {
    direction: {
        up: false,
        down: false,
        right: false,
        left: false
    },
    speed: {
        faster: false,
        slower: false
    }
};

// Map object
var GameMap = {
    tiles: [],
    draw: function(){
        var col = 0;
        var row_n = 0;
        ctx.save();
        this.tiles.forEach(function(row){
            row.forEach(function(tile){
                ctx.beginPath();
                ctx.fillStyle = tile.color;
                ctx.rect(tile.size*col, tile.size*row_n, tile.size, tile.size);
                ctx.fill();
                ctx.closePath();
                col++;
            });
            col = 0;
            row_n++;
        });
        ctx.restore();
    },
    loadLevel: function(lvlTiles) {
        this.tiles = lvlTiles;
    },
    getTile: function(x, y){
        return this.tiles[Math.floor(y/TILE_SIZE)][Math.floor(x/TILE_SIZE)];
    }
}

GameMap.loadLevel(MapLevels.level_1);

// Player object
var Car = {
    x: 50,
    y: 50,
    speed: 0,
    angle: 0,
    color: "blue",
    height: 20,
    width: 30,
    max_speed: 7, // m/s
    acceleration: 1, // m/s^2 (same val for deaccel)
    draw: function() {
        ctx.save();
        ctx.fillStyle = this.color;

        let transl_x = this.x + this.width/2;
        let transl_y = this.y + this.height/2;

        ctx.translate(transl_x, transl_y);
        ctx.rotate(this.angle * (Math.PI/180));

        ctx.rect(this.x-transl_x, this.y-transl_y, this.width, this.height);
        ctx.fill();

        ctx.restore();
    },
    update: function(delta) {
        if(Control.direction.right){
            this.angle += 5;
            if(this.angle > 360) this.angle = 0;
        }else if(Control.direction.left){
            this.angle -= 5;
            if(this.angle < 0) this.angle = 360;
        }

        if(Control.direction.up && this.speed < this.max_speed){
            this.speed++;
        }else if(Control.direction.down  && this.speed > 0){
            this.speed -= 0.5;
        }

        // Calculate the move.
        let delta_x = Math.cos(this.angle/180*Math.PI) * this.speed;
        let delta_y = Math.sin(this.angle/180*Math.PI) * this.speed;

        // Make the move.
        var futureTile = GameMap.getTile(this.x + this.width/2 + delta_x, this.y + this.height/2 + delta_y);
        ctx.rect(this.x, this.y, 5, 5);
        if(futureTile.solid){
            if(!GameMap.getTile(this.x + this.width/2, this.y + this.height/2 + delta_y).solid){
                this.x -= delta_x;
                this.speed = this.speed * 0.25;
            }else if(!GameMap.getTile(this.x + this.width/2 + delta_x, this.y + this.height/2).solid){
                this.y -= delta_y;
                this.speed = this.speed * 0.25;
            }else{
                this.x -= delta_x;
                this.y -= delta_y;
                this.speed = 0;
            }
        }else{
            this.x += delta_x - (delta_x * futureTile.friction);
            this.y += delta_y - (delta_y * futureTile.friction);
        }
    }
};


// User input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 39:
            Control.direction.right = true;
            break;
        case 37:
            Control.direction.left = true;
            break;
        case 38:
            Control.direction.up = true;
            break;
        case 40:
            Control.direction.down = true;
            break;
        default:
            break;
    }
}
function keyUpHandler(e) {
    switch (e.keyCode) {
        case 39:
            Control.direction.right = false;
            break;
        case 37:
            Control.direction.left = false;
            break;
        case 38:
            Control.direction.up = false;
            break;
        case 40:
            Control.direction.down = false;
            break;
        default:
            break;
    }
}


function tick(delta) {
    Car.update(delta);
}

function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    GameMap.draw();
    ctx.closePath();
    ctx.beginPath();
    Car.draw();
    ctx.closePath();
}


// Game loop logic
var tickedTime = (new Date()).getTime();
var currentTime = 0;

function gameLoop(){
    currentTime = (new Date()).getTime();
    if((currentTime - tickedTime) > 1000/TPS) {
        tick(currentTime - tickedTime - (1000 / TPS));
        tickedTime = (new Date()).getTime();
    }
    draw();
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
