"use strict";

module.exports = exports = CombatController;

const CombatStruct = require("./combat_struct");

function CombatController() {

}

CombatController.prototype.handleAttack = function (aAttackerStruct, aDefenderStruct) {
    console.log("attacker health: " + aAttackerStruct.health);
    console.log("defender health: " + aDefenderStruct.health);

    var lAttackBase = aAttackerStruct.weaponLevel;
    var lAttackBonus = 0;
    var lAttackRoll = rollRandom(1, 21);
    var lAttackTotal = lAttackBase + lAttackBonus + lAttackRoll;

    var lDefenseBase = aDefenderStruct.armorLevel;
    var lDefenseBonus = 0;
    var lDefenseTotal = lDefenseBase + lDefenseBonus;

    var lDamageBase = aAttackerStruct.weaponLevel;
    var lDamageMax = getWeaponDamage(aAttackerStruct.weaponLevel);
    var lDamageBonus = getWeaponBonus(aAttackerStruct.weaponLevel);
    var lDamageRoll = rollRandom(1, 1 + lDamageMax);
    var lDamageTotal = lDamageBase + lDamageBonus + lDamageRoll;

    switch (lAttackRoll) {
        case 1:
            var lSelfDamage = rollRandom(1, lDamageMax  + 1);
            aAttackerStruct.health -= lSelfDamage;
            console.log("Crit Fail, take " + lSelfDamage + " damage.");
            break;

        case 20:
            lDamageTotal += lDamageMax;
            aDefenderStruct.health -= lDamageTotal;
            console.log("Crit, dealt " + lDamageTotal + " damage");
            break;

        default:
            if (lAttackTotal > lDefenseTotal) {
                aDefenderStruct.health -= lDamageTotal;
                console.log("Hit, dealt " + lDamageTotal + " damage");
            } else {
                console.log("Miss, " + lAttackTotal + " against " + lDefenseTotal);
            }
            break;
    }

    console.log("attacker health: " + aAttackerStruct.health);
    console.log("defender health: " + aDefenderStruct.health);
    console.log("\n\n");
}

// refactor later, just get it down
function getWeaponBonus(aLevel) {
    switch (aLevel % 3) {
        case 0:
            return 2;

        case 1:
            return 0;

        case 2:
            return 1;
    }
}

function getWeaponDamage(aLevel) {
    return 4 + 2 * Math.floor((aLevel - 1) / 3);
}

function rollRandom(aMinimum, aMaximum) {
    return Math.floor(Math.random() * (aMaximum - aMinimum) + aMinimum);
}