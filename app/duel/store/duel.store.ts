import { makeAutoObservable } from 'mobx';
import { Duel, DuelActionParams } from '../model/duel';
import { Wizard } from '../../models/wizard';
import { Color } from '../../models/colors';
import { SpellBook } from '../../models/spell-book';
import { HealSpell } from '../../models/spells/heal-spell';
import { ActionTypes } from '../../models/action-types';
import { Observable } from 'rxjs';
import { DuelStatus } from '../model/duel-status';
import { DuelPreparationChecker } from '../model/duel-preparation-checker';

class DuelStore {
    complete$: Observable<Wizard | null>;
    actions$: Observable<DuelActionParams>;

    leftWizard = new Wizard(Color.Red, new SpellBook(new HealSpell()));
    rightWizard = new Wizard(Color.Blue, new SpellBook(new HealSpell()));
    duel = new Duel(this.leftWizard, this.rightWizard);
    status: DuelStatus = DuelStatus.Created;
    lastUpdated = Date.now();
    preparationChecker = new DuelPreparationChecker();

    winner: Wizard | null = null;

    leftHealth = 100;
    rightHealth = 100;
    leftMana = 100;
    rightMana = 100;

    constructor() {
        makeAutoObservable(this);
        this.complete$ = this.duel.complete$.asObservable();
        this.actions$ = this.duel.actions$.asObservable();
    }

    updateGameStatus = (status: DuelStatus) => {
        this.status = status;
    };

    updateLastUpdated = (time: number) => {
        this.lastUpdated = time;
    };

    reset = () => {
        this.preparationChecker = new DuelPreparationChecker();
        this.leftWizard = new Wizard(Color.Red, new SpellBook(new HealSpell()));
        this.rightWizard = new Wizard(
            Color.Blue,
            new SpellBook(new HealSpell()),
        );
        this.duel = new Duel(this.leftWizard, this.rightWizard);
        this.status = DuelStatus.Created;
        this.lastUpdated = Date.now();

        this.winner = null;

        this.leftHealth = 100;
        this.rightHealth = 100;
        this.leftMana = 100;
        this.rightMana = 100;

        this.complete$ = this.duel.complete$.asObservable();
        this.actions$ = this.duel.actions$.asObservable();
    };

    performRound = (actionLeft: ActionTypes, actionRight: ActionTypes) => {
        this.duel.round(actionLeft, actionRight);

        this.leftHealth = this.leftWizard.getHealth();
        this.rightHealth = this.rightWizard.getHealth();
        this.leftMana = this.leftWizard.getMana();
        this.rightMana = this.rightWizard.getMana();
    };
}

export const duelStore = new DuelStore();
