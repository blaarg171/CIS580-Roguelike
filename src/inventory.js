"use strict";

/**
 * @module exports the Inventory class
 */
module.exports = exports = Inventory;

/**
 * @constructor Inventory
 * Creates a new inventory
 */
function Inventory(weapon, armor) {
	this.inventory = [];
    this.inventory.push(weapon);
    this.inventory.push(armor);
}

/**
 * @function processes a new weapon item
 * 
 */
Inventory.prototype.addWeapon = function(weapon) {
    checkWeapon(weapon);
    if(this.inventory.length >= 17) { /* Tell GUI that inventory is full */ }
    if(weapon.type.damageMax > this.inventory[0].type.damageMax) { // This needs to be changed to prompting the user, I'll wait until there's a working GUI class to do that
        this.push(this.inventory[0]);
        this.inventory[0] = weapon;
    }
    else {
        this.push(weapon);
    }
}

/**
 * @function processes a new armor item
 * 
 */
Inventory.prototype.addArmor = function(armor) {
    checkArmor(armor);
    if(this.inventory.length >= 17) { /* Tell GUI that inventory is full */ }
    if(armor.type.defense > this.inventory[1].type.defense) { // See line 25
        this.push(this.inventory[0]);
        this.inventory[0] = armor;
    }
    else {
        this.push(armor);
    }
}

/**
 * @function power up the equipped weapon
 * 
 */
Inventory.prototype.powerupWeapon = function(damage) {
    this.inventory[0].type.damageMax += damage;
}

/**
 * @function power up the equipped armor
 * 
 */
Inventory.prototype.powerupArmor = function(defense) {
    this.inventory[1].type.defense += defense;
}

/**
 * @function add item to inventory
 * 
 */
Inventory.prototype.addItem = function(item) {
    if(this.inventory.length >= 17) { /* Tell GUI inventory is full */ }
    this.inventory.push(item);
}

/**
 * @function remove item from inventory
 * 
 */
Inventory.prototype.removeItem = function(item) {
    this.inventory.remove(this.inventory.indexOf(item));
}

/**
 * @function makes sure item is a weapon
 * 
 */
function checkWeapon(item) {
    if(typeof item == 'undefined') failWeapon();
    if(typeof item.type == 'undefined') failWeapon();
    if(typeof item.level == "undefined") failWeapon();
    if(typeof item.type.damageMax == "undefined") failWeapon();
    if(typeof item.type.damageMin == "undefined") failWeapon();
    if(typeof item.type.damageType == "undefined") failWeapon();
    if(typeof item.type.range == "undefined") failWeapon();
    if(typeof item.type.hitBonus == "undefined") failWeapon();
    if(typeof item.type.properties == "undefined") failWeapon();
}

/**
 * @function makes sure item is armor
 * 
 */
function checkArmor(item) {
    if(typeof item == 'undefined') failArmor();
    if(typeof item.type == 'undefined') failArmor();
    if(typeof item.type.defense == "undefined") failArmor();
    if(typeof item.type.strongType == "undefined") failArmor();
    if(typeof item.type.weakType == "undefined") failArmor();
}

function failWeapon() {
    throw new Error("Item doesn't match type definition for 'Weapon'");
}

function failArmor() {
    throw new Error("Item doesn't match type definition for 'Armor'");
}