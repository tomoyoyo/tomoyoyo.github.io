var gridSize = 10;
var gridCnt = 100;
var isStart = false;
var map;
var preMap;
var loop;
var density = 0.2;
var freq = 100;
var lineColor = "#eeeeee";
var aliveColor = "#00eeee";//"#ffc0cb";
var deadColor = "#000000";
var wallColor = "#dcdcdc";

var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");

init();

function init(){
	map = new Array(gridCnt);
	preMap = new Array(gridCnt);
	for (var i = 0;i < gridCnt;i++){
		map[i] = new Array(gridCnt);
		preMap[i] = new Array(gridCnt);
	}

	/*init map*/
	for(var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			map[i][j] = 0;
			preMap[i][j] = -1;
		}
	}
	paintLine();
	initMap();
}

function selfinit(){
	stop();
	var dens=myform.density.value;
	var frequency=parseInt(myform.freq.value);
	var gridc = parseInt(myform.gsize.value)

	if(frequency.length!=0 && frequency > 0){
		freq = frequency;
	}
	
	if(gridc.length!=0 && gridc > 0){
		gridCnt = gridc;
		gridSize = myCanvas.width/gridCnt;
	}
	
	if(dens.length!=0 && dens >= 0 && dens <=1){
		density = dens;
	}
	cxt.clearRect(0,0,myCanvas.width,myCanvas.height);
	init();
	/* isStart = true;
	start(); */
}
/*randomize map*/
function initMap(){
	for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			map[x][y] = (Math.random()<density) ? 1 : 0;
		}
	}
	paint();
}

function paintLine(){
	cxt.strokeStyle = lineColor;
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(0, i * gridSize);
        cxt.lineTo(gridSize * gridCnt, i * gridSize);
    }
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(i * gridSize, 0);
        cxt.lineTo(i * gridSize, gridSize * gridCnt);
    }
    cxt.stroke();
}

/*paint map*/
function paint() {
	cxt.save();
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			if(map[x][y] === preMap[x][y]){
				continue;
			}
            if (map[x][y] == 1) {
				cxt.fillStyle = aliveColor;
                cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
            }
			else if(map[x][y] == 0){
				cxt.fillStyle = deadColor;
				cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
			}
			else{
				cxt.fillStyle = wallColor;
				cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
			}
        }
    }
	cxt.restore();
}

function mouseClick(event) {
    var y = parseInt((event.offsetX) / gridSize);
    var x = parseInt((event.offsetY) / gridSize);
    map[x][y] = 2;
    paint();
}

function judge(){
	var lifecnt = 0;
	if(arguments.length === 2){
		gridx = arguments[0];
		gridy = arguments[1];
	}
	for(var i = gridx - 2;i <= gridx + 2;i++){
		if(i < 0 || i >= gridCnt || i === gridx){
			continue;
		}
		else if(map[i][gridy] == 1){
			lifecnt++;
		}
	}
	for(var i = gridy - 2;i <= gridy + 2;i++){
		if(i < 0 || i >= gridCnt || i === gridy){
			continue;
		}
		else if(map[gridx][i] == 1){
			lifecnt++;
		}
	}
	if(map[gridx][gridy] === 2){
		return 2;
	}
	else if(lifecnt === 3){
		return 1;
	}
	else if(lifecnt === 2){
		return map[gridx][gridy];
	}
	else{
		return 0;
	}
}

/*change state*/
function change(){
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			preMap[i][j] = judge(i,j);
		}
	}
	var temp;
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			temp = map[i][j];
			map[i][j] = preMap[i][j];
			preMap[i][j] = temp;
		}
	}
}
 
function start() {	
	isStart = true;
    loop = setInterval(function () {
		change();
        paint();
    }, freq);
}

function stop(){
	clearInterval(loop);
}



/*press S key to start or pause*/
$(function(){  
	$(document).keydown(function (e) {
		if (e.keyCode == 83){			
			isStart = !isStart;			
			if(isStart){
				start();
			}
			if(!isStart){
				stop();
			}
		}
		else if (e.keyCode == 27) {
			isStart = false;
			stop();
			for (var i = 0; i < gridCnt; i++) {
				for (var j = 0; j < gridCnt; j++) {
					map[i][j] = 0;
					preMap[i][j] = -1;
				}
			}
			paint();
			
		}
	})
 });