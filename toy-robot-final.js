// Toy Robot!
// By [NAME REDACTED!] <-- See what I did there? ;)

/* A few caveats for this solution
	1) Input is said to be of a text format, we will make this an array with each element containing a command
		e.g. ["PLACE 1,2,NORTH", "MOVE", "LEFT", "MOVE", "REPORT"]
	2) I'm doing this in NodeJS (JavaScript)
	3) To run this one could run this directly in the Node terminal, or copy and paste it into JSBin.com and execute it there; 
		or reference it in an HTML file; so in saying that, the executed input will be located at the bottom of the functional definition.

*/

/* CODE STARTS */

"use strict"
let Robot = function(aCommands) {
	
	let iTableX = 5; // Width of Table
	let iTableY = 5; // Height of Table
	let aDir = ["NORTH","EAST","SOUTH","WEST"]; // Directions
	let sRobotDir = 0; // Sets the default based off the above array
	let aCommandSplit = [];

	// Sets default setting for robot's coordinates X, Y
	let iRobotX = 0;
	let iRobotY = 0;
	let bRobotPlaced = false; // Determines if the robot has been placed on the board...
	let aTokens = []; // Sets up a basic array to hold our tokens

	// Can I tell you I'm already enjoying programming this? :D

	/* Let's set up some basic rules here
	1) We split each element into a command and optional options (options only available with PLACE command)
	2) We iterate through each array element, anything but a starting PLACE command is ignored.
	3) As we proceed through each element, a switch command will assess the value of the command, and then takes an appropriate action.
	*/

	// Tokenizing engine
	for(let iLoop = 0, iLen = aCommands.length; iLoop < iLen; iLoop++) {
		aCommandSplit = aCommands[iLoop].toUpperCase().split(" "); // Initiates primary split, ensuring all commands are upper case
		if(aCommandSplit.length == 2) {
			aCommandSplit[1] = aCommandSplit[1].split(","); // split parameters
		} else {
			aCommandSplit[1] = []; // defafult
		}
		aTokens.push(aCommandSplit);			
	}
	
	// Invalid Command
	let invalidCommand = function(item) {
		console.log(">> INVALID COMMAND: '"+item.join(" ")+"' IGNORED");
	};
	
	// Checks if value is below zero
	let isBelowZero = (val) => (val < 0);
	
	// Checks if value is equal to or above a certain limit
	let isBeyondTableLimit = (val,limit) => (val >= limit);
	
	// Checks if string represents a positive value
	let isPosInteger = function (str) {
		var n = Math.floor(Number(str));
		return n !== Infinity && String(n) === str && n >= 0;
	};
	
	// Checks to see if the string is a direction in the direction array
	let isDirection = (str) => !!~aDir.indexOf(str);
	
	// Returns the index of the direction string
	let whichDirection = (str) => aDir.indexOf(str);
	
	// Validates the parameters for placement
	let checkPlaceParams = (arr) => (
			(arr != []) && 								// array isn't empty
			(arr.length == 3) && 						// array contains three elements
			isPosInteger(arr[0]) && 					// element 0 is a positive integer or zero
			isPosInteger(arr[1]) && 					// element 1 is a positive integer or zero
			(typeof(arr[2]) == "string") && 			// element 2 is a string
			isDirection(arr[2]) &&						// element 2 is a direction
			!isBelowZero(+arr[0]) &&					// element 0 is equal to zero or above
			!isBelowZero(+arr[1]) &&					// element 1 is equal to zero or above
			!isBeyondTableLimit(+arr[0], iTableX) &&	// element 0 is not bigger than the table size
			!isBeyondTableLimit(+arr[1], iTableY)		// element 1 is not bigger than the table size
		);
	
	// Sets the placement
	let place = function(item) {
		if(checkPlaceParams(item[1])) {
			iRobotX = +item[1][0];
			iRobotY = +item[1][1];
			sRobotDir = whichDirection(item[1][2]);
			bRobotPlaced = true;
		}
	};
	
	// Rotates the robot left or right.
	let rotate = function(turn) {
		let newDir = (sRobotDir + ((turn=="LEFT")?3:1))%4;
		sRobotDir = newDir;
	};
	// Checks to see if the robot can move in a certain direction
	let canMove = function() {
		switch(sRobotDir) {
			case 0:	// North
				return (!isBeyondTableLimit(iRobotY+1, iTableY));
				break;
			case 1: // East
				return (!isBeyondTableLimit(iRobotX+1, iTableX));
				break;
			case 2: // South
				return (!isBelowZero(iRobotY-1));
				break;
			case 3: // West
				return (!isBelowZero(iRobotX-1));
				break;
		}
	}
	// Moves the robot
	let move = function() {
		if(sRobotDir % 2 == 1) { // If east or west
			if(sRobotDir == 1) { // if east
				iRobotX++;
			} else {
				iRobotX--;
			}
		} else {
			if(sRobotDir == 0) { // if north
				iRobotY++;
			} else {
				iRobotY--;
			}
		}
	};
	
	// Reports position and direction facing
	let report = function() {
		console.log([iRobotX,iRobotY,aDir[sRobotDir]].join(","));
	};
  
    // Step through the tokens
	aTokens.forEach(function(item, index) {
		switch (item[0]) {
			case "PLACE":
				place(item);
				break;
			case "LEFT":
			case "RIGHT":
				bRobotPlaced ? rotate(item[0]) : invalidCommand(item);
				break;
            case "MOVE":
				(bRobotPlaced && canMove()) ? move() : invalidCommand(item);
 				break;
			case "REPORT":
				bRobotPlaced ? report() : invalidCommand(item);
				break;
			default:
				invalidCommand(item);
				break;
		}
	});
};	

/* CODE ENDS */

/* EXECUTE BLOCK STARTS */
	
	// Original Test Cases
	// Robot(["PLACE 0,0,NORTH","MOVE","REPORT"]);	// 0,1,NORTH
	// Robot(["PLACE 0,0,NORTH","LEFT","REPORT"]); // 0,0,WEST
	// Robot(["PLACE 1,2,EAST","MOVE","MOVE","LEFT","MOVE","REPORT"]);	// 3,3,NORTH

	// My Test Cases
	// Robot(["PLACE 1,2,NORTH", "MOVE", "LEFT", "MOVE", "REPORT"]);      // Expected result: 0,3,WEST
	// Robot(["MOVE","PLACE 0,3,WEST","MOVE","RIGHT","MOVE","MOVE","REPORT"]); // Expected result: 0,4,NORTH
	/* NOTE: Robot should ignore first MOVE command because it hasn't been PLACE-d yet, and then ignore the second MOVE command because it can't go any further west, be able to move on the third MOVE command, but then ignore the last MOVE command because it can't go any further north. */
	//Robot(["PLACE 2,2,NORTH","KEFT","NOVE","MOVE","REPORT"]);
	/* Should ignore the "KEFT" command as it can't rotate "KEFT", then ignore the "NOVE" command, but obey the "MOVE" command. 
		Final result: 2,3,NORTH */
		
/* EXECUTE BLOCK ENDS */