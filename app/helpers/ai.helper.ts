import { ActionTypes } from "../models/action-types";

export const getRandomAction = () => {
    const probability = Math.random() * 10;
    if (probability < 2) {
        return ActionTypes.None;
    }
    if (probability < 5) {
        return ActionTypes.Defense;
    }
    if (probability < 8) {
        return ActionTypes.Attack;
    }
    return ActionTypes.Perk;
};