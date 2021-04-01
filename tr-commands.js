const dirArr = ['NORTH','EAST','SOUTH','WEST']; // Directions

function place(x, y, dir, robot, limits) {
  if(
      !isNaN(x) & 
      !isNaN(y) & 
      (x >= 0) & 
      (y >= 0) & 
      (x < limits.x) & 
      (y < limits.y) & 
      !!~dirArr.indexOf(dir)
  ) {
    robot = {
      x: parseInt(x),
      y: parseInt(y),
      direction: dirArr.indexOf(dir),
      placed: true
    }
  }
  return robot;
}

function rotate(dir, robot) {
  switch(dir) {
    case 'LEFT':
      robot.direction = (robot.direction + 3) % 4;
      break;
    case 'RIGHT':
      robot.direction = (robot.direction + 1) % 4;
      break;
  }
  return robot;
}

function move(robot, limits) {
  switch(robot.direction) {
    case 0: // NORTH
      if (robot.y < limits.y - 1) {
        robot.y++
      }
      break;
    case 1: // EAST
      if (robot.x < limits.x - 1) {
        robot.x++
      }
      break;
    case 2: // SOUTH
      if (robot.y > 0) {
        robot.y--
      }
      break;
    case 3: // WEST
      if (robot.x > 0) {
        robot.x--
      }
      break;
  }
  return robot;
}

function report(robot) {
  console.log([robot.x, robot.y, dirArr[robot.direction]].join(','));
}

module.exports = { place, rotate, move, report };
