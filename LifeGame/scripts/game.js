var gridSize = 10;
var gridCnt = 100;
var isStart = false;
var map;
var preMap;
var loop;
var density = 0.2;
var freq = 100;
var lineColor = "#eeeeee";
var aliveColor = "#ffc0cb";
var deadColor = "#000000";
var wallColor = "#dcdcdc";
var c, cxt;



var gameinit = function(){
	c = document.getElementById("myCanvas");
	cxt = c.getContext("2d");
	init();
	paintLine();
	initMap();
}

var init = function (){
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

}

var isNum = function (str){
	return (/^[+,-]?\d+(\.\d*)?$/.test(str) || /^\.\d+$/.test(str));
 };
 
 var isPositiveInt = function (str){
    return /^\+?[1-9]\d*$/.test(str);
 }
 
 var formcorrect = function (dens, frequency, gridc){
	 
	if(!isNum(frequency) || Number(frequency) <= 0){
		//alert("地图刷新帧率请输入正数");
		//alert(frequency);
		return false;
	}
	
	if(!isNum(dens) || Number(dens) < 0 || Number(dens) > 1){
		//alert("活细胞密度应为0到1之间的小数");
		return false;
	}
	
	if(!isPositiveInt(gridc) || Number(gridc) < 10 || Number(gridc) > 120){
		//alert("网格规模应为10到120之间的整数");
		return false;
	}
	
	return true;
 }

function selfinit(){
	stop();
	var dens=myform.density.value;
	var frequency=myform.freq.value;
	var gridc = myform.gsize.value;
	
	var iscorrect = formcorrect(dens, frequency, gridc);
	
	if(iscorrect){
		freq = 1000/Number(frequency);
		density = Number(dens);
		gridCnt = Number(gridc);
		gridSize = myCanvas.width/gridCnt;
		cxt.clearRect(0,0,myCanvas.width,myCanvas.height);
		gameinit();
	}

}
/*randomize map*/
var initMap = function (){
	for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			map[x][y] = (Math.random()<density) ? 1 : 0;
		}
	}
	paint();
}

var paintLine = function (){
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
var paint = function () {
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

var judge = function (gridx, gridy){
	var lifecnt = 0;
	/*if(arguments.length === 2){
		 = arguments[0];
		gridy = arguments[1];
	}*/
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
var change = function(){
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
 
var start = function () {	
	isStart = true;
    loop = setInterval(function () {
		change();
        paint();
    }, freq);
}

var stop = function (){
	//alert("stop");
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
 
 window.lifegame = gameinit;
 
 window.__test__ = {
	 judge_:judge,
	 change_:change,
	 formcorrect_ :formcorrect,
	 isNum_ :isNum,
	 isPositiveInt_ :isPositiveInt,
	 init_ :init,
	 getgridCnt:function(){
		 return gridCnt;
	 },
	 setgridCnt:function(val) {
      gridCnt = val;
	 },
	 getdensity:function(){
		 return density;
	 },
	 setdensity:function(val) {
      density = val;
	 },
	 getfreq:function(){
		 return freq;
	 },
	 setfreq:function(val) {
      freq = val;
	 },
	 getmap:function(x, y){
		 return map[x][y];
	 },
	 setmap:function(x, y, val){
		 map[x][y] = val;
	 },
 }
 
 
 