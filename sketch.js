//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cactus, Cactus, obs1, ob2, ob3, obs4, obs5, obs5, obs6;
var cactusGrp;

var cloud, cloudImg, cloudGrp;

var score, HiScore, displayHiScore;

var gameState, PLAY, END;

var restartIcon, restartImg;
var gameOver, gameOverImg;

var die,checkPoint,jump;

//Create Media library and load to use it during the course of the software //executed only once at the start of the program

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImg = loadImage("cloud.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");

  gameOverImg = loadImage("gameOver.png");
  
  die=loadSound("die.mp3",);
  jump=loadSound("jump.mp3");
  checkPoint=loadSound("checkPoint.mp3");
}

//define the intial environment of the software(before it is used) //by defining the declared variables with default values //executed only once at the start of the program

function setup() {

  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, 81, 80);

  //create a ground sprite
  ground = createSprite(200, height-20, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  //creating invisible ground
  invisibleGround = createSprite(200, height-10, 400, 10);
  invisibleGround.visible = false;

  cactusGrp = createGroup();
  cloudsGrp = createGroup();

  PLAY = 1;
  END = 0;
  gameState = PLAY;

  score = 0;
  HiScore = 0;
  displayHiScore = false;

  gameOver = createSprite(width-300, height-120, 20, 20);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restartIcon = createSprite(width-260, height-50, 20, 20);
  restartIcon.addImage("restartImg", restartImg);
  restartIcon.scale = 0.5;
  restartIcon.visible = false;
}

//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw. //All commands to be executed, checked continously, applied throughout the program are written inside function draw. //function draw is executed for every frame created since the start till it stops.
function draw() {
  //set background color
  background(250);

  textSize(10);
  fill("red");
  text("SCORE : " + score, width-100, height/2);


  if (gameState == PLAY) {

    score = score + Math.round(frameCount / 200);
    if (displayHiScore == true) {
         text("HiScore:  " + HiScore, width-200,height/2);
    }

    gameOver.visible = false;
    restartIcon.visible = false;

    // jump when the space key is pressed
    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -10;
    }
    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    ground.velocityX = -(4 + score/100);

    //Spawn Clouds
    spawnClouds();
    createCactus();

    if (cactusGrp.isTouching(trex)) {
      gameState = END;
    }
  } else if (gameState == END) {
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;

    ground.velocityX = 0;

    cactusGrp.setVelocityXEach(0);
    cactusGrp.setLifetimeEach(-1);
    cloudsGrp.setVelocityXEach(0);
    cloudsGrp.setLifetimeEach(-1);

    gameOver.visible = true;
    restartIcon.visible = true;

    if (score > HiScore) {
      HiScore = score;
    }
    text("HiScore:  " + HiScore, width-200,height/2);

    if (mousePressedOver(restartIcon)) {
      gameState = PLAY;
      cactusGrp.destroyEach();
      cloudsGrp.destroyEach();
      trex.changeAnimation("running", trex_running);
      score = 0;
      displayHiScore = true;
    }
  }


  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

//function to spawn the clouds
function spawnClouds() {
  // write your code here 
  if (frameCount % 60 == 0) {

    cloud = createSprite(width, height-50, 20, 20);
    cloud.velocityX = -3;
    cloud.y = random(height-160, height-75);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = -(width/cloud.velocityX);
    cloud.addImage("cloudImg", cloudImg);
    cloud.scale = 0.7;

    cloudsGrp.add(cloud);
  }
}

function createCactus() {
  if (frameCount % 100 == 0) {
    cactus = createSprite(width, height-30, 20, 20);
    cactus.velocityX = -(4+score/100);
    cactus.lifetime = -(width/cactus.velocityX);
    cactus.debug = false;

    var imgNum = Math.round(random(1, 6));
    switch (imgNum) {
      case 1:
        cactus.addImage("obs1", obs1);
        break;
      case 2:
        cactus.addImage("obs2", obs2);
        break;
      case 3:
        cactus.addImage("obs3", obs3);
        break;
      case 4:
        cactus.addImage("obs4", obs4);
        break;
      case 5:
        cactus.addImage("obs5", obs5);
        break;
      case 6:
        cactus.addImage("obs6", obs6);              
        break;
      default:
        cactus.addImage("obs3", obs3);
        break;

    }

    restartIcon.depth = cactus.depth + 1;

    cactus.scale = 0.6;
    cactusGrp.add(cactus);


  }
}