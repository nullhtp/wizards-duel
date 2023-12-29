// import Sound from 'react-native-sound';
import { Audio } from 'expo-av';

export enum AnnouncmentEvent {
    DuelBegin = 'duel-begin',
    DuelPrepare = 'duel-prepare',
    DuelEndRedWin = 'red-win',
    DuelEndBlueWin = 'blue-win',
    DuelEndDraw = 'draw',
    UnknownWizard = 'unknown-wizard',
}

const soundsFiles: { [name in AnnouncmentEvent]: any } = {
    [AnnouncmentEvent.DuelBegin]: require(`../../../assets/sounds/announcment/duel_begin.mp3`),
    [AnnouncmentEvent.DuelPrepare]: require(`../../../assets/sounds/announcment/prepare_duel.mp3`),
    [AnnouncmentEvent.DuelEndBlueWin]: require(`../../../assets/sounds/announcment/duel_blue_win.mp3`),
    [AnnouncmentEvent.DuelEndRedWin]: require(`../../../assets/sounds/announcment/duel_red_win.mp3`),
    [AnnouncmentEvent.DuelEndDraw]: require(`../../../assets/sounds/announcment/duel_draw.mp3`),
    [AnnouncmentEvent.UnknownWizard]: require(`../../../assets/sounds/announcment/duel_unknown_wizard.mp3`),
};

export class AnnouncmentSpeachService {
    async play(announce: AnnouncmentEvent, callback: () => void = () => { }) {
        if (!announce || !soundsFiles[announce]) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(soundsFiles[announce]);
        await sound.playAsync();
        await sound.unloadAsync();
        callback();

        // const sound = new Sound(soundsFiles[announce], Sound.MAIN_BUNDLE, (error) => {
        //     if (error) {
        //         console.log('failed to load the sound', error);
        //         return;
        //     }

        //     sound.play(() => {
        //         sound.release();
        //         callback();
        //     });
        // })
    }
}