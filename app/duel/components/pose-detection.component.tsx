import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { ActionTypes } from '../../models/action-types';
import { Dimensions, Platform, View, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera, CameraType } from 'expo-camera';
import { usePoseDetectionModel } from '../hooks/use-pose-detection-model';
import { processPoses } from '../service/pose-processing.service';

const TensorCamera = cameraWithTensors(Camera);

const IS_IOS = Platform.OS === 'ios';

const OUTPUT_TENSOR_WIDTH = Math.round(Dimensions.get('window').width / 4) * 4;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

const CAMERA_RATIO = IS_IOS ? '4:3' : '16:9';
const POSE_DETECTION_INTERVAL_MS = 800;

export type OnPoseDetectionParams = {
    leftWizardAction: ActionTypes;
    rightWizardAction: ActionTypes;
    unknownWizard: boolean;
};

export type PoseDetectionParams = {
    onPoseDetected: (param: OnPoseDetectionParams) => void;
};

const PoseDetectionComponent = observer(({ onPoseDetected }: PoseDetectionParams) => {
    const cameraRef = useRef(null);
    const rafId = useRef<number | null>(null);
    const lastUpdatedRef = useRef(Date.now());
    const { model } = usePoseDetectionModel();

    const handleCameraStream = async (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {
            const now = Date.now();

            if (now - lastUpdatedRef.current > POSE_DETECTION_INTERVAL_MS && model.current) {
                lastUpdatedRef.current = now;

                const imageTensor = images.next().value as tf.Tensor3D;

                const poses = await model.current.estimatePoses(
                    imageTensor,
                    undefined,
                    Date.now(),
                );

                const result = processPoses(poses, OUTPUT_TENSOR_WIDTH);
                if (result) {
                    onPoseDetected(result);
                }

                tf.dispose([imageTensor]);
            }

            if (rafId.current === 0) {
                return;
            }

            rafId.current = requestAnimationFrame(loop);
        };

        loop();
    };

    return (
        <View style={styles.container}>
            <TensorCamera
                ref={cameraRef}
                ratio={CAMERA_RATIO}
                style={styles.camera}
                autorender={true}
                type={CameraType.front}
                resizeWidth={OUTPUT_TENSOR_WIDTH}
                resizeHeight={OUTPUT_TENSOR_HEIGHT}
                resizeDepth={3}
                onReady={handleCameraStream}
                useCustomShadersToResize={false}
                cameraTextureWidth={OUTPUT_TENSOR_WIDTH}
                cameraTextureHeight={OUTPUT_TENSOR_HEIGHT}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    camera: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
});

export default PoseDetectionComponent;
