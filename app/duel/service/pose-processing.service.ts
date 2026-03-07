import * as posedetection from '@tensorflow-models/pose-detection';
import { mapToPose } from './pose-mapper';
import { DetectorPoseAction, DetectorPoseDirection } from '../../helpers/pose.helper';
import { OnPoseDetectionParams } from '../components/pose-detection.component';

const actionDetector = new DetectorPoseAction();

export function processPoses(
    poses: posedetection.Pose[],
    frameWidth: number,
): OnPoseDetectionParams | null {
    if (poses.length === 0 || poses.length >= 3) {
        return null;
    }

    const firstPose = mapToPose(poses[0]);
    const secondPose = mapToPose(poses[1]);

    const posesWithDirection = DetectorPoseDirection.getPosesWithDirection(
        firstPose,
        secondPose,
        frameWidth,
    );

    return {
        leftWizardAction: actionDetector.getActionByPose(posesWithDirection.left),
        rightWizardAction: actionDetector.getActionByPose(posesWithDirection.right),
        unknownWizard: poses.length > 2,
    };
}
