export class FreeRoamConfiguration {

    // 设置相机坐标Y轴
    static positionY = 3;
    // 设置焦点坐标Y轴
    static targetY = 3;
    // 设定相机与焦点之间的水平距离
    static horizontalDistanceBetweenCameraAndTarget = 2;
    // 路线最大id
    static lineMaxId = 6;

    // 一次前进距离
    static onceForwardDistance = 0.5;
    // 一次后退距离
    static onceBackwardDistance = 0.25;
    // 坐标点检测范围（相机到达某一坐标点范围内后会被检测到）,值是一次前进距离的一半
    static detectionRange = 0.25;
}