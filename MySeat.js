class MySeat {

  constructor() {
    this.pos = createVector(0, 0);
    this.id = '';
    this.fs = 8;
    this.size = 50;
    this.orderedFood = 0;
    this.servedFoodId = 4;
    this.served = false;
    this.wantFood = 0;
    this.nearestTrajPoint = [];
    this.hungry = true;
    this.eating = false;
    this.eatingTime = 2;
    this.eatCounter = 0;
    this.satisfiedCounter = 0;
    this.satisfiedTime = 1;
  }

  setOrderedFood(i) {
    this.orderedFood = i;
  }
  changeWantFood() {
    let i = this.wantFood;
    this.wantFood = int((i + 1) % 3);
  }

  setLocation(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }


  calculateNearestTrajPoint() {
    let distanceList = [];
    for (let i = 0; i < trajPoints.length; i++) {
      append(distanceList, dist(trajPoints[i].x, trajPoints[i].y, this.pos.x, this.pos.y))
    }
    let minDist = min(distanceList);
    let j = -1;
    while ((j = distanceList.indexOf(minDist, j + 1)) != -1) {
      this.nearestTrajPoint.push(j);
    }
    // print(this.nearestTrajPoint);
  }

  plot() {
    ellipseMode(CENTER);
    if (this.hungry == true) {
      fill(255);
      if (this.wantFood == 0) {
        stroke(128, 0, 0);
      } else if (this.wantFood == 1) {
        stroke(0, 128, 0);
      } else {
        stroke(0, 0, 128);
      }
      strokeWeight(3);
      image(wait, this.pos.x - 20, this.pos.y - 20, this.size - 10, this.size - 10);


      if (this.served == true && food[this.servedFoodId].type != this.wantFood) {
        image(pop_up, this.pos.x - 16, this.pos.y - 55, this.size - 15, this.size - 15);
        if (this.wantFood == 0) {
          image(sushi, this.pos.x - 11, this.pos.y - 53, this.size - 25, this.size - 25);
        } else if (this.wantFood == 1) {
          image(curry, this.pos.x - 11, this.pos.y - 53, this.size - 25, this.size - 25);
        } else if (this.wantFood == 2) {
          image(taco, this.pos.x - 11, this.pos.y - 53, this.size - 25, this.size - 25);
        }
        // print(this.id, 'want');

      }

    } else {
      if (food[this.servedFoodId].eaten == true) {
        this.satisfiedCounter += 0.015;
        if (this.satisfiedCounter < this.satisfiedTime) {
          noStroke();
          noFill();
          image(happy, this.pos.x-10 , this.pos.y-10 , this.size - 25, this.size - 25);
        } else {
          noStroke();
          noFill();
        }
      }


    }



    textSize(this.fs);
    fill(0);
    // text(this.id, this.pos.x, this.pos.y);

    // if(this.hungry
    // for (let i = 0; i < 2; i += 0.01) {
    //   fill(0, 255, 0);
    //   arc(this.pos.x, this.pos.y, this.size, this.size, 0, 2 * PI * (i / 2), PIE);
    // }
  }





}