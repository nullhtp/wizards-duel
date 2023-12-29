import { Audio } from 'expo-av';
import { DuelActionType } from '../model/duel-action.type';

const soundsFiles: { [name in DuelActionType]: any } = {
    [DuelActionType.Attack]: require('../../../assets/sounds/effects/attack.wav'),
    [DuelActionType.Defense]: require('../../../assets/sounds/effects/defense.wav'),
    [DuelActionType.Heal]: require('../../../assets/sounds/effects/heal.wav'),
    [DuelActionType.DeflectedAttack]: require('../../../assets/sounds/effects/deflected_attack.wav'),
    [DuelActionType.None]: '',
};

export class ActionSoundsService {

    async play(action: DuelActionType, direction: 'left' | 'right' | 'middle') {
        if (!action || !soundsFiles[action]) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(soundsFiles[action]);
        if (direction === 'left') {
            await sound.setVolumeAsync(1, -1);
        } else if (direction === 'right') {
            await sound.setVolumeAsync(1, 1);
        } else {
            await sound.setVolumeAsync(1, 0);
        }
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                return;
            }
        });
        await sound.playAsync();
    }
}