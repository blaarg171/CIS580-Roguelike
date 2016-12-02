"use strict";

window.debug = false;

/* Classes and Libraries */
const Game = require('./game');
const EntityManager = require('./entity_manager');
const EntitySpawner = require('./entity_spawner');
const Tilemap = require('./tilemap');
const tileset = require('../tilemaps/tiledef.json');
const Player = require('./player');
const Pathfinder = require('./pathfinder.js');
const CombatController = require("./combat_controller");
const Vector = require('./vector');
const Click = require('./click');
const Stairs = require('./stairs');
const ProgressManager = require('./progress_manager');
const GUI = require('./gui');
const Terminal = require('./terminal.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
window.entityManager = new EntityManager();
var fadeAnimationProgress = new ProgressManager(0, function(){});
var isFadeOut = true;
var screenSize = {width: 1056, height: 672};

window.combatController = new CombatController();

window.terminal = new Terminal();
window.terminal.log("Terminal successfully loaded");

var gui = new GUI(screenSize);

var tilemap = new Tilemap(screenSize, 64, 64, tileset, {
  onload: function () {
    masterLoop(performance.now());
  }
});

var pathfinder = new Pathfinder(tilemap);
window.pathfinder = pathfinder;

var input = {
  up: false,
  down: false,
  left: false,
  right: false
}

var backgroundMusic = new Audio('sounds/tempBGMusic.wav');
var backgroundMusicOnLoop = new Audio('sounds/tempBGMusicLoop.wav');
backgroundMusic.volume = 0.3;
backgroundMusicOnLoop.volume = 0.3;
backgroundMusic.addEventListener('ended', function(){
   this.currentTime = 0;
   backgroundMusicOnLoop.play();
}, false);
backgroundMusic.play();


var turnTimer = 0;
var defaultTurnDelay = 400;     //Default turn between turns
var turnDelay = defaultTurnDelay; //current time between turns
var autoTurn = false;           //If true, reduces time between turns and turns happen automatically
var resetTimer = true;          //Take turn immediately on movement key press if true

var player = new Player({ x: 0, y: 0 }, tilemap, "Mage");

window.player = player;

window.onmousemove = function(event) {
	gui.onmousemove(event);
}

window.onmousedown = function(event)
{
    // Init the level when class is chosen
    if(gui.state == "start" || gui.state == "choose class")
    {
        gui.onmousedown(event);
        if(gui.chosenClass != "")
        {
            player.changeClass(gui.chosenClass);
            nextLevel(false);
        }
    }
}

canvas.onclick = function (event) {
  var node = {
    x: parseInt(event.offsetX / 96),
    y: parseInt(event.offsetY / 96)
  }

  var clickedWorldPos = tilemap.toWorldCoords(node);
  window.entityManager.addEntity(new Click(clickedWorldPos, tilemap, player, function(enemy){
    var distance = Vector.distance(player.position, enemy.position);
    if (distance.x <= player.combat.weapon.range && distance.y <= player.combat.weapon.range) {
      turnDelay = defaultTurnDelay;
      autoTurn = false;
      combatController.handleAttack(player.combat, enemy.combat);
      processTurn();
    }
  }));
}

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      if (resetTimer) {
        turnTimer = turnDelay;
        resetTimer = false;
      }
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      if (resetTimer) {
        turnTimer = turnDelay;
        resetTimer = false;
      }
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      if (resetTimer) {
        turnTimer = turnDelay;
        resetTimer = false;
      }
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      if (resetTimer) {
        turnTimer = turnDelay;
        resetTimer = false;
      }
      event.preventDefault();
      break;
    case "Shift":
      event.preventDefault();
      turnDelay = defaultTurnDelay / 2;
      autoTurn = true;
      break;
  }
}

/**
 * @function onkeyup
 * Handles keyup events
 */
window.onkeyup = function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      break;
    case "Shift":
      turnDelay = defaultTurnDelay;
      autoTurn = false;
      break;
  }
  if (!(input.left || input.right || input.up || input.down)) resetTimer = true;
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
	gui.update(elapsedTime);
  if (input.left || input.right || input.up || input.down || autoTurn) {
    turnTimer += elapsedTime;
    if (turnTimer >= turnDelay) {
      turnTimer = 0;
      processTurn();
    }
  }
  window.entityManager.update(elapsedTime);
  fadeAnimationProgress.progress(elapsedTime);
  window.terminal.update(elapsedTime);
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  tilemap.render(ctx);
  entityManager.render(elapsedTime, ctx);

  ctx.save();
  ctx.globalAlpha = (isFadeOut) ? fadeAnimationProgress.percent : 1 - fadeAnimationProgress.percent;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.fillRect(1060,0,256,672);

  ctx.fillStyle = "white";
  ctx.fillRect(1057,0,2,672);
  window.terminal.render(elapsedTime, ctx);
  gui.render(elapsedTime, ctx);
}

/**
  * @function processTurn
  * Proccesses one turn, updating the states of all entities.
  */
function processTurn() {
  window.entityManager.processTurn(input);
}

function nextLevel(fadeOut){
  player.level++;
  var init = function(){
    // reset entities
    window.entityManager.reset();

    var regen = false;

    do{
      //reset the regen flag
      regen = false;

      //gen new map
      tilemap.generateMap();

      //move player to valid location
      var pos = tilemap.findOpenSpace();
      player.position = {x: pos.x, y: pos.y};
      tilemap.moveTo({ x: pos.x - 5, y: pos.y - 3 });

      // allow player to move
      player.shouldProcessTurn = true;

      // Find stairs location that is at least 5 away.
      var pos;
      var dist;
      var iterations = 0;
      do {
        pos = tilemap.findOpenSpace();
        dist = pathfinder.findPath(player.position, pos).length
        iterations++;
        if(iterations > 20) {
          regen = true;
          break;
        }
      } while(dist == 0 && dist < 8);

    } while(regen);

    // add player
    window.entityManager.addEntity(player);
    // add stairs
    window.entityManager.addEntity(new Stairs(pos, tilemap, function(){nextLevel(true)}));
    //place new entities
    EntitySpawner.spawn(player, tilemap, 30, 25);

    unfadeFromBlack();

  };

  (fadeOut) ? fadeToBlack(init) : init()
}

function fadeToBlack(completion){
  isFadeOut = true;
  fadeAnimationProgress = new ProgressManager(500, completion);
  fadeAnimationProgress.isActive = true;
}

function unfadeFromBlack(){
  isFadeOut = false;
  fadeAnimationProgress = new ProgressManager(500, function(){});
  fadeAnimationProgress.isActive = true;
}
