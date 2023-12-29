export type ResponseData = {
    pose: Pose,
}

export type Pose = {
    [key in BodyPartTypes]: BodyPart
}

export type BodyPart = {
    x: number,
    y: number,
    confidence: number,
}

export enum BodyPartTypes {
    Nose = 'nose',
    LeftEye = 'left_eye',
    RightEye = 'right_eye',
    LeftEar = 'left_ear',
    RightEar = 'right_ear',
    LeftShoulder = 'left_shoulder',
    RightShoulder = 'right_shoulder',
    LeftElbow = 'left_elbow',
    RightElbow = 'right_elbow',
    LeftWrist = 'left_wrist',
    RightWrist = 'right_wrist',
    LeftHip = 'left_hip',
    RightHip = 'right_hip',
    LeftKnee = 'left_knee',
    RightKnee = 'right_knee',
    LeftAnkle = 'left_ankle',
    RightAnkle = 'right_ankle'
}
