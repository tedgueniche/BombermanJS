var map_height = 13;
var map_width = 13;
var map = new Array(9);
for(var i = 0; i < map_width; i++)
	map[i] = new Array(map_height);





function map_fill(val, tab)
{
	for(var x = 0; x < map_width; x++)
	{
		for(var y = 0 ; y < map_height; y++)
		{
			if(tab == undefined)
			{
				map[x][y] = val;
			}
			else
			{
				for(var z = 0; z < tab.length; z++)
				{
					if(tab[z][0] == x && tab[z][1] == y)
					{
						map[x][y] = val;
					}
				}	
			}
		}
	}
}

function map_fill_around(val)
{
	for(var i = 0 ; i < map_width; i++)
	{
		map[i][0] = val;
		map[i][map_height - 1] = val;
	}
	for(var i = 0 ; i < map_height; i++)
	{
		map[0][i] = val;
		map[map_width - 1][i] = val;
	}
}

function map_display()
{
	var buf = "";
	for(var x = 0; x < map_width; x++)
	{
		for(var y = 0 ; y < map_height; y++)
		{
			buf += map[x][y] + " ";
		}
		buf += "</br>";
	}
}

function map_fill_boxes(val, ratio, boxes)
{
	for(var x = 0; x < map_width; x++)
	{
		for(var y = 0 ; y < map_height; y++)
		{
			if(map[x][y] == 0)
			{
				var isBox = true;
				for(var z = 0; z < boxes.length; z++)
				{
					
					if(boxes[z][0] == x && boxes[z][1] == y)
					{
						isBox = false;
					}
				}
				if(isBox == true)	{
					if(	(Math.random() * 100) <= ratio)
							map[x][y] = val;
				}
			}
		}
	}
}


//Respawn
map_respawn = [];
map_respawn.push([1,1]);
map_respawn.push([9,9]);
map_respawn.push([9,1]);
map_respawn.push([1,9]);

//Walls
map_walls = [];
map_walls.push([2,2]);	map_walls.push([4,2]);	map_walls.push([6,2]);	map_walls.push([8,2]);	map_walls.push([10,2]);
map_walls.push([2,4]);	map_walls.push([4,4]);	map_walls.push([6,4]);	map_walls.push([8,4]);	map_walls.push([10,4]);
map_walls.push([2,6]);	map_walls.push([4,6]);	map_walls.push([6,6]);	map_walls.push([8,6]);	map_walls.push([10,6]);
map_walls.push([2,8]);	map_walls.push([4,8]);	map_walls.push([6,8]);	map_walls.push([8,8]);	map_walls.push([10,8]);
map_walls.push([2,10]);	map_walls.push([4,10]);	map_walls.push([6,10]);	map_walls.push([8,10]);	map_walls.push([10,10]);



map_walls.push([3,2]);	map_walls.push([5,2]);	map_walls.push([9,2]);
map_walls.push([2,3]);	map_walls.push([10,3]);
map_walls.push([10,5]);
map_walls.push([2,7]);
map_walls.push([2,9]); map_walls.push([3,10]);	map_walls.push([10,9]);	
map_walls.push([9,10]);	map_walls.push([7,10]);	

map_walls.push([4,5]);																				
map_walls.push([7,4]);
map_walls.push([5,8]);
map_walls.push([8,7]);
																				
//Boxes
map_boxes = [];
map_boxes.push([1,1]);
map_boxes.push([1,2]);
map_boxes.push([2,1]);

map_boxes.push([9,1]);
map_boxes.push([9,2]);
map_boxes.push([8,1]);

map_boxes.push([1,9]);
map_boxes.push([1,8]);
map_boxes.push([2,9]);

map_boxes.push([9,9]);
map_boxes.push([9,8]);
map_boxes.push([8,9]);


map_fill(0);
map_fill_around(2);
map_fill(2, map_walls);
map_fill_boxes(1,60, map_boxes);
