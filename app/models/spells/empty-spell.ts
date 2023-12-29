import { Spell } from "../spell";
import { SpellType } from "../spell-type";

export class EmptySpell extends Spell {
    constructor(
    ) {
        super(
            SpellType.Perk,
            0,
            'empty',
            'self',
        )
    }

    cast() {
        return 0;
    }
}