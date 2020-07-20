let numFood = 39;
let numSeat = 36;
let food = [];
let seat = [];
let bgImage;
let sushi, curry, taco;
let wait, happy, pop_up;
let restart;
let restartBtn;
let framerate = 60;
let moveStatus = 0;

let zoomFactor = 0;

let trajPoints = [];
let orders = [];
let storage = [];
let showAnimation = false;

let sushiStored = 13;
let curryStored = 13;
let tacoStored = 13;

let sushiSurplus = 0;
let currySurplus = 0;
let tacoSurplus = 0;

let keyCount = 0;

let instruction;
let instructionText;

let offerBtn;
let swapBtn;


function preload() {
  // let restart = createImage(162, 30);

  bgImage = loadImage('background.png');
  sushi = loadImage('sushi.png');
  curry = loadImage('curry.png');
  taco = loadImage('taco.png');
  wait = loadImage('wait.png');
  happy = loadImage('happy.png');
  pop_up = loadImage('pop_up.png');
  restart = loadImage('restart.png');
}

function windowResized() {
  zoomFactor = windowWidth / 1920;
  resizeCanvas(windowWidth, windowHeight);
}


function setup() {
  // cursor('pointer');
  zoomFactor = windowWidth / 1920;
  noLoop();
  frameRate(framerate);
  createCanvas(windowWidth, windowHeight);

//   loadImage('restart.png', img => {
    
//     image(img, 0, 0,192 * zoomFactor, AUTO);
//   });

  restartBtn = createImg(
    'restart.png'
  );

  restartBtn.mouseClicked(initiate);

  instructionText = createP(instruction);



  offerBtn = createButton('Offer Food');
  swapBtn = createButton('Swap Food');
  // offerBtn.position(1460 * zoomFactor, 690 * zoomFactor);

  // swapBtn.position(1600 * zoomFactor, 690 * zoomFactor);
  swapBtn.toggleClass('disabled');

  offerBtn.mousePressed(offerFoodBtn);
  swapBtn.mousePressed(swapFoodBtn);

  // restart.mouseOver



  initiate();
}

function offerFoodBtn() {
  if (keyCount < 4) {


    keyCount += 1;
    checkStatus();
    setTimeout('eatFood()', 5000);
  }
}

function eatFood() {
  keyCount += 1;
  checkStatus();

}

function swapFoodBtn() {
  if (keyCount == 4) {
    keyCount += 1;
    checkStatus();
    setTimeout('eatFood()', 5000);
  }
}

function initiate() {

  swapBtn.addClass('disabled');
  offerBtn.removeClass('disabled');

  food = [];
  seat = [];
  moveStatus = 0;

  trajPoints = [];
  orders = [];
  storage = [];
  showAnimation = false;

  sushiStored = 13;
  curryStored = 13;
  tacoStored = 13;

  sushiSurplus = 0;
  currySurplus = 0;
  tacoSurplus = 0;

  keyCount = 0;
  instruction = "Attention! The passengers are on-board. Let's start offering food!";


  //*****ORDERED FOOD
  for (let i = 0; i < 12; i++)
    orders.push(0)
  for (let i = 0; i < 12; i++)
    orders.push(1)
  for (let i = 0; i < 12; i++)
    orders.push(2)
  orders = shuffle(orders);
  // print(orders);

  //*****STORED FOOD
  for (let i = 0; i < 13; i++)
    storage.push(0)
  for (let i = 0; i < 13; i++)
    storage.push(1)
  for (let i = 0; i < 13; i++)
    storage.push(2)
  storage = shuffle(storage);
  // print(storage);

  //*****PLACE SEAT
  let seatDistx = 65;
  let seatDisty = 120;
  let xOff = 365;
  let yOff = 90;
  for (let i = 0; i < numSeat; i++) {
    let x = ((i - int(i / 9) * 9) % 9) * seatDistx + int((i - int(i / 9) * 9) / 3) * seatDistx + xOff;
    let y = 1080 / 1.5 - int(i / 9) * seatDisty + yOff;
    append(seat, new MySeat());
    seat[i].pos.x = x;
    seat[i].pos.y = y;
    seat[i].id = i;
    seat[i].orderedFood = orders[i];
    seat[i].wantFood = orders[i];
  }

  //*****PLACE FOOD
  for (let i = 0; i < numFood; i++) {
    append(food, new MyFood());

    food[i].id = i;
    food[i].type = storage[i];
    food[i].setDefault();

    // print(i,food[i].type);
  }


  //*****PLACE TRAJECTORY POINTS
  for (let i = 0; i < ceil(numSeat / 9); i++) {
    let x1 = 3 * seatDistx + xOff;
    let x2 = 7 * seatDistx + xOff;
    let y = height / 1.5 - i * seatDisty + yOff;
    append(trajPoints, createVector(x1, y));
    append(trajPoints, createVector(x2, y));
  }
  append(trajPoints, createVector(3 * seatDistx + xOff, height / 1.5 + 100));
  append(trajPoints, createVector(7 * seatDistx + xOff, height / 1.5 + 100));
  // print(trajPoints);
  //print(trajPoints[9]);

  for (let i = 0; i < seat.length; i++)
    seat[i].calculateNearestTrajPoint();
  for (let i = 0; i < food.length; i++)
    food[i].calculateNearestTrajPoint();
}


function changedIdea() {

  //*****SOME CHANGED IDEA
  changedSeat = [];
  for (let i = 0; i < 14; i++) {
    let change = int(random(seat.length));
    changedSeat.push(change);
    print(changedSeat);
  }

  for (let i = 0; i < changedSeat.length - 2; i++) {
    seat[changedSeat[i]].changeWantFood();
  }
  for (let i = changedSeat.length - 2; i < changedSeat.length; i++) {
    seat[changedSeat[i]].hungry = false;
  }

  for (let i = 0; i < seat.length; i++) {
    if (seat[i].wantFood != food[seat[i].servedFoodId].type) {
      if (food[seat[i].servedFoodId].type == 0) {
        sushiSurplus += 1;
      } else if (food[seat[i].servedFoodId].type == 1) {
        currySurplus += 1;
      } else if (food[seat[i].servedFoodId].type == 2) {
        tacoSurplus += 1;
      }
    }
  }

  //*****OTHERS EAT THEIR FOOD
  for (let i = 0; i < seat.length; i++) {
    if (seat[i].wantFood == food[seat[i].servedFoodId].type) {

      seat[i].eating = true;
      food[seat[i].servedFoodId].eating = true;

    }
  }
}

function checkStorage() {
  for (let i = 0; i < seat.length; i++) {
    if (seat[i].hungry == true) {
      // seat[i].checkingStorage=true;
      for (let j = 0; j < food.length; j++) {
        if (food[j].inKitchen == true) {
          if (seat[i].wantFood == food[j].type) {
            food[j].seatid = i;
            food[j].inKitchen = false;
            seat[i].served = true;
            seat[i].servedFoodId = food[j].id;
            food[j].speed = (dist(food[j].pos.x, food[j].pos.y, seat[i].pos.x, seat[i].pos.y) / 8) / 2000;
            food[j].target.x = seat[i].pos.x;
            food[j].target.y = seat[i].pos.y;

            if (food[j].type == 0) {
              sushiStored -= 1;
            } else if (food[j].type == 1) {
              curryStored -= 1;
            } else if (food[j].type == 2) {
              tacoStored -= 1;
            }



          }
        }
      }
    }
  }
}

function eatAfterCheckingStorage() {
  for (let i = 0; i < seat.length; i++) {
    if (seat[i].wantFood == food[seat[i].servedFoodId].type) {
      seat[i].eating = true;
      food[seat[i].servedFoodId].eating = true;
      // seat[i].hungry = false;
      // seat[i].plot();
      // food[seat[i].servedFoodId].eaten = true;
      // food[seat[i].servedFoodId].plot();
    }
  }
}

function swapFood() {
  for (let i = 0; i < seat.length; i++) {
    if (seat[i].hungry == true) {
      for (let j = 0; j < food.length; j++) {
        if (food[j].eaten == false && seat[food[j].seatid].wantFood != food[j].type) {
          // print(j);
          if (seat[i].wantFood != food[seat[i].servedFoodId].type) {
            // print(i);
            if (seat[i].wantFood == food[j].type) {
              print(i, j);
              food[j].seatid = i;
              // // seat[i].served = true;
              // // seat[i].hungry = false;
              seat[i].servedFoodId = food[j].id;
              // print('swap', i, seat[i].wantFood, food[j].type)
              // // print(food[j].id, i, 'matched');
              food[j].speed = (dist(food[j].pos.x, food[j].pos.y, seat[i].pos.x, seat[i].pos.y) / 4) / 2000;
              // //print(j, food[j].speed);
              food[j].target.x = seat[i].pos.x;
              food[j].target.y = seat[i].pos.y;
            }
          }
        }
      }
    }
  }
}


function eatAfterSwapping() {
  let swapCount = 0;
  for (let i = 0; i < seat.length; i++) {
    if (seat[i].hungry == true) {
      print('hungry', i);
      if (seat[i].wantFood == food[seat[i].servedFoodId].type) {
        print('satisfied', i, seat[i].wantFood, food[seat[i].servedFoodId].type)
        seat[i].eating = true;
        food[seat[i].servedFoodId].eating = true;

        if (food[seat[i].servedFoodId].type == 0) {
          sushiSurplus -= 1;
        } else if (food[seat[i].servedFoodId].type == 1) {
          currySurplus -= 1;
        } else if (food[seat[i].servedFoodId].type == 2) {
          tacoSurplus -= 1;
        }
        swapCount += 1;
      }
    }
  }
  instruction = 'Great! ' + swapCount + ' passengers got satisfied by swapping food!';
}


function draw() {
  // push();
  zoomFactor = windowWidth / 1920;

  // pop();
  //   if(cursorStatus==0){
  //     cursor(ARROW);

  //   }else if (cursorStatus==1){
  //     cursor('pointer');
  //   }

  // resizeCanvas(windowWidth, windowHeight);

  scale(zoomFactor);
  let yOff = 25;

  smooth();
  image(bgImage, 0, 0);

  // image(sushi, 380, 275, 30, 30);
  // image(curry, 400 , 275, 30, 30);
  // image(taco, 420, 275, 30, 30);


  fill(37, 73, 104);
  noStroke();
  textStyle(BOLD);


  instructionText.position(1430 * zoomFactor, 510 * zoomFactor);
  offerBtn.position(1460 * zoomFactor, 690 * zoomFactor);
  swapBtn.position(1600 * zoomFactor, 690 * zoomFactor);

  // restartBtn.size(192 * zoomFactor, AUTO);
  restartBtn.position(1480 * zoomFactor, 825 * zoomFactor);

  instructionText.html(instruction);

  textAlign(CENTER);
  textSize(32 * zoomFactor);

  text(sushiStored, (1920 - 390), 330);
  text(curryStored, (1920 - 295), 330);
  text(tacoStored, (1920 - 200), 330);

  text(sushiSurplus, (1920 - 390), 402);
  text(currySurplus, (1920 - 295), 402);
  text(tacoSurplus, (1920 - 200), 402);

  for (let i = 0; i < seat.length; i++) {
    if (seat[i].eating == true) {
      seat[i].eatCounter += 0.01;
    }
    seat[i].plot();
  }


  // show traj points
  // for (let i = 0; i < trajPoints.length; i++) {
  //   ellipseMode(CENTER);
  //   fill(255);
  //   stroke(0);
  //   ellipse(trajPoints[i].x, trajPoints[i].y, 25, 25);
  // }


  //*****MATCH ORDER
  let i = int(random(seat.length));
  for (let j = 0; j < food.length; j++) {
    if (moveStatus == 1) {
      // print(i, food[i].type);
      if (food[j].type == seat[i].orderedFood && food[j].inKitchen == true && seat[i].served == false) {
        food[j].seatid = i;
        food[j].inKitchen = false;
        seat[i].served = true;
        seat[i].servedFoodId = food[j].id;
        // print(food[j].id, i, 'matched');
        food[j].speed = (dist(food[j].pos.x, food[j].pos.y, seat[i].pos.x, seat[i].pos.y) / 4) / 2000;
        //print(j, food[j].speed);
        food[j].target.x = seat[i].pos.x;
        food[j].target.y = seat[i].pos.y;

        if (food[j].type == 0) {
          sushiStored -= 1;
        } else if (food[j].type == 1) {
          curryStored -= 1;
        } else if (food[j].type == 2) {
          tacoStored -= 1;
        }
        // print(j, food[j].type, i);
      }

      if (food[j].eating == true && food[j].eatCounter < food[j].eatTime) {
        food[j].eatCounter += 0.04;
      }
    }

    food[j].move();
    food[j].plot();
  }


  //*****After Food Served
}




function checkStatus() {
  // if (keyCode === ENTER) {
  //   keyCount += 1;
  // }

  switch (keyCount) {
    case 1:
      moveStatus = 1;
      offerBtn.toggleClass('disabled');


      instruction = 'Food offering...';
      showAnimation = showAnimation ? false : true;
      if (showAnimation) loop();
      else noLoop();
      break;
    case 2:
      offerBtn.toggleClass('disabled');

      instruction = "Good job! Most passengers feel happy, but some passengers have changed their mind. Let's check the storage and offer them expected food.";
      changedIdea();
      break;
    case 3:
      offerBtn.toggleClass('disabled');
      instruction = 'Food offering...';
      checkStorage();
      break;
    case 4:
      eatAfterCheckingStorage();
      swapBtn.toggleClass('disabled');


      instruction = "Well, food storage is limited. Some passengers still have not got what they want. Let's try to swap food!";
      break;
    case 5:
      instruction = 'Food swapping...';
      swapFood();
      swapBtn.toggleClass('disabled');
      break;
    case 6:
      // instruction = 'press ENTER to restart simulation';
      eatAfterSwapping();
      break;
    case 7:
      initiate();
      break;
  }
}