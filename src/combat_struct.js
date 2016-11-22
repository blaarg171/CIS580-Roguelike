"use strict";

module.exports = exports = CombatStruct;

function CombatStruct(aType) {
    switch (aType) {
        case "Knight":
            this.health = 20;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1; // Temporary until working
            this.armorLevel = 5; // Temporary until working
            this.attackType = "Melee";
            this.attackRange = 1;
            break;

        case "Archer":
            this.health = 10;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1; // Temporary until working
            this.armorLevel = 3; // Temporary until working
            this.attackType = "Ranged";
            this.attackRange = 5;
            break;

        case "Mage":
            this.health = 10;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1; // Temporary until working
            this.armorLevel = 3; // Temporary until working
            this.attackType = "Magic";
            this.attackRange = 255;
            break;


        case "Zombie":
            this.health = 10;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1;
            this.armorLevel = 1;
            this.attackType = "Melee";
            this.attackRange = 1;
            this.senseRange = 15; // This might be too high, what if we keep the camera centered..?
            break;

        case "EnemyRanged":
            this.health = 10;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1;
            this.armorLevel = 3;
            this.attackType = "Ranged";
            this.attackRange = 5;
            this.senseRange = 15;
            break;

        case "Captain":
            this.health = 25;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1;
            this.armorLevel = 5;
            this.attackType = "Melee";
            this.attackRange = 1;
            this.senseRange = 20;
            break;

        case "Shaman":
            this.health = 10;
            this.stamina = 100;
            this.someOtherPowerup = 50;
            this.weaponLevel = 1;
            this.armorLevel = 1;
            this.attackType = "Magic";
            this.attackRange = 10;
            this.senseRange = 15;
            break;
    }
}

