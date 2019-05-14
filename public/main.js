var canvas = document.getElementById("gameCanvas");
var message = document.getElementById("message");
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
    // Position
    x: 50,
    y: 50,
    speed: 0,
    angle: 0,
    // Looks
    color: "blue",
    height: 20,
    width: 30,
    // Engine (GOTTA GO FAST)
    max_speed: 7, // m/s
    acceleration: 1, // m/s^2 (same val for deaccel)
    // Laptimes
    highscore: localStorage.getItem("highscore") || null,
    lap_counter: 0,
    last_lap: null,
    lap_start_time: 0,
    lap_timer: 0,
    // Functions
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
            this.angle += 5 + (this.max_speed - this.speed) * 0.5;
            if(this.angle > 360) this.angle = 0;
        }else if(Control.direction.left){
            this.angle -= 5 + (this.max_speed - this.speed) * 0.5;
            if(this.angle < 0) this.angle = 360;
        }

        if(Control.direction.up && this.speed < this.max_speed){
            this.speed++;
        }else if(Control.direction.down  && this.speed > -0.5){
            this.speed -= 0.5;
        }

        // Calculate the move.
        let delta_x = Math.cos(this.angle/180*Math.PI) * this.speed;
        let delta_y = Math.sin(this.angle/180*Math.PI) * this.speed;

        // Make the move.
        var futureTile = GameMap.getTile(this.x + this.width/2 + delta_x, this.y + this.height/2 + delta_y);
	var currentTile = GameMap.getTile(this.x + this.width/2, this.y + this.height/2);

        this.speed = this.speed * (1-futureTile.friction);

	var nextIsSolid = futureTile.solid;

	if (this.speed < 0.001) {
            this.speed = 0;
	}
	if (futureTile.goal) {
	    if (futureTile.goal === "-x" && delta_x > 0) {
                nextIsSolid = true;
	    } else if (!currentTile.goal) {
		var timeNow = (new Date()).getTime()
		if (this.lap_start_time) {
		    this.last_lap = timeNow - this.lap_start_time;
		    if (this.last_lap < this.highscore || this.highscore === null) {
	                this.highscore = this.last_lap;
			localStorage.setItem("highscore", this.highscore)
		    }
		}
		this.lap_counter ++;
	        this.lap_start_time = timeNow;
	    }
	}
	if (this.lap_start_time) {
	    this.lap_timer = (new Date()).getTime() - this.lap_start_time;
	}

        ctx.rect(this.x, this.y, 5, 5);
	if(nextIsSolid){
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
            this.x += delta_x;
            this.y += delta_y;
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

    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = "20px monospace";
    ctx.fillText("C A R B T", 40, 25);

    ctx.fillText("Highscore: "+Car.highscore+" ms", 150, 245);
    ctx.fillText("Current lap: "+ Car.lap_timer +" ms", 40, canvas.height - 60);
    ctx.fillText("Last lap:    "+ Car.last_lap +" ms", 40, canvas.height - 40);
    ctx.fill();
    ctx.closePath();
}


// Game loop logic
var tickedTime = (new Date()).getTime();
var currentTime = 0;

function gameLoop(){
    currentTime = (new Date()).getTime();
    if((currentTime - tickedTime) > 1000/TPS) {
        tick(currentTime - tickedTime - (1000 / TPS));
        tickedTime = currentTime;
    }
    draw();
    window.requestAnimationFrame(gameLoop);
}

message.innerHTML = "C A R B T<br>0.0.1"

setTimeout(() => {
    canvas.style.display = '';
    message.style.display = 'none';
    window.requestAnimationFrame(gameLoop);
}, 1000)
