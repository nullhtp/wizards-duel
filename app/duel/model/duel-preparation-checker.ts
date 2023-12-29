import { ActionTypes } from "../../models/action-types"

export type PreparationChecklist = { [key in ActionTypes]: boolean }

export class DuelPreparationChecker {
    private wizardLeftChecklist: PreparationChecklist = {
        attack: false,
        defense: false,
        perk: false,
        none: false,
    }

    private wizardRightChecklist: PreparationChecklist = {
        attack: false,
        defense: false,
        perk: false,
        none: false,
    }

    checkPose(left: ActionTypes, right: ActionTypes) {
        this.mark(this.wizardLeftChecklist, left);
        this.mark(this.wizardRightChecklist, right);
    }

    getCheckLists() {
        return { left: this.wizardLeftChecklist, right: this.wizardRightChecklist };
    }

    isAllChecked() {
        return Object.values(this.wizardLeftChecklist).every((v) => v) && Object.values(this.wizardRightChecklist).every((v) => v);
    }

    private mark(checkList: PreparationChecklist, action: ActionTypes) {
        checkList[action] = true;
    }
}