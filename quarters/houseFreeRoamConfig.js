export class HouseFreeRoamConfig {

    // 设置相机坐标Y轴
    static positionY = 1.7;
    // 设置焦点坐标Y轴
    static targetY = 1;

    // 一次前进距离
    static onceForwardDistance = 0.25;
    // 一次后退距离
    static onceBackwardDistance = 0.125;
    // 坐标点检测范围（相机到达某一坐标点范围内后会被检测到）,值是一次前进距离的一半
    static detectionRange = 0.125;
}