import { Spell } from "../spell";
import { SpellType } from "../spell-type";

export abstract class DefenseSpell extends Spell {

    constructor(
        public readonly cost: number,
        public readonly name: string,
    ) {
        super(
            SpellType.Defence,
            cost,
            name,
            'self',
        )
    }

}