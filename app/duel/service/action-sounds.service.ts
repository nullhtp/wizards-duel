// import Sound from 'react-native-sound'; 'react-native-sound'
import { DuelActionType } from '../model/duel-action.type';



const soundsFiles: { [name in DuelActionType]: string } = {
    [DuelActionType.Attack]: 'attack.wav',
    [DuelActionType.Defense]: 'defense.wav',
    [DuelActionType.Heal]: 'heal.wav',
    [DuelActionType.DeflectedAttack]: 'deflected_attack.wav',
    [DuelActionType.None]: '',
};

// Sound.setCategory('MultiRoute');

export class ActionSoundsService {
    play(action: DuelActionType, direction: 'left' | 'right' | 'middle') {
        if (!action || !soundsFiles[action]) {
            return;
        }

        // const sound = new Sound(soundsFiles[action], Sound.MAIN_BUNDLE, (error) => {
        //     if (error) {
        //         console.log('failed to load the sound', error);
        //         return;
        //     }

        //     if (direction === 'left') {
        //         sound.setPan(0);
        //     } else if (direction === 'right') {
        //         sound.setPan(1);
        //     } else {
        //         sound.setPan(.5);
        //     }

        //     sound.play(() => sound.release());
        // })
    }
}