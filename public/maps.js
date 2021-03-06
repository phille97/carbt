
var Tile = function(){
    return {
        friction: 0,
        solid: true,
        color: "#000",
        size: TILE_SIZE,
    }
};

var rTile = Tile();
rTile.friction = 0.05;
rTile.solid = false;

var bTile = Tile();
bTile.friction = 0.5;
bTile.solid = true;
bTile.color = "#95a5a6";

var sTile = Tile();
sTile.friction = 0.5;
sTile.solid = false;
sTile.color = '#EDC9AF';

var goalTile = Object.assign(Tile(), rTile);
goalTile.friction = 0.05;
goalTile.goal = '-x'
goalTile.solid = false;
goalTile.color = 'red';


var MapLevels = {
    level_1: [
        [bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile],
        [bTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, bTile, bTile, bTile, bTile, sTile, sTile, sTile, sTile, bTile],
        [bTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, bTile, bTile, rTile, rTile, rTile, rTile, sTile, bTile],
        [bTile, rTile, rTile, sTile, sTile, bTile, bTile, sTile, rTile, rTile, rTile, rTile, bTile, rTile, rTile, rTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, sTile, bTile, bTile, bTile, bTile, bTile, rTile, rTile, rTile, sTile, rTile, rTile, sTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, rTile, rTile, rTile, rTile, rTile, bTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, rTile, rTile, rTile, rTile, rTile, bTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, rTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, rTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, rTile, rTile, rTile, bTile],
        [bTile, rTile, rTile, rTile, rTile, rTile, rTile, goalTile, rTile, bTile, bTile, bTile, bTile, rTile, rTile, rTile, rTile, rTile, bTile],
        [bTile, sTile, rTile, rTile, rTile, rTile, rTile, goalTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, bTile],
        [bTile, sTile, sTile, rTile, rTile, rTile, rTile, goalTile, rTile, rTile, rTile, rTile, rTile, rTile, rTile, bTile, bTile, bTile, bTile],
        [bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile],
        [bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile, bTile],
    ]
}
