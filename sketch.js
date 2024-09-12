//GLOBALS
var spriteShipImages = [];
var stars;
var goldfish;
var goldfishColors = [];
var ship;
var MARGIN = 40;
var starImage;
var numOfStars = 100;
var numGoldfish = 30;
var score = 0;
var extendWidth = 1;
var shipXPos = 200;

function preload() {
  //ship
  for (var frames = 0; frames < 2; frames++) {
    var frameString = "images/spriteShip" + frames + ".png";
    spriteShipImages[frames] = loadImage(frameString);
    console.log("loaded ship");
  }
  //goldfish
  for (var frames = 0; frames < 5; frames++) {
    var frameString = "images/goldfishAsset" + frames + ".png";
    goldfishColors[frames] = loadImage(frameString);
    console.log("loaded fish");
  }
  starImage = loadImage("images/star.png");
}

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  
  if (width < 1000) {
    numOfStars = 75;
    numGoldfish = 20;
    extendWidth = 2;
  }
  if (width < 748) {
    numOfStars = 50;
    numGoldfish = 15;
    extendWidth = 2;
    shipXPos = width*.25;
  }
  
  stars = new Group();
  goldfish = new Group();
  
  for(var i = 0; i < numOfStars; i++) {
    var px = random(width+40);
    var py = random(height);
    createStar(px, py);
  }
  
  for(var i = 0; i < numGoldfish; i++) {
    var px = random(width, width*2*extendWidth);
    var py = random(height);
    createGoldfish(px, py);
  }
  
  ship = createSprite(shipXPos, height/2);
  ship.maxSpeed = 6;
  ship.friction = .98;
  ship.setCollider("circle, 0, 15, 80, 70")
  ship.addImage("normal", spriteShipImages[0]);
  ship.addAnimation("thrust", spriteShipImages[1], spriteShipImages[0]);
  ship.immovable = true;
  ship.maxSpeed = 3;
  ship.scale = 0.4;
}

function draw() {
  background("#16091f");
  
  for(var i=0; i<allSprites.length; i++) {
  var s = allSprites[i];
  if(s.position.x<-MARGIN) {
    s.position.x = width+MARGIN;
    score -= 5;
  }
  if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
  if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }
  
  push();
  fill("#f8e5ff");
  text("score: " + score, 20, 20);
  pop();
  
  goldfish.bounce(goldfish);
  
  goldfish.overlap(ship, eat);
  
  if (touchY < ship.position.y + 10 && touchY > ship.position.y - 10) {
    ship.changeAnimation("normal");
    ship.limitSpeed(1);
  } else if (touchY > ship.position.y) {
    ship.setSpeed(5,90);
    ship.changeAnimation("normal");
  } else if (touchY < ship.position.y) {
    ship.setSpeed(-5,90);
    ship.changeAnimation("thrust");
  }
  if (touchY - ship.position.y > 300 || touchY - ship.position.y < -300) {
    ship.maxSpeed = 4;
  } else {
    ship.maxSpeed = 3;
  }
  
  drawSprites();
}

function createStar(x, y) {
  var a = createSprite(x, y);
  a.addImage(starImage);
  a.setSpeed(.25, 180);
  a.scale = 1;
  a.rotationSpeed = random(.1,.3);
  stars.add(a);
  return(a);
}

function createGoldfish(x, y) {
  var a = createSprite(x, y);
  a.addImage(random(goldfishColors));
  a.setSpeed(2, 180);
  a.scale = .4;
  a.rotationSpeed = random(-.5,.5);
  a.mass = .5;
  goldfish.add(a);
  return(a)
  
}

function eat(fish, ship) {
  score += 15;
  createGoldfish(random(width,width*extendWidth+100), random(height))
  
  fish.remove();
}