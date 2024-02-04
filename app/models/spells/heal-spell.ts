import { Wizard } from "../wizard";
import { PerkWizardSpell } from "./perk-spell";

export class HealSpell extends PerkWizardSpell {

    constructor() {
        super(10, 'Heal Spell', 'self');
    }

    cast(wizard: Wizard) {
        wizard.heal(Math.floor(Math.random() * 5) + 10);

        return 0;
    };
}