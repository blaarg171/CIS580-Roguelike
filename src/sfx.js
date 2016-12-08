"use strict;"

module.exports = exports = SFX;

var background = new Audio();
var healthPickup = new Audio();
var attackPowerup = new Audio();
var damageBonusPowerup = new Audio();
var defensePowerup = new Audio();
var click = new Audio();
var backgroundMusicOnLoop = new Audio('sounds/tempBGMusicLoop.wav');
var volume = 3;

var volumeMatrix = [
    // bg, bgOnLoop, health, attack, damage, defense, click 
    [ 0.0,      0.0,    0.0,    0.0,    0.0,     0.0,   0.0], // Volume 0
    [ 0.1,      0.1,    0.1,    0.1,    0.1,     0.1,   0.1], // Volume 1
    [ 0.2,      0.2,    0.2,    0.2,    0.2,     0.2,   0.2], // Volume 2
    [ 0.3,      0.3,    0.3,    0.3,    0.3,     0.3,   0.3]  // Volume 3
];


function SFX() {
    background.src = encodeURI('sounds/tempBGMusic.wav');
    background.addEventListener('ended', function() {
        backgroundMusicOnLoop = new Audio('sounds/tempBGMusicLoop.wav');
        backgroundMusicOnLoop.volume = volumeMatrix[volume][1];
        backgroundMusicOnLoop.loop = true;
        backgroundMusicOnLoop.play();
    }, false);
    background.play();

    healthPickup.src = encodeURI('sounds/Powerup3.wav');
    attackPowerup.src = encodeURI('sounds/Powerup4.wav');
    damageBonusPowerup.src = encodeURI('sounds/Powerup1.wav');
    defensePowerup.src = encodeURI('sounds/Powerup2.wav');
    click.src = encodeURI("sounds/click.wav");

    this.setVolume(["volume", "3"]);
    window.terminal.addCommand("volume", "Set the volume", this.setVolume.bind(this));
}

SFX.prototype.play = function(aSound) {
    switch (aSound) {
        case "healthPickup":
            healthPickup.play();
            break;

        case "attackPickup":
            attackPowerup.play();
            break;

        case "damagePickup":
            damageBonusPowerup.play();
            break;

        case "defensePickup":
            defensePowerup.play();
            break;

        case "click":
            click.play();
            break;
    }
}

SFX.prototype.setVolume = function(args){
    if(args.length <= 1){
        window.terminal.log("Please provide volume level (0-3)", "red");
        return;
    }

    var temp = parseInt(args[1]);
    if(isNaN(temp)){
        window.terminal.log("Volume level must be a value 0-3", "red");
        return;
    }

    if(temp < 0 || temp > 3){
        window.terminal.log("Please provide volume level between 0-3", "red");
        return;
    }
    volume = temp;

    var lvls = volumeMatrix[volume];

    background.volume = lvls[0];
    backgroundMusicOnLoop.volume = lvls[1];
    healthPickup.volume = lvls[2];
    attackPowerup.volume = lvls[3];
    damageBonusPowerup.volume = lvls[4];
    defensePowerup.volume = lvls[5];
    click.volume = lvls[6];
}

