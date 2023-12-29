import { ActionTypes } from "./action-types";
import { Spell } from "./spell";
import { EmptySpell } from "./spells/empty-spell";
import { ShieldSpell } from "./spells/shield-spell";
import { SimpleAttackSpell } from "./spells/simple-attack-spell";

export class SpellBook {

    private readonly spells: { [action in ActionTypes]: Spell };

    constructor(private readonly perk: Spell) {
        this.spells = {
            [ActionTypes.Attack]: new SimpleAttackSpell(),
            [ActionTypes.Defense]: new ShieldSpell(),
            [ActionTypes.Perk]: this.perk,
            [ActionTypes.None]: new EmptySpell(),
        }
    }

    getSpell(action: ActionTypes): Spell {
        return this.spells[action];
    }
}