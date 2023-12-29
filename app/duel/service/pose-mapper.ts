import { BodyPart, Pose } from '../model/pose.type';
import * as posedetection from '@tensorflow-models/pose-detection';

export const mapToPose = (request: posedetection.Pose): Pose | null => {
    if (!request) {
        return null;
    }

    const points = request.keypoints;

    const result = points.reduce((acc, p) => ({
        ...acc, [p.name as string]: {
            x: p.x,
            y: p.y,
            confidence: p.score,
        } as BodyPart
    }), {} as Pose);

    return result;
}

