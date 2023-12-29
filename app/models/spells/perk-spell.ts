import { Spell } from "../spell";
import { SpellType } from "../spell-type";
import { Wizard } from "../wizard";

export enum PerkAffectsType {
    Attack = 'attack',
    Defense = 'defense',
    Wizard = 'wizard'
}

export abstract class PerkSpell extends Spell {

    constructor(public readonly affectsType: PerkAffectsType, cost: number, name: string, target: 'self' | 'enemy') {
        super(SpellType.Perk, cost, name, target);
    }

    abstract cast(defensePoints?: number | Wizard): number;

}

export abstract class PerkDefenseSpell extends PerkSpell {
    constructor(cost: number, name: string, target: 'self' | 'enemy') {
        super(PerkAffectsType.Defense, cost, name, target);
    }

    abstract cast(defensePoints?: number): number;
}

export abstract class PerkAttackReceiveSpell extends PerkSpell {
    constructor(cost: number, name: string, target: 'self' | 'enemy') {
        super(PerkAffectsType.Attack, cost, name, target);
    }

    abstract cast(attackPoints?: number): number;

}

export abstract class PerkWizardSpell extends PerkSpell {
    constructor(cost: number, name: string, target: 'self' | 'enemy') {
        super(PerkAffectsType.Wizard, cost, name, target);
    }

    abstract cast(wizard?: Wizard): number;
}