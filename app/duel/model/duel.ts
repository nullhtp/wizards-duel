import { Subject, interval } from "rxjs";
import { ActionTypes } from "../../models/action-types";
import { SpellType } from "../../models/spell-type";
import { PerkAffectsType, PerkSpell } from "../../models/spells/perk-spell";
import { Wizard } from "../../models/wizard";
import { DuelActionType } from "./duel-action.type";
import { Spell } from "../../models/spell";


export type DuelActionParams = {
    left?: DuelActionType,
    right?: DuelActionType,
    field?: DuelActionType,
}

export class Duel {

    complete$ = new Subject<Wizard | null>();
    actions$ = new Subject<DuelActionParams>();
    manaRecoverSubscription = interval(1000).subscribe(() => {
        this.leftWizard.increaseMana(1);
        this.rightWizard.increaseMana(1);
    });

    spellQueue: { [color: string]: Spell[] }

    constructor(
        private readonly leftWizard: Wizard,
        private readonly rightWizard: Wizard,
    ) {
        this.spellQueue = { [leftWizard.color]: [], [rightWizard.color]: [] };
    }

    round(leftAction: ActionTypes, rightAction: ActionTypes) {
        const leftSpellCasted = this.castSpell(this.leftWizard, leftAction);
        const rightSpellCasted = this.castSpell(this.rightWizard, rightAction);

        this.applySpellsEffects(this.leftWizard);
        this.applySpellsEffects(this.rightWizard);

        this.updateActions(
            leftSpellCasted ? leftAction : ActionTypes.None,
            rightSpellCasted ? rightAction : ActionTypes.None);

        this.updateDuelStatus();
    }

    private updateActions(leftAction: ActionTypes, rightAction: ActionTypes) {
        const result: DuelActionParams = {};
        if (
            (leftAction === ActionTypes.Attack && rightAction === ActionTypes.Defense)
            || (rightAction === ActionTypes.Attack && leftAction === ActionTypes.Defense)
        ) {
            this.actions$.next({ field: DuelActionType.DeflectedAttack });
            return;
        }

        if (leftAction === ActionTypes.Attack) {
            result.left = DuelActionType.Attack;
        } else if (leftAction === ActionTypes.Defense) {
            result.left = DuelActionType.Defense;
        } else if (leftAction === ActionTypes.Perk) {
            result.left = DuelActionType.Heal;
        }

        if (rightAction === ActionTypes.Attack) {
            result.right = DuelActionType.Attack;
        } else if (rightAction === ActionTypes.Defense) {
            result.right = DuelActionType.Defense;
        } else if (rightAction === ActionTypes.Perk) {
            result.right = DuelActionType.Heal;
        }

        this.actions$.next(result);
    }

    private finish() {
        this.complete$.complete();
        this.actions$.complete();
        this.manaRecoverSubscription.unsubscribe();
    }

    private updateDuelStatus() {
        const leftHealth = this.leftWizard.getHealth();
        const rightHealth = this.rightWizard.getHealth();

        if (leftHealth > 0 && rightHealth > 0) {
            return;
        }

        if (leftHealth === 0 && rightHealth > 0) {
            this.complete$.next(this.rightWizard);
        } else if (rightHealth === 0 && leftHealth > 0) {
            this.complete$.next(this.leftWizard);
        } else if (rightHealth === 0 && leftHealth === 0) {
            this.complete$.next(null);
        }

        this.finish();
    }

    private applySpellsEffects(wizard: Wizard) {
        const spells = this.spellQueue[wizard.color];

        const defense = spells.filter(s => s.type === SpellType.Defence).reduce((acc, s) => acc + s.cast(), 0)
        const attackReceived = spells.filter(s => s.type === SpellType.Attack).reduce((acc, s) => acc + s.cast(), 0)

        const boostSpells = spells.filter(s => s.type === SpellType.Perk) as PerkSpell[];

        const totalDefense = boostSpells
            .filter(s => s.affectsType === PerkAffectsType.Defense)
            .reduce((acc, boost) => boost.cast(acc), defense);

        const totalAttackReceived = boostSpells
            .filter(s => s.affectsType === PerkAffectsType.Attack)
            .reduce((acc, boost) => boost.cast(acc), attackReceived);

        boostSpells
            .filter(s => s.affectsType === PerkAffectsType.Wizard)
            .forEach((boost) => boost.cast(wizard));

        const damage = totalAttackReceived - totalDefense;

        if (damage > 0) {
            wizard.receiveDamage(damage);
        }

        this.spellQueue[wizard.color] = [];
    }

    private castSpell(wizard: Wizard, action: ActionTypes) {
        const spell = wizard.spellBook.getSpell(action);

        if (!wizard.castSpell(spell.cost)) {
            return false;
        }

        if (spell.target === 'self') {
            this.spellQueue[wizard.color].push(spell)
        } else {
            const enemyQueue = Object.entries(this.spellQueue).find(([color, value]) => color !== wizard.color);
            enemyQueue?.[1].push(spell);
        }

        return true;
    }
}