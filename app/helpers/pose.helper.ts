import { ActionTypes } from "../models/action-types";
import { BodyPart, BodyPartTypes, Pose } from "../duel/model/pose.type";

const MAIN_CONFIDENCE = .00001;

export class BodyPartHelper {
    private static isAnyPart(mainParts: BodyPart[], relatedParts: BodyPart[], condFn: (mainPart: BodyPart, relatedPart: BodyPart) => boolean) {
        const confidenceMainParts = mainParts.filter(p => p.confidence > MAIN_CONFIDENCE);
        const confidenceRelatedParts = relatedParts.filter(p => p.confidence > MAIN_CONFIDENCE);

        if (confidenceMainParts.length < 1 || confidenceRelatedParts.length < 1) {
            return false;
        }

        return !!confidenceMainParts.find(mp => confidenceRelatedParts.find(rp => condFn(mp, rp)))
    }

    static isAnyPartOutXRange(mainParts: BodyPart[], relatedParts: BodyPart[], distance: number) {
        const condFn = (mp: BodyPart, rp: BodyPart) => Math.abs(mp.x - rp.x) > distance;
        return BodyPartHelper.isAnyPart(mainParts, relatedParts, condFn)
    }

    static isAnyPartHigher(mainParts: BodyPart[], relatedParts: BodyPart[], distance: number) {
        const condFn = (mp: BodyPart, rp: BodyPart) => {
            return mp.y - rp.y > distance;
        };
        return BodyPartHelper.isAnyPart(mainParts, relatedParts, condFn)
    }

    static isAnyPartInArea(mainParts: BodyPart[], relatedParts: BodyPart[], min: number, max: number) {
        const condFn = (mp: BodyPart, rp: BodyPart) =>
            Math.abs(mp.y - rp.y) > min &&
            Math.abs(mp.y - rp.y) < max &&
            Math.abs(mp.x - rp.x) > min &&
            Math.abs(mp.x - rp.x) < max;
        return BodyPartHelper.isAnyPart(mainParts, relatedParts, condFn)
    }

    static isAnyPartInYRange(mainParts: BodyPart[], relatedParts: BodyPart[], distance: number) {
        const condFn = (mp: BodyPart, rp: BodyPart) => Math.abs(mp.y - rp.y) < distance;
        return BodyPartHelper.isAnyPart(mainParts, relatedParts, condFn)
    }

    static isAnyPartInXRange(mainParts: BodyPart[], relatedParts: BodyPart[], distance: number) {
        const condFn = (mp: BodyPart, rp: BodyPart) => Math.abs(mp.x - rp.x) < distance;
        return BodyPartHelper.isAnyPart(mainParts, relatedParts, condFn)
    }
}

export class DetectorPoseAction {

    isAttackPose(pose: Pose) {
        return BodyPartHelper.isAnyPartOutXRange(
            [
                pose[BodyPartTypes.LeftShoulder],
                pose[BodyPartTypes.RightShoulder]
            ],
            [
                pose[BodyPartTypes.RightElbow],
                pose[BodyPartTypes.LeftElbow]
            ],
            40)
            &&
            BodyPartHelper.isAnyPartInYRange(
                [
                    pose[BodyPartTypes.LeftShoulder],
                    pose[BodyPartTypes.RightShoulder]
                ],
                [
                    pose[BodyPartTypes.RightElbow],
                    pose[BodyPartTypes.LeftElbow],
                    pose[BodyPartTypes.LeftWrist],
                    pose[BodyPartTypes.RightWrist],
                ],
                50)
    }

    isPerkPose(pose: Pose) {
        return BodyPartHelper.isAnyPartHigher(
            [
                pose[BodyPartTypes.LeftEye],
                pose[BodyPartTypes.RightEye],
                pose[BodyPartTypes.Nose],
                pose[BodyPartTypes.LeftEar],
                pose[BodyPartTypes.RightEar]
            ],
            [
                pose[BodyPartTypes.RightWrist],
                pose[BodyPartTypes.LeftWrist],
                pose[BodyPartTypes.RightElbow],
                pose[BodyPartTypes.LeftElbow]
            ], 20)
    }

    isDefencePose(pose: Pose) {
        return BodyPartHelper.isAnyPartInArea([pose[BodyPartTypes.LeftShoulder]], [pose[BodyPartTypes.RightWrist]], 0, 50) ||
            BodyPartHelper.isAnyPartInArea([pose[BodyPartTypes.RightShoulder]], [pose[BodyPartTypes.LeftWrist]], 0, 50)
    }

    getActionByPose(pose: Pose | null): ActionTypes {
        if (!pose) {
            return ActionTypes.None;
        }

        if (this.isDefencePose(pose)) {
            return ActionTypes.Defense;
        }

        if (this.isPerkPose(pose)) {
            return ActionTypes.Perk;
        }


        if (this.isAttackPose(pose)) {
            return ActionTypes.Attack;
        }


        return ActionTypes.None;
    }
}

export class DetectorPoseDirection {

    private static posecChecker(pose: Pose, compFn: (part: BodyPart) => boolean) {
        if (!pose) {
            return false;
        }

        const ensureParts = [pose[BodyPartTypes.LeftEye], pose[BodyPartTypes.LeftShoulder], pose[BodyPartTypes.Nose], pose[BodyPartTypes.RightEye], pose[BodyPartTypes.RightShoulder]].filter(part => part.confidence > MAIN_CONFIDENCE);

        if (ensureParts.length < 1) {
            return false;
        }

        return ensureParts.every(compFn);
    }

    static isPoseLeft(halfWidth: number, pose: Pose) {
        const compFn = (part: BodyPart) => part.confidence > MAIN_CONFIDENCE && part.x > halfWidth

        return this.posecChecker(pose, compFn);
    }

    static isPoseRight(halfWidth: number, pose: Pose) {
        const compFn = (part: BodyPart) => part.confidence > MAIN_CONFIDENCE && part.x < halfWidth

        return this.posecChecker(pose, compFn);
    }

    static detectPoseDirection(halfWidth: number, pose: Pose | null): 'left' | 'right' | 'none' {
        if (!pose) {
            return 'none';
        }

        if (this.isPoseLeft(halfWidth, pose)) {
            return 'left';
        }

        if (this.isPoseRight(halfWidth, pose)) {
            return 'right';
        }

        return 'none';
    }

    static getPosesWithDirection(poseOne: Pose | null, poseTwo: Pose | null, width: number) {
        const haflScreenWidth = width / 2;

        const poseOneDirection = this.detectPoseDirection(haflScreenWidth, poseOne);
        const poseTwoDirection = this.detectPoseDirection(haflScreenWidth, poseTwo);

        const result: { left: Pose | null, right: Pose | null } = { left: null, right: null }

        if (poseOneDirection === poseTwoDirection) {
            return result;
        }

        if (poseOneDirection === 'left') {
            result.left = poseOne;
        } else if (poseOneDirection === 'right') {
            result.right = poseOne;
        }

        if (poseTwoDirection === 'left') {
            result.left = poseTwo;
        } else if (poseTwoDirection === 'right') {
            result.right = poseTwo;
        }

        return result;
    }
}



