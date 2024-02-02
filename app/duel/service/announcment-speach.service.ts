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
    [AnnouncmentEvent.DuelBegin]: require(`../../../assets/sounds/announcment/en/duel_begin.mp3`),
    [AnnouncmentEvent.DuelPrepare]: require(`../../../assets/sounds/announcment/en/prepare_duel.mp3`),
    [AnnouncmentEvent.DuelEndBlueWin]: require(`../../../assets/sounds/announcment/en/duel_blue_win.mp3`),
    [AnnouncmentEvent.DuelEndRedWin]: require(`../../../assets/sounds/announcment/en/duel_red_win.mp3`),
    [AnnouncmentEvent.DuelEndDraw]: require(`../../../assets/sounds/announcment/en/duel_draw.mp3`),
    [AnnouncmentEvent.UnknownWizard]: require(`../../../assets/sounds/announcment/en/duel_unknown_wizard.mp3`),
};

export class AnnouncmentSpeachService {
    async play(announce: AnnouncmentEvent, callback: () => void = () => { }) {
        if (!announce || !soundsFiles[announce]) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(soundsFiles[announce]);
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                callback();
                return;
            }
        });
        await sound.playAsync();
    }
}