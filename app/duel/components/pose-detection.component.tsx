import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { getRandomAction } from '../../helpers/ai.helper';
import { ActionTypes } from '../../models/action-types';
import { Dimensions, Platform, View, Text, StyleSheet } from 'react-native';
import { DetectorPoseAction, DetectorPoseDirection } from '../../helpers/pose.helper';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera, CameraType } from 'expo-camera';
import * as posedetection from '@tensorflow-models/pose-detection';
import { mapToPose } from '../service/pose-mapper';


// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.

// const CAM_PREVIEW_WIDTH = 600;

// const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// const CAM_PREVIEW_HEIGHT = Dimensions.get('window').height;

// The score threshold for pose detection results.
// const MIN_KEYPOINT_SCORE = 0.00001;

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = Math.round(Dimensions.get('window').width / 4) * 4;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Whether to auto-render TensorCamera preview.
const RATIO = !IS_IOS ? '16:9' : '4:3';
const AUTO_RENDER = true;
const POSE_DETECTION_UPDATE_MS = 500;
let lastUpdated = Date.now();

let model: posedetection.PoseDetector | null = null

export type OnPoseDetectionParams = {
    leftWizardAction: ActionTypes,
    rightWizardAction: ActionTypes,
    unknownWizard: boolean,
}

export type PoseDetectionParams = {
    onPoseDetected: (param: OnPoseDetectionParams) => void,
}

const detector = new DetectorPoseAction();

const PoseDetectionComponent = observer((params: PoseDetectionParams) => {

    const cameraRef = useRef(null);
    // const [model, setModel] = useState<posedetection.PoseDetector>();

    // Use `useRef` so that changing it won't trigger a re-render.
    //
    // - null: unset (initial value).
    // - 0: animation frame/loop has been canceled.
    // - >0: animation frame has been scheduled.
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        async function prepare() {
            rafId.current = null;
            model = null;

            // Camera permission.
            await Camera.requestCameraPermissionsAsync();

            // Wait for tfjs to initialize the backend.
            await tf.ready();

            // Load movenet model.
            // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
            const movenetModelConfig: posedetection.MoveNetModelConfig = {
                modelType: posedetection.movenet.modelType.MULTIPOSE_LIGHTNING,
                minPoseScore: .2,
            };

            model = await posedetection.createDetector(
                posedetection.SupportedModels.MoveNet,
                movenetModelConfig
            );
        }

        prepare();
    }, []);


    useEffect(() => {
        // Called when the app is unmounted.
        return () => {
            if (rafId.current != null && rafId.current !== 0) {
                cancelAnimationFrame(rafId.current);
                rafId.current = 0;
            }
        };
    }, []);

    const handleCameraStream = async (
        images: IterableIterator<tf.Tensor3D>,
    ) => {

        const loop = async () => {

            const currentDate = Date.now();

            if (currentDate - lastUpdated > POSE_DETECTION_UPDATE_MS && model) {

                lastUpdated = currentDate;

                // Get the tensor and run pose detection.
                const imageTensor = images.next().value as tf.Tensor3D;

                const poses = await model!.estimatePoses(
                    imageTensor,
                    undefined,
                    Date.now()
                );

                if (poses.length > 0 && poses.length < 3) {
                    const firstWizardPose = mapToPose(poses[0]);
                    const secondWizardPose = mapToPose(poses[1]);

                    const poseWithDerection = DetectorPoseDirection.getPosesWithDirection(firstWizardPose, secondWizardPose, OUTPUT_TENSOR_WIDTH);

                    const leftWizardAction = detector.getActionByPose(poseWithDerection.left);//getRandomAction(); //
                    const rightWizardAction = detector.getActionByPose(poseWithDerection.right); //getRandomAction(); //

                    if (params?.onPoseDetected) {
                        params.onPoseDetected({
                            leftWizardAction,
                            rightWizardAction,
                            unknownWizard: poses.length > 2,
                        });
                    }
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

    const getOutputTensorWidth = () => {
        // On iOS landscape mode, switch width and height of the output tensor to
        // get better result. Without this, the image stored in the output tensor
        // would be stretched too much.
        //
        // Same for getOutputTensorHeight below.
        return OUTPUT_TENSOR_WIDTH;
    };

    const getOutputTensorHeight = () => {
        return OUTPUT_TENSOR_HEIGHT;
    };
    // if (!tfReady) {
    //     return (
    //         <View style={styles.loadingMsg}>
    //             <Text>Loading...</Text>
    //         </View>
    //     );
    // } else {
    return (

        // Note that you don't need to specify `cameraTextureWidth` and
        // `cameraTextureHeight` prop in `TensorCamera` below.
        <View style={styles.containerLandscape}>
            <TensorCamera
                ref={cameraRef}
                ratio={RATIO}
                style={styles.camera}
                autorender={AUTO_RENDER}
                type={CameraType.front}
                // tensor related props
                resizeWidth={getOutputTensorWidth()}
                resizeHeight={getOutputTensorHeight()}
                resizeDepth={3}
                onReady={handleCameraStream}
                useCustomShadersToResize={false}
                cameraTextureWidth={getOutputTensorWidth()}
                cameraTextureHeight={getOutputTensorHeight()}
            />
        </View>
    );
    // }
});

const styles = StyleSheet.create({
    containerLandscape: {
        position: 'relative',
    },
    loadingMsg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
});


export default PoseDetectionComponent;