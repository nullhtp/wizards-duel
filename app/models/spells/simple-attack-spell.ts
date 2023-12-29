import { AttackSpell } from "./attack-spell";

export class SimpleAttackSpell extends AttackSpell {

    constructor() {
        super(10, 'Simple Attack Spell');
    }

    cast() {
        return Math.floor(Math.random() * 5) + 10;
    };
}