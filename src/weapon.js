"use strict";

module.exports = exports = Weapon;

// I'm sure there's a better way to do this,
// especially wince we have to restrict weapon types to different classes.
function Weapon(aName, aLevel) {
    this.type = "Weapon";
    this.name = aName;
    this.level = aLevel;
    this.shouldRetain = true;
    this.spriteIdx = 0;
    this.spritePositions = [
        { x: 75, y: 75 },  // 0 - Magic Staff
        { x: 225, y: 75 }, // 1 - Bow
        { x: 300, y: 75 }, // 2 - Mace
        { x: 375, y: 75 }, // 3 - Knife/Sword
        { x: 450, y: 75 }, // 4 - Axe
        { x: 675, y: 75 }  // 5 - Another Magic Staff
    ];

    switch (aName) {
        // Melee
        case "Longsword":
            this.attackType = "Melee";
            this.damageMax = 10
            this.damageMin = 2;
            this.damageType = "s";
            this.range = 1;
            this.hitBonus = 0;
            this.attackEffect = "";
            this.properties = "+1 Min Damage";
            this.spriteIdx = 3;
            break;

        case "Morning Star":
            this.attackType = "Melee";
            this.damageMax = 8
            this.damageMin = 1;
            this.damageType = "b";
            this.range = 1;
            this.hitBonus = 3;
            this.attackEffect = "";
            this.properties = "+3 to Hit";
            this.spriteIdx = 2;
            break;

        case "Halberd":
            this.attackType = "Melee";
            this.damageMax = 8
            this.damageMin = 2;
            this.damageType = "s";
            this.range = 2;
            this.hitBonus = 0;
            this.attackEffect = "";
            this.properties = "+1 Range, +1 Min Damage";
            this.spriteIdx = 4;
            break;

        case "Battleaxe":
            this.attackType = "Melee";
            this.damageMax = 12
            this.damageMin = 4;
            this.damageType = "sb";
            this.range = 1;
            this.hitBonus = 1;
            this.attackEffect = "";
            this.properties = "+3 Min Damage, +1 Crit Chance";
            this.spriteIdx = 4;
            break;

        case "Claw":
            this.attackType = "Melee";
            this.damageMax = 4
            this.damageMin = 2;
            this.damageType = "s";
            this.range = 1;
            this.hitBonus = 0;
            this.attackEffect = "";
            this.properties = "+1 Min Damage";
            this.spriteIdx = 3;
            break;

        // Ranged
        case "Bodkin":
            this.attackType = "Ranged";
            this.damageMax = 4
            this.damageMin = 1;
            this.damageType = "p";
            this.range = 5;
            this.hitBonus = 3;
            this.attackEffect = "";
            this.properties = "+3 to Hit";
            this.spriteIdx = 1;
            break;

        case "Broadhead":
            this.attackType = "Ranged";
            this.damageMax = 6
            this.damageMin = 2;
            this.damageType = "p";
            this.range = 5;
            this.hitBonus = 0;
            this.attackEffect = "";
            this.properties = "+1 Min Damage";
            this.spriteIdx = 1;
            break;

        case "Poison-Tipped":
            this.attackType = "Ranged";
            this.damageMax = 4
            this.damageMin = 1;
            this.damageType = "p";
            this.range = 5;
            this.hitBonus = 0;
            this.attackEffect = "Poisoned";
            this.properties = "50% Poison Chance";
            this.spriteIdx = 1;
            break;

        case "Heavy Bolts":
            this.attackType = "Ranged";
            this.damageMax = 10
            this.damageMin = 4;
            this.damageType = "b";
            this.range = 3;
            this.hitBonus = 0;
            this.attackEffect = "";
            this.properties = "+3 Min Damage, -2 Range";
            this.spriteIdx = 1;
            break;

        // Spells
        case "Magic Missile":
            this.attackType = "Magic";
            this.damageMax = 4
            this.damageMin = 1;
            this.damageType = "m";
            this.range = 255;
            this.hitBonus = 255;
            this.attackEffect = "";
            this.properties = "Unerring Accuracy";
            this.spriteIdx = 0;
            break;

        case "Fireball":
            this.attackType = "Magic";
            this.damageMax = 4
            this.damageMin = 1;
            this.damageType = "m";
            this.range = 255;
            this.hitBonus = 0;
            this.attackEffect = "Burned";
            this.properties = "50% Burn Chance, Explodes on Contact";
            this.spriteIdx = 5;
            break;

        case "Frostbolt":
            this.attackType = "Magic";
            this.damageMax = 4
            this.damageMin = 1;
            this.damageType = "m";
            this.range = 255;
            this.hitBonus = 0;
            this.attackEffect = "Frozen";
            this.properties = "50% Freeze Chance";
            this.spriteIdx = 5;
            break;

        case "Eldritch Blast":
            this.attackType = "Magic";
            this.damageMax = 10
            this.damageMin = 1;
            this.damageType = "m";
            this.range = 255;
            this.hitBonus = -2;
            this.attackEffect = "";
            this.properties = "-2 to Hit";
            this.spriteIdx = 0;
            break;
    }

    // static properties for entities
    this.position = { x: -1, y: -1 };
    this.size = { width: 96, height: 96 };
    this.spritesheet = new Image();
    this.spritesheet.src = './spritesheets/powerup.png';

    this.currY = 0;
    this.movingUp = true;
}

Weapon.prototype.collided = function (aEntity) {
    if (aEntity.type == "Player") {
        aEntity.inventory.addWeapon(this);
        this.shouldRetain = false;
    }
}

Weapon.prototype.processTurn = function () {

}

Weapon.prototype.retain = function () {
    return this.shouldRetain;
}

Weapon.prototype.update = function () {
    if (this.currY >= 5) this.movingUp = false;
    else if (this.currY <= -5) this.movingUp = true;
    if (this.movingUp) this.currY += .2;
    else this.currY -= .2;
}

Weapon.prototype.render = function (time, ctx) {
    var position = window.tilemap.toScreenCoords(this.position);
    var spriteSource = this.spritePositions[this.spriteIdx];
    ctx.drawImage(this.spritesheet, spriteSource.x, spriteSource.y, 75, 75, (position.x * this.size.width), (position.y * this.size.height) + this.currY, 96, 96);
}

Weapon.prototype.toString = function () {
    return `Level ${this.level} ${this.name} with damage range ${this.damageMin}-${this.damageMax}, with ${this.properties}`
}
