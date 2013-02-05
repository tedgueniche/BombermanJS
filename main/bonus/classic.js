//Define a bonus
function bonus( name, ticks) {
	this.name = name; 	//bonus's name
	this.ticks = ticks; //bonus length in ticks
	this.isBonus = true;
}

//Boost the player's speed
function speed_up_bonus(){
	this.ticks = 10; //default value
	
	this.effect = function(target) {
		target.bspeed  = 4.0;
	}
	
	this.restore = function(target){
		target.bspeed = 2;
	}
	
	this.data = new bonus("fast", this.ticks);
}

//Slow the player
function speed_down_bonus(){
	this.ticks = 10; //default value
	
	this.effect = function(target) {
		target.bspeed  = 1.3;
	}
	
	this.restore = function(target){
		target.bspeed = 2;
	}
	
	this.data = new bonus("slow", this.ticks);
}


//Increase the player's bomb reach (permanent)
function increase_bomb(){
	this.ticks = -1; //default value
	
	this.effect = function(target) {
		target.bomb_size  += 1;
	}
	
	this.restore = function(target){
	}
	
	this.data = new bonus("+", this.ticks);
}

//List of possible bonuses
var bonus_list = [];
bonus_list.push([6,new speed_down_bonus()]); 
bonus_list.push([3,new speed_up_bonus()]);
bonus_list.push([3,new increase_bomb()]);

