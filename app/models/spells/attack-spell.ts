import { Spell } from "../spell";
import { SpellType } from "../spell-type";

export abstract class AttackSpell extends Spell {
    constructor(
        public readonly cost: number,
        public readonly name: string,
    ) {
        super(
            SpellType.Attack,
            cost,
            name,
            'enemy',
        )
    }

}