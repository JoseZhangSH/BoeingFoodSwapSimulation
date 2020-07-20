class MyFood {

  constructor() {
    this.pos = createVector(415, 290);
    this.image = sushi;
    this.id = '';
    this.type = 1;
    this.speed = 0.05;
    this.fs = 8;
    this.size = 30;
    this.inKitchen = true;
    this.eaten = false;
    this.eatCounter = 0;
    this.eatTime = 2;
    this.eating = false;
    this.color = color(128, 0, 0);
    this.target = createVector(415, 290);
    this.nearestTrajPoint = [];
    this.seatid = 0;
  }

  setDefault() {
    if (this.type == 0) {
      this.image = sushi;
      this.pos.x -= 25;
      this.target.x -= 25;
    } else if (this.type == 1) {
      this.image = curry;

    } else {
      this.image = taco;
      this.pos.x += 25;
      this.target.x += 25;


    }

  }

  setType(i) {
    this.type = i;
  }

  setId(id) {
    this.id = id;
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

  move() {
    let d = createVector(this.target.x - this.pos.x, this.target.y - this.pos.y);
    // print(d);
    if (abs(d.x) > 1) this.pos.x += d.x * this.speed;
    if (abs(d.y) > 1) this.pos.y += d.y * this.speed;
  }

  plot() {
    if (this.eaten == false) {
      // noStroke();
      // fill(this.color);
      // ellipse(this.pos.x, this.pos.y, this.size, this.size);
      image(this.image, this.pos.x - 15, this.pos.y - 13, this.size, this.size);
      if (moveStatus == 1) {
        strokeWeight(1);
        stroke(0);
        // line(this.pos.x, this.pos.y, this.target.x, this.target.y);

      }

      // textSize(this.fs);
      // fill(0);

      // eating
      if (this.eating == true && this.eatCounter < this.eatTime) {
        // print(this.id,'eating');
        //if(this.id==2)print('>>>> '+this.meterCounter / this.maxTime);
        fill(0, 128, 0);
        arc(this.pos.x, this.pos.y, this.size, this.size, 0, 2 * PI * (this.eatCounter / this.eatTime), PIE);
      } else if (this.eating == true && this.eatCounter >= this.eatTime) {
        this.eating = false;
        this.eaten = true;
        seat[this.seatid].hungry = false;
        // print(this.id,'eaten');
      }
    } else {
      // noStroke();
      // noFill();
      // ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }

  }

}