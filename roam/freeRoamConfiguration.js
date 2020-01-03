export class FreeRoamConfiguration {

    // 设置相机坐标Y轴
    static positionY = 7;
    // 设置焦点坐标Y轴
    static targetY = 6;
    // 设定相机与焦点之间的水平距离
    static horizontalDistanceBetweenCameraAndTarget = 20;
    // 路线最大id
    static lineMaxId = 6;

    // 一次前进距离
    static onceForwardDistance = 2;
    // 一次后退距离
    static onceBackwardDistance = 1;
    // 坐标点检测范围（相机到达某一坐标点范围内后会被检测到）,值是一次前进距离的一半
    static detectionRange = 1;
}