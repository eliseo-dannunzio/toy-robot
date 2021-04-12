const { place, rotate, move, report } = require('./tr-commands');
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let limits = {x: 5, y: 5}; // Width and Height of Table
let robot = {x: 0, y: 0, direction: 0, placed: false}; // Sets robot position, direction and placement flag
let runningFile = false; // Used to error trap against 'RUN' commands within files

const runFile = function(filename) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            return console.log('ERR ', err);
        }
        parseFile(data);
    });
};

// Parse the file being read
const parseFile = function(data) {
	runningFile = true;
    var commandList = data.split('\r\n');
    for (var j = 0; j < commandList.length; j++) {
        let commands = commandList[j].trim().split(' ');
    	let commandArr = [commands.shift()];
        commandArr.push(...(commands.join('').split(',')));
        doCommand(commandArr);
    }
    runningFile = false;
};

// Perform the command
const doCommand = function(commandArr) {
	if(commandArr[0] !== '') {
		switch (commandArr[0].toUpperCase()) {
			case 'HELP':
				console.log('**** HELP ****');
				console.log('HELP - Shows this screen');
				console.log('EXIT - Exits program');
				console.log('PLACE <x>,<y>,<direction> - Places TR on the grid at <x>,<y> facing direction <direction>');
				console.log('LEFT - Turns TR left 90 degrees');
				console.log('RIGHT - Turns TR right 90 degrees');
				console.log('MOVE - Moves TR forward in current direction if able to move forward on grid');
				console.log('REPORT - reports current location and direction');
				console.log('RUN <filename> - Runs TR script in file <filename>');
				break;
			case 'EXIT':
	            rl.close();
	            process.exit(0);
				break;
			case 'PLACE':
				let [x, y, direction] = [commandArr[1], commandArr[2], (commandArr[3] || '').toUpperCase()];
				robot = place(x, y, direction, robot, limits);				
				break;
			case 'LEFT':
				if(robot.placed) {
					robot = rotate('LEFT', robot);
				}
				break;
			case 'RIGHT':
				if(robot.placed) {
					robot = rotate('RIGHT', robot);
				}
				break;
			case 'MOVE':
				if(robot.placed) {
					robot = move(robot, limits);
				}
				break;
			case 'REPORT':
				if(robot.placed) {
					report(robot);
				}
				break;
			case 'RUN':
				if (!runningFile) {
					robot.placed = false; // Assumes new PLACE command in script
					runFile(commandArr[1]);
				}
				break;
			default:
				console.log('UNKNOWN_COMMAND');
				break;
		}
	}
};

// User input loop
const waitForUserInput = function() {
    rl.question('', function(answer) {
    	let commands = answer.trim().split(' ');
    	let commandArr = [commands.shift()];
        commandArr.push(...(commands.join('').split(',')));
        doCommand(commandArr);
        waitForUserInput();
    });
};

waitForUserInput();
