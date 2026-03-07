import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import { Camera } from 'expo-camera';

export function usePoseDetectionModel() {
    const [isReady, setIsReady] = useState(false);
    const modelRef = useRef<posedetection.PoseDetector | null>(null);

    useEffect(() => {
        let disposed = false;

        async function init() {
            await Camera.requestCameraPermissionsAsync();
            await tf.ready();

            const detector = await posedetection.createDetector(
                posedetection.SupportedModels.MoveNet,
                {
                    modelType: posedetection.movenet.modelType.MULTIPOSE_LIGHTNING,
                    minPoseScore: 0.2,
                } as posedetection.MoveNetModelConfig,
            );

            if (!disposed) {
                modelRef.current = detector;
                setIsReady(true);
            } else {
                detector.dispose();
            }
        }

        init();

        return () => {
            disposed = true;
            modelRef.current?.dispose();
            modelRef.current = null;
        };
    }, []);

    return { model: modelRef, isReady };
}
