import React, { useEffect, useState } from 'react';
import { duelStore } from './store/duel.store';
import { observer } from 'mobx-react';
import DuelHeader from './components/duel-header.component';
import { ActionSoundsService } from './service/action-sounds.service';
import PoseDetectionComponent, {
    OnPoseDetectionParams,
} from './components/pose-detection.component';
import { DuelStatus } from './model/duel-status';
import { StyleSheet, Text, View } from 'react-native';
import {
    AnnouncmentEvent,
    AnnouncmentSpeachService,
} from './service/announcment-speach.service';
import DuelResultComponent from './components/duel-result.component';
import { Color } from '../models/colors';
import { Wizard } from '../models/wizard';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import DuelLoadingComponent from './components/duel-loading.component';

const soundsHelper = new ActionSoundsService();
const announcment = new AnnouncmentSpeachService();

const DuelComponent = observer(() => {
    useEffect(() => {
        const subscription = duelStore.complete$.subscribe((wizard) => {
            setDuelState('');
            setWinner(wizard);

            duelStore.updateGameStatus(DuelStatus.Finished);

            if (wizard?.color === Color.Red) {
                announcment.play(AnnouncmentEvent.DuelEndRedWin);
            } else if (wizard?.color === Color.Blue) {
                announcment.play(AnnouncmentEvent.DuelEndBlueWin);
            } else {
                announcment.play(AnnouncmentEvent.DuelEndDraw);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = duelStore.actions$.subscribe((action) => {
            let duelStatus = '';
            if (action.left) {
                soundsHelper.play(action.left, 'left');
                duelStatus = `Red: ${action.left}`;
            }
            if (action.right) {
                soundsHelper.play(action.right, 'right');
                duelStatus += ` Blue: ${action.right}`;
            }
            if (action.field) {
                soundsHelper.play(action.field, 'middle');
                duelStatus = `${action.field}`;
            }

            setDuelState(duelStatus);
        });

        return () => subscription.unsubscribe();
    }, []);

    const [duelState, setDuelState] = useState<string>('');
    const [winner, setWinner] = useState<Wizard | null>(null);

    const onDuelEnd = () => {
        router.replace('/');
        duelStore.reset();
        setDuelState('');
        setWinner(null);
    };

    const timeOver = () => {
        duelStore.duel.complete$.next(null);
    };

    const onPoseDetected = async (params: OnPoseDetectionParams) => {
        if (duelStore.status === DuelStatus.Created) {
            duelStore.updateGameStatus(DuelStatus.PreparePass);
            announcment.play(AnnouncmentEvent.DuelPrepare, () => {
                duelStore.updateGameStatus(DuelStatus.InProgress);
            });
            return;
        }

        if (duelStore.status === DuelStatus.Finished) {
            return;
        }

        if (duelStore.status === DuelStatus.InProgress) {
            duelStore.performRound(
                params.leftWizardAction,
                params.rightWizardAction,
            );
            return;
        }
    };

    let overlayComponent;
    let poseDetectionComponent;

    switch (duelStore.status) {
        case DuelStatus.Created:
        case DuelStatus.Prepare:
        case DuelStatus.PreparePass:
            overlayComponent = <DuelLoadingComponent />;
            poseDetectionComponent = (
                <PoseDetectionComponent onPoseDetected={onPoseDetected} />
            );
            break;
        case DuelStatus.InProgress:
            overlayComponent = (
                <DuelHeader duelStore={duelStore} onTimerEnd={timeOver} />
            );
            poseDetectionComponent = (
                <PoseDetectionComponent onPoseDetected={onPoseDetected} />
            );
            break;
        case DuelStatus.Finished:
            overlayComponent = (
                <DuelResultComponent win={winner} onClose={onDuelEnd} />
            );
            poseDetectionComponent = null;
            break;

        default:
            overlayComponent = null;
    }

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.overlayContainer}>
                {overlayComponent}

                <Text style={styles.overlayText}>{duelState}</Text>
            </View>
            {poseDetectionComponent}
        </>
    );
});

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    overlayText: {
        fontSize: 42,
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        margin: 'auto',
    },
});

export default DuelComponent;
