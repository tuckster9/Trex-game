var START = 0;
var PLAY = 1;
var END = 2;
var gameState = START;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var trexCrouch, trexStand, bird,crow;
var BirdGroup;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
localStorage["HighestScore"] = 0;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  trexCrouch = loadAnimation("offline-sprite-2x (1).png");

trexStand = loadAnimation("trex1.png");
  bird = loadImage("offline-sprite-2x (3).png")

  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("standing", trexStand);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.addAnimation("crouching", trexCrouch);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  BirdGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("black");
  //displaying score
  text("Score: "+ score, 500,50);
  if (localStorage["HighestScore"]<score) {
 localStorage["HighestScore"] = score;   
  }
  text(localStorage["HighestScore"],450,50)
  console.log("this is ",gameState)
  
  if (gameState  === START ){
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach  (0);
    trex.velocityX = 0;
    cloudsGroup.setVelocityXEach (0);
    BirdGroup.setVelocityXEach (0);
    gameOver.visible = false;
    restart.visible = false;
    if (keyDown("space")|| keyDown("UP_ARROW")){
      gameState = PLAY;
     
    }
     trex.changeAnimation("standing", trexStand);
  }
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    
    trex.changeAnimation("running", trex_running)
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if (keyDown("DOWN_ARROW")){
      trex.changeAnimation("crouching", trexCrouch);
    }if (keyWentUp("DOWN_ARROW")){
      trex.changeAnimation("running", trex_running);
    }
    if (score % 100 === 0 && score > 0){
      checkPointSound.play()
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
  Bird();
    
    if (BirdGroup.isTouching(trex)){
      gameState = END;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 165||keyDown("UP_ARROW")&& trex.y >=165) {
        trex.velocityY = -13;
      jumpSound.play()
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.7
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play()
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      BirdGroup.setVelocityXEach (0);
     
     if (mousePressedOver(restart)) {
     reset();
     }
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -4;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
   obstacle.x = Math.round(random(600,500));
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
  
}

function Bird(){
if (frameCount % 300 === 0) {
     crow = createSprite(600,100,40,10);
    crow.y = Math.round(random(100,150));
    crow.addImage(bird);
    crow.scale = 0.5;
    crow.velocityX = -3;
    BirdGroup.add(crow);  
  
}}

function reset(){
gameState = START;
cloudsGroup.destroyEach(); 
obstaclesGroup.destroyEach();
BirdGroup.destroyEach();
score = 0;  
gameOver.Visible = false;
restart.Visible = false;
  
 
}

