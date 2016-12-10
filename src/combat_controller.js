"use strict";

module.exports = exports = CombatController;

const CombatClass = require("./combat_class");
const Weapon = require("./weapon");
const Armor = require("./armor");
const RNG = require("./rng");

function CombatController() {
    // for (var a = 0; a < 10; a++) {
    //     var baseWeights = [10, 10, 15, 15, 20, 10, 5, 2, 5];
    //     var rolls = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //     for (var i = 0; i < 30; i++) {
    //         rolls[RNG.rollWeighted(
    //             baseWeights[0],
    //             baseWeights[1],
    //             baseWeights[2],
    //             baseWeights[3],
    //             baseWeights[4],
    //             baseWeights[5],
    //             baseWeights[6],
    //             baseWeights[7],
    //             baseWeights[8]
    //         )]++;
    //     }
    //     console.log(
    //         a + ":",
    //         rolls[0],
    //         rolls[1],
    //         rolls[2],
    //         rolls[3],
    //         rolls[4],
    //         rolls[5],
    //         rolls[6],
    //         rolls[7],
    //         rolls[8]
    //     );
    // }
}

CombatController.prototype.handleAttack = function(aAttackerClass, aDefenderClass) {
    var lAttackBase = Math.floor(aAttackerClass.attackBonus);
    var lAttackBonus = aAttackerClass.weapon.hitBonus;
    var lAttackRoll = RNG.rollRandom(1, 20);
    var lAttackTotal = lAttackBase + lAttackBonus + lAttackRoll;
    var lAttackEffect = aAttackerClass.weapon.attackEffect;

    var lDefenseBase = aDefenderClass.armor.defense;
    var lDefenseBonus = Math.floor(aDefenderClass.defenseBonus);
    var lDefenseTotal = lDefenseBase + lDefenseBonus;

    var lDamageBase = aAttackerClass.weapon.level - 1;
    var lDamageMax = aAttackerClass.weapon.damageMax;
    var lDamageMin = aAttackerClass.weapon.damageMin;
    var lDamageRoll = RNG.rollRandom(lDamageMin, lDamageMax);
    var lDamageBonus = Math.floor(aAttackerClass.damageBonus);
    var lDamageResist = aDefenderClass.armor.level;
    var lDamageTotal = Math.max(lDamageBase + lDamageBonus + lDamageRoll - lDamageResist, 1); // DR shouldnt deal zero or negative damage

    var lApplyEffect = false;

    var message;
    var attacker = aAttackerClass.name;
    var defender = aDefenderClass.name;
    var playerAttacker = (attacker == "Knight" || attacker == "Archer" || attacker == "Mage");

    if (lAttackRoll == 1) {
        var lSelfDamage = RNG.rollMultiple(1, 3, Math.max(1, aAttackerClass.weapon.level / 5));
        aAttackerClass.health -= lSelfDamage;
        if (aAttackerClass.health <= 0) { // Crit fail cant kill an entity
            lSelfDamage - (1 - aAttackerClass.health);
            aAttackerClass.health = 1;
        }
        // attacker hit itself, play attacker hit sound

        // If attacker is player
        if (playerAttacker) {
            message = `You critically fail your attack and hurt yourself for ${lSelfDamage} damage.`;
        } else { // attacker is enemy
            message = `The ${attacker} critically fails its attack and takes ${lSelfDamage} damage.`;
        }
    } else if (lAttackRoll == 20 || (lAttackRoll >= 18 && (aAttackerClass.weapon.attackType == "Ranged" || aAttackerClass.weapon.name == "Battleaxe"))) {
        lDamageTotal += lDamageMax;
        aDefenderClass.health -= lDamageTotal;
        // defender hit, play defender hit sound

        if (lAttackEffect != "") lApplyEffect = RNG.rollWeighted(1, 4);

        // If attacker is player
        if (playerAttacker) {
            message = `Your attack is perfect, striking the ${defender} for ${lDamageTotal} damage.`;
        } else { // attacker is enemy
            message = `The ${attacker}'s attack is perfect, striking you for ${lDamageTotal} damage.`;
        }
    } else {
        if (lAttackTotal > lDefenseTotal || aAttackerClass.weapon.name == "Magic Missile") {
            aDefenderClass.health -= lDamageTotal;
            // defender hit, play defender hit sound

            if (lAttackEffect != "") lApplyEffect = RNG.rollWeighted(1, 1);

            // If attacker is player
            if (playerAttacker) {
                message = `Your attack strikes the ${defender} for ${lDamageTotal} damage.`;
            } else { // attacker is enemy
                message = `The ${attacker}'s attack strikes you for ${lDamageTotal} damage.`;
            }
        } else {
            // If attacker is player
            if (playerAttacker) {
                message = `Your attack misses the ${defender}.`;
            } else { // attacker is enemy
                message = `The ${attacker}'s attack misses you.`;
            }
        }
    }

    if (aDefenderClass.health <= 0) message = message.replace(".", ", killing it.");
    window.terminal.log(message, window.colors.combat);
    if (lApplyEffect) {
        aDefenderClass.status.effect = lAttackEffect;
        aDefenderClass.status.timer = 3;
        window.terminal.log(`The ${defender} is now ${lAttackEffect}.`, window.colors.combat);
    }
}

CombatController.prototype.handleStatus = function(aCombatClass) {
    switch (aCombatClass.status.effect) {
        case "Burned":
        case "Poisoned":
            if (aCombatClass.status.timer > 0) {
                aCombatClass.status.timer--;
                var damage = RNG.rollMultiple(1, 5, Math.max(1, window.player.level / 5));
                aCombatClass.health -= damage;
                window.terminal.log(`${damage} ${aCombatClass.status.effect.substring(0, aCombatClass.status.effect.length - 2)} damage.`, window.colors.combat);
            } else {
                aCombatClass.status.effect == "None";
            }
            break;

        case "Stunned":
        case "Frozen":
            if (aCombatClass.status.timer > 1) {
                aCombatClass.status.timer--;
                window.terminal.log(`The ${aCombatClass.name} is ${aCombatClass.status.effect}.`, window.colors.combat);
            } else if (aCombatClass.status.timer == 1) {
                if (RNG.rollWeighted(1, 1)) aCombatClass.status.timer--;
                else window.terminal.log(`The ${aCombatClass.name} is ${aCombatClass.status.effect}.`, window.colors.combat);
            } else {
                aCombatClass.status.effect = "None";
            }
            break;

        default:
            return;
    }
}

CombatController.prototype.randomDrop = function(aPosition) {
    var lDrop = new Object();
    var lRand = RNG.rollRandom(1, 20);
    var level = window.player.level + RNG.rollWeighted(5, 4, 1);

    if (lRand > 17) {                           // spawn armor
        var armorArray = getArmors();
        var robesChance = (window.player.class == "Mage") ? 30 : 10;
        var armorRand = RNG.rollWeighted(robesChance, 35, 35, 10, 5);
        lDrop = new Armor(armorArray[armorRand], level);
    } else if (lRand > 1 && lRand < 17) {       // spawn weapon
        var classRand = getClass(window.player.class);
        var weaponArray = getWeapons()[classRand];
        var weaponRand = RNG.rollRandom(0, weaponArray.length - 1);
        lDrop = new Weapon(weaponArray[weaponRand], level);
    } else {                                    // dont spawn anything
        lDrop.type = "None";
    }
    lDrop.position = aPosition;
    return lDrop;
}

CombatController.prototype.getPercentArray = function() {
    // damage, health, defense, attack, zombie, skele, cap, shaman, empty
    var baseWeights = [10, 10, 15, 15, 20, 8, 5, 2, 5];
    var level = window.player.level;
    var mult = 1;

    var damageWeight = baseWeights[0];
    var healthWeight = baseWeights[1];
    var defenseWeight = baseWeights[2];
    var attackWeight = baseWeights[3];

    var zombieWeight = baseWeights[4];
    var skeletonWeight = baseWeights[5];
    var captainWeight;
    if (level < 5) captainWeight = 0;
    else if (level < 10 && rollWeighted(1, 1)) captainWeight = baseWeights[6];
    else captainWeight = baseWeights[6] + level;
    var shamanWeight;
    if (level < 5) shamanWeight = 0;
    else if (level < 10 && rollWeighted(1, 1)) shamanWeight = baseWeights[7];
    else shamanWeight = baseWeights[7] + level;


    var emptyWeight = baseWeights[8];

    return [damageWeight, healthWeight, defenseWeight, attackWeight,
        zombieWeight, skeletonWeight, captainWeight, shamanWeight, emptyWeight];

    // return baseWeights;
}

function getClass(aClass) {
    switch (aClass) {
        case "Knight":
            return RNG.rollWeighted(5, 1, 1);
        case "Archer":
            return RNG.rollWeighted(1, 5, 1);
        case "Mage":
            return RNG.rollWeighted(1, 1, 5);
    }
}

function getArmors() {
    return ["Robes", "Hide Armor", "Leather Armor", "Chainmail", "Plate Armor"];
}

function getWeapons() {
    return [
        ["Longsword", "Morning Star", "Halberd", "Battleaxe"],
        ["Bodkin", "Broadhead", "Poison-Tipped", "Heavy Bolts"],
        ["Magic Missile", "Fireball", "Frostbolt", "Eldritch Blast"]
    ];
}

