
import { Color } from "./colors";
import { SpellBook } from "./spell-book";

export class Wizard {

    constructor(
        public readonly color: Color,
        public readonly spellBook: SpellBook,
        private health: number = 100,
        private mana: number = 100,) {
    }

    getHealth() {
        return this.health;
    }

    getMana() {
        return this.mana;
    }

    castSpell(spellCost: number) {
        if (this.mana >= spellCost) {
            this.mana -= spellCost;
            return true;
        }

        return false;

    }

    receiveDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    heal(amount: number) {
        this.health += amount;
        if (this.health > 100) {
            this.health = 100;
        }
    }

    increaseMana(amount: number) {
        this.mana += amount;
        if (this.mana > 100) {
            this.mana = 100;
        }
    }
}

