import { SpellType } from "./spell-type";

export abstract class Spell {

    constructor(
        public readonly type: SpellType,
        public readonly cost: number,
        public readonly name: string,
        public readonly target: 'self' | 'enemy',
    ) {
    }

    abstract cast(data?: any): number;
}