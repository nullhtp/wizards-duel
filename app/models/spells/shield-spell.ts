import { DefenseSpell } from "./defense-spell";

export class ShieldSpell extends DefenseSpell {
    constructor() {
        super(5, 'Shield spell');
    }

    cast() {
        const damage_reduce = Math.floor(Math.random() * 5) + 10
        return damage_reduce;
    }
}