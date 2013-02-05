
var world = document.getElementById('world');
var width = 650;
var height = 650;

var w = world.getContext('2d');
world.width = width;
world.height = height;

var bmax = 4;
var blist = [];
var bomb_timer = 1.5; //seconds before exploding
var bomb_explode_time = 0.5; //seconds of explosion
var refresh_rate = 50;
var bsize = 25
var wsize = 50;
var death_time = 2;
var respawn_time = 2;


function ajoueur(x,y,size,color,vx,vy, kup, kdown, kleft, kright, kbomb)
{
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.colorIntensity = 0;
	this.vx = vx;
	this.vy = vy;
	
	this.bspeed = 2;
	this.bonus_list = [];
	
	this.state = 0; //0: ok, 1: dead, 2: respawn
	this.stateTimer = 0;
	
	this.kup = kup;
	this.kdown = kdown;
	this.kleft = kleft;
	this.kright = kright;
	this.kbomb = kbomb;
	
	this.bomb_x = 0;
	this.bomb_y = 0;
	this.bomb_size = 2;
	this.bomb_state = 0; // 0: nothing, 1: want to drop, 2: droppped, 3: explode
	this.bomb_tick = 0;
	

}

//param: postion x, position y, dimensions, color, vector x, vector y, keys
blist.push(new ajoueur(0,0,bsize, '51,255,51',0, 0, 'W', 'S', 'A', 'D', ' '));
blist.push(new ajoueur(0,height - bsize,bsize, '255,255,51',0, 0,'I', 'K', 'J', 'L', 'P'));
blist.push(new ajoueur(width - bsize,0,bsize, '51,255,255',0, 0, '&', '(', '%', '\'', '.'));
blist.push(new ajoueur(width - bsize,height - bsize,bsize, '255,153,51',0, 0, 'e', 'b', 'a', 'c', '`'));

for(var i = 0; i < bmax; i++)
{
	blist[i].x = map_respawn[i][0] * wsize;
	blist[i].y = map_respawn[i][1] * wsize;
}

//shape the map with a click
document.onclick = function(e)
{
	//getting relative position of mouse inside world (convas)
	var x = e.pageX - ((window.innerWidth - width) / 2);
	var y = e.pageY - 50;
	
	if(x > 0 && x < width && y > 0 && y < height)
	{
		var case_x = Math.floor(x / wsize);
		var case_y = Math.floor(y / wsize);
		var cur_val = map[case_x][case_y];
		var new_val = (cur_val + 1) % 3;
		
		map[case_x][case_y] = new_val;
		
		
	}
}


//map the keyboard event
document.onkeydown = function(e)
{
	for(var i = 0; i < bmax; i++)
	{
		if(String.fromCharCode(e.keyCode) == blist[i].kleft)
			blist[i].vx = -1;

		else if(String.fromCharCode(e.keyCode) == blist[i].kright)
			blist[i].vx = 1;

		else if(String.fromCharCode(e.keyCode) == blist[i].kup)
			blist[i].vy = -1;

		else if(String.fromCharCode(e.keyCode) == blist[i].kdown)
			blist[i].vy = 1;

		else if(String.fromCharCode(e.keyCode) == blist[i].kbomb)
			if(blist[i].bomb_state == 0)
				blist[i].bomb_state = 1;
	}
}

//map the keyboard event
document.onkeyup = function(e)
{
	for(var i = 0; i < bmax; i++)
	{
		if(String.fromCharCode(e.keyCode) == blist[i].kleft)
			blist[i].vx = 0;

		else if(String.fromCharCode(e.keyCode) == blist[i].kright)
			blist[i].vx = 0;

		else if(String.fromCharCode(e.keyCode) == blist[i].kup)
			blist[i].vy = 0;

		else if(String.fromCharCode(e.keyCode) == blist[i].kdown)
			blist[i].vy = 0;

		else if(String.fromCharCode(e.keyCode) == blist[i].kbomb)
		{}
	}
}

//clear the screen
var clear = function()	
{
	w.fillStyle = '#333333';
	w.beginPath();
	w.rect(0,0,width, height);
	w.closePath();
	w.fill();
}

//update all player's position
var updateBomberPos = function()	
{
	for(var i = 0; i< bmax; i++) //for each player
	{
		if(blist[i].vx != 0 || blist[i].vy != 0) //if the player want to change position
		{		
			tmp_x = blist[i].x + (blist[i].vx * blist[i].bspeed);
			tmp_y = blist[i].y + (blist[i].vy * blist[i].bspeed);
			
			//is player already in a bomb?
			var isOnBomb = false;
			var result = getCaseTypePlayer(blist[i].x, blist[i].y);
			for(var x = 0; x < result.length; x++)
			{
				if(result[x].val == 3)
					isOnBomb = true;
			}
			
			
			//X - 
			var isOk = true;
			var result = getCaseTypePlayer(tmp_x, blist[i].y);
			for(var x = 0; x < result.length; x++)
			{
				if(!isOnBomb && result[x].val > 0)
				{
					isOk = false;
				}
				else if(isOnBomb && result[x].val != 3 && result[x].val > 0)
				{
					isOk = false;
				}
			}
			if(isOk == true)
				blist[i].x = tmp_x;
			
			//Y
			var isOk = true;
			var result = getCaseTypePlayer(blist[i].x, tmp_y);
			for(var y = 0; y < result.length; y++)
			{
				if(!isOnBomb && result[y].val > 0)
				{
					isOk = false;
				}
				else if(isOnBomb && result[y].val != 3 && result[y].val > 0)
				{
					isOk = false;
				}
					
			}
			if(isOk == true)
				blist[i].y = tmp_y;
		}
	}
}

//Return a list of case based on the player coordinate - using pixels and not case number as parameter
var getCaseTypePlayer = function(x, y)
{
	if(0 < x && y < (width - bsize))
	{
		if(0 < x && y < (height - bsize))
		{
			var result = [];
			var tmp = [];
			tmp.push([Math.floor(	x / wsize	), Math.floor(	y / wsize	)]);
			tmp.push([Math.floor(	(x+ bsize) / wsize	), Math.floor(	(y + bsize) / wsize)	]);
			tmp.push([Math.floor(	x/ wsize	), Math.floor((y + bsize) / wsize)]);
			tmp.push([Math.floor(	(x+ bsize) / wsize	), Math.floor(y / wsize)]);

			for(var k = 0; k < tmp.length; k++)
			{	
				function buf(xx, yy)
				{
					this.val = map[xx][yy];
					this.x = tmp[k][0];
					this.y = tmp[k][1];
				}
				
				result.push( new buf(tmp[k][0], tmp[k][1]) );
				delete buf;
			}
		}
	}
	return result;
}

//kill a player
var kill = function(i)
{
	var spawnPt = Math.floor(Math.random() * 3);
	blist[i].x = wsize * map_respawn[spawnPt][0];
	blist[i].y = wsize * map_respawn[spawnPt][1];
	blist[i].state = 1; //is dead
	blist[i].stateTimer = death_time * refresh_rate;
}

//
var draw_bomb = function(id, x, y)	
{	
	var tmp_x = Math.floor(x / wsize);
	var tmp_y = Math.floor(y / wsize);
	
	map[tmp_x][tmp_y] = 3;
	
	draw_case('#cc0000', x, y);
}

//draw a case
var draw_case = function(color, x, y, val)
{
	w.fillStyle = color;
	w.beginPath();
	
	var tmp_x = wsize * Math.floor(x / wsize);
	var tmp_y = wsize * Math.floor(y / wsize);
	
	if(val != undefined)
		map[tmp_x][tmp_y] = val;
	
	w.rect(tmp_x,tmp_y,wsize, wsize);
	w.closePath();
	w.fill();
}

//explode a case
var explodeCase = function(x, y)
{
	//placing a bonus if needed
	var bonusId = Math.floor(Math.random() * bonus_list.length);
	
	var prob = bonus_list[bonusId][0];
	
	//if bonus is choose to be placed
	if( (100 / prob) > (Math.random() * 100) )
	{
		map[x][y] = 0 - (bonusId + 1);
	}	
	//redrawing this case
}

//returning the list of player on this case (x and y are in case not pixel)
var playersOnThisCase = function(x, y)
{
	var result = [];
	for(var i = 0 ; i < bmax; i++)
	{
		var tmp_x = Math.floor(blist[i].x /wsize);
		if(Math.floor(blist[i].x /wsize) == x && Math.floor(blist[i].y /wsize) == y)
			result.push(i);
			
		else if(Math.floor( (blist[i].x + bsize) /wsize) == x && Math.floor( (blist[i].y + bsize) /wsize) == y)
			result.push(i);
	}
	return result;
}


var generateExplosion = function(x, y, size)
{
	var result = [];
	var tmp_x =  Math.floor(x /wsize);
	var tmp_y = Math.floor(y /wsize);
	
	//contains the vectors for the explosions
	var pos = [];
	pos.push([-1, 0]);
	pos.push([1, 0]);
	pos.push([0, -1]);
	pos.push([0, 1]);
	
	//draw_case('rgba(255,51,51,' + intensity + ')', tmp_x * wsize, tmp_y *wsize);
	result.push([tmp_x, tmp_y]);
	var keepGoing = true;
	
	
	//for each vector
	for(var k = 0; k < pos.length; k++)
	{
		//resetting the coordonate
		var tmp_x =  Math.floor(x /wsize);
		var tmp_y = Math.floor(y /wsize);
		var keepGoing = true;
		
		//for the size of the explosion
		for(var i = 1 ; i <= size && keepGoing == true; i++)
		{
			//using the vector (direction) of the explosion
			tmp_x += pos[k][0];
			tmp_y += pos[k][1];
			
			//if those coordonates are not outside the map
			if(tmp_x > 0 && tmp_x < map_width && tmp_y > 0 && tmp_y < map_height)
			{
				//if it is not a wall
				if(map[tmp_x][tmp_y] < 2)
				{	
					//if it is a box
					if(map[tmp_x][tmp_y] == 1)
					{	
						map[tmp_x][tmp_y] = 0;
						explodeCase(tmp_x, tmp_y);
						keepGoing = false; //stop the explosion in that direction
						
					}
					else //it is an empty spot
					{
						var list = playersOnThisCase(tmp_x, tmp_y);
						for(var j = 0; j < list.length; j++)
							kill(list[j]);
					}
					
					//draw explosion
					//draw_case('rgba(255,51,51,' + intensity + ')', tmp_x * wsize, tmp_y *wsize);	
					result.push([tmp_x, tmp_y]);
				}
				else //it is a wall
				{
					keepGoing = false; //stop the explosion in that direction
				}
			}
		}
	}
	
	return result;
}


//detonate a bomb
var detonateBomb = function(list, intensity)	
{
	for(var i = 0 ; i < list.length; i++)
	{
		draw_case('rgba(255,51,51,' + intensity + ')', list[i][0] * wsize, list[i][1] *wsize);
	}
}

//Bomb controller
var updateBomberBomb = function()
{
	for(var i = 0; i< bmax; i++)
	{
		if(blist[i].bomb_state == 1) //want to drop a bomb
		{
			blist[i].bomb_x = blist[i].x + (bsize /2);
			blist[i].bomb_y = blist[i].y + (bsize /2);
			draw_bomb(i, blist[i].bomb_x, blist[i].bomb_y);
			blist[i].bomb_state = 2;
			blist[i].bomb_tick = bomb_timer * refresh_rate;
		}
		else if(blist[i].bomb_state == 2)
		{
			draw_bomb(i, blist[i].bomb_x, blist[i].bomb_y);
			
			if(blist[i].bomb_tick < 1)
			{
				blist[i].bomb_state = 3;
				blist[i].bomb_tick = bomb_explode_time * refresh_rate;
			}
			else
				blist[i].bomb_tick -= 1;
		}
		else if(blist[i].bomb_state == 3)
		{
			tmp_x = Math.floor(blist[i].bomb_x / wsize);
			tmp_y = Math.floor(blist[i].bomb_y / wsize);
			map[tmp_x][tmp_y] = 0;
			
			var intensity = blist[i].bomb_tick / (bomb_explode_time * refresh_rate);
			var firstTime = ( (bomb_explode_time * refresh_rate) == blist[i].bomb_tick);
			
			//detonateBomb(intensity, blist[i].bomb_x, blist[i].bomb_y, firstTime);
			if(firstTime == true)
				list = generateExplosion(blist[i].bomb_x, blist[i].bomb_y, blist[i].bomb_size);
			detonateBomb(list, intensity);
			
			blist[i].bomb_tick -= 1;
			
			
			if(blist[i].bomb_tick < 1)
				blist[i].bomb_state = 0;
		}
	}
}

var pickUpBonus = function()
{
	for(var i = 0 ; i < bmax; i++)
	{
		var pos = getCaseTypePlayer(blist[i].x, blist[i].y);
		for(var j = 0 ; j < pos.length; j++)
		{
			if(map[pos[j].x][pos[j].y] < 0)
			{
				var id = (0 - pos[j].val) - 1; //getting correct id f the bonus
				
				bonus_list[id][1].data.ticks = bonus_list[id][1].ticks;
				bonus_list[id][1].effect(blist[i]);
				blist[i].bonus_list.push(bonus_list[id][1]); //add bonus in the player bonus list
				map[pos[j].x][pos[j].y] = 0; //removing bonus from the map
			}
		}
	}
}

var updatePlayerBonus = function()
{
	for(var i = 0 ; i < bmax; i++)
	{
		var buf = blist[i].bonus_list;
		for(var j = 0 ; j < buf.length; j++)
		{
			if(buf[j].data.ticks > 0)
			{
				buf[j].data.ticks = (((buf[j].data.ticks * 50)  - 1) / 50);
				buf[j].effect(blist[i]);
			}
			else
			{				
				buf[j].restore(blist[i]);
				blist[i].bonus_list.splice(j, 1);
			}
		}
	}
}

//
function draw_map()
{
	for(var x = 0 ; x < map_width; x++)
	{
		for(var y = 0 ; y < map_height; y++)
		{
			if(map[x][y] == 1)
				draw_case('#6699cc', x * wsize, y*wsize);
			else if(map[x][y] == 2)
				draw_case('#336699', x * wsize, y*wsize);
			
			else if(map[x][y] < 0)
			{
				//draw_case('#ffffff', x * wsize, y*wsize);
				w.fillStyle = '#ffffff';
				w.beginPath();	
				w.font = '18px "Arial", sans-serif';
				var id = (0 - map[x][y])  -1;
				
				var txt_x = w.measureText(bonus_list[id][1].data.name).width;
				
				var ntxt_x = (x * wsize) + ((wsize - txt_x) / 2);
				var ntxt_y = (y * wsize) + (((wsize - 18) / 2) + 18);
				
				w.fillText(bonus_list[id][1].data.name , ntxt_x, ntxt_y, wsize);
				w.closePath();
				w.fill();
			}
		}
	}
}

//draw each player - player controller
var drawBomber = function()	
{	
	for(var i = 0; i< bmax; i++)
	{
		w.beginPath();
		if(blist[i].state == 1)
		{
			w.fillStyle = 'rgba('+ blist[i].color +',' + 0.1 + ')';
			blist[i].stateTimer -= 1;
			if(blist[i].stateTimer < 1)
			{
				blist[i].state = 2;
				blist[i].stateTimer = respawn_time * refresh_rate;
			}
		}
		else if(blist[i].state == 2)
		{
			if(blist[i].colorIntensity < 0.5 && blist[i].colorIntensity > -0.5)
				blist[i].colorIntensity =  0.5;
			
			if (blist[i].colorIntensity > 1)
				blist[i].colorIntensity =  -1;
			
			w.fillStyle = 'rgba('+ blist[i].color +',' + Math.abs(blist[i].colorIntensity) + ')';
			blist[i].colorIntensity += 0.1;	
			
			blist[i].stateTimer -= 1;
			if(blist[i].stateTimer < 1)
				blist[i].state = 0;
		}
		else
			w.fillStyle = 'rgba('+ blist[i].color +',1)';
			
		w.rect(blist[i].x,  blist[i].y, blist[i].size,  blist[i].size);
		w.closePath();
		w.fill();
	}
}

//main controller
var gameLoop = function()	{
	clear();
	draw_map();
	updateBomberPos();
	updateBomberBomb();
	pickUpBonus();
	updatePlayerBonus();	
	drawBomber();
	
	gLoop = setTimeout(gameLoop, 1000 / refresh_rate);
}

//starting the game
gameLoop();
