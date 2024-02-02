import { Wizard } from "../wizard";
import { PerkWizardSpell } from "./perk-spell";

export class HealSpell extends PerkWizardSpell {

    constructor() {
        super(15, 'Heal Spell', 'self');
    }

    cast(wizard: Wizard) {
        wizard.heal(Math.floor(Math.random() * 15) + 10);

        return 0;
    };
}