"use strict";

const Tilemap = require('./tilemap');
const Vector = require('./vector');

// weapon/armor shouldnt be done here...
// they can still be stored here if necessary, but 
// I think it might make more sense to have them 
// directly on the player/enemy?
const Weapon = require("./weapon");
const Armor = require("./armor");

module.exports = exports = CombatClass;

function CombatClass(aType) {
    this.type = aType;
    switch (aType) {
        case "Knight":
            this.health = 20;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Longsword", 1);
            this.armor = new Armor("Hide"); // No restrictions on Armor types
            this.attackType = "Melee";
            break;

        case "Archer":
            this.health = 10;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Broadhead", 1);
            this.armor = new Armor("Hide"); // Can't wear Chain or Plate
            this.attackType = "Ranged";
            break;

        case "Mage":
            this.health = 10;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Eldritch Blast", 1);
            this.armor = new Armor("Robes"); // Can only wear Robes, nothing else
            this.attackType = "Magic";
            break;


        case "Zombie":
            this.health = 10;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Claw", 1);
            this.armor = new Armor("Flesh");
            this.attackType = "Melee";
            this.senseRange = 5;

            this.turnAI = function(aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= aEnemy.combat.senseRange && distance.y <= aEnemy.combat.senseRange) {
                    var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                    if (path.length > 1) aEnemy.position = { x: path[1].x, y: path[1].y };
                } else {
                    var nextTile = aEnemy.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;

        case "EnemyRanged":
            this.health = 10;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Broadhead", 1);
            this.armor = new Armor("Hide");
            this.attackType = "Ranged";
            this.senseRange = 10;

            this.turnAI = function(aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= aEnemy.combat.senseRange && distance.y <= aEnemy.combat.senseRange) {
                    var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                    if (path.length > 1) aEnemy.position = { x: path[1].x, y: path[1].y };
                } else {
                    var nextTile = aEnemy.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;

        case "Captain":
            this.health = 25;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Battleaxe", 1);
            this.armor = new Armor("Chain");
            this.attackType = "Melee";
            this.senseRange = 15;

            this.turnAI = function(aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= aEnemy.combat.senseRange && distance.y <= aEnemy.combat.senseRange) {
                    var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                    if (path.length > 1) aEnemy.position = { x: path[1].x, y: path[1].y };
                } else {
                    var nextTile = aEnemy.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;

        case "Shaman":
            this.health = 10;
            this.attackBonus = 0;
            this.damageBonus = 0;
            this.defenseBonus = 0;
            this.weapon = new Weapon("Eldritch Blast", 1);
            this.armor = new Armor("Robes");
            this.attackType = "Magic";
            this.senseRange = 10;

            this.turnAI = function(aEnemy) {
                var distance = Vector.distance(aEnemy.position, aEnemy.target.position);
                if (distance.x <= aEnemy.combat.weapon.range && distance.y <= aEnemy.combat.weapon.range) {
                    combatController.handleAttack(aEnemy.combat, aEnemy.target.combat);
                } else if (distance.x <= aEnemy.combat.senseRange && distance.y <= aEnemy.combat.senseRange) {
                    var path = pathfinder.findPath(aEnemy.position, aEnemy.target.position);
                    if (path.length > 1) aEnemy.position = { x: path[1].x, y: path[1].y };
                } else {
                    var nextTile = aEnemy.tilemap.getRandomAdjacent(aEnemy.position);
                    aEnemy.position = { x: nextTile.x, y: nextTile.y };
                }
            }
            break;
    }
}
