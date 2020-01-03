export class MapConfiguration {

    // 开始位置
    static startPosition = { x: 119.92392231992083, y: 32.38401248596911 + 0.036887233525095 };
    // 自由巡检主视角经纬度
    static freeRoamMainView = { lng: 119.92050928016923, lat: 32.388417918122855 + 0.036887233525095 };
    // 从地球上空飞行到指定位置的时间
    static flightTime = 5;
    // 相机近地面距离
    static nearDistance = 400;
    // 相机远地面距离
    static farDistance = 8500;
    // 相机近地面纬度偏差值
    static nearDistanceDeviation = 0.00386176411506;
    // 相机远地面偏差值
    static farDistanceDeviation = 0.036887233525095;
    // 相机倾斜距离地面的最大高度
    static cameraTiltMaxHight = 30000;
    // 相机倾斜角度
    static cameraTiltDegree = -45;

    // 正常路线宽度
    static normalLineWidth = 7;
    // 高亮路线宽度
    static highLineWidth = 35;
    // 路线最大id
    static lineMaxId = 6;
    // 路线图标经纬度
    static pipeLineIconPositions = [
        { lng: 119.90859484018362, lat: 32.488835079398744 },
        { lng: 119.92129694137134, lat: 32.46329064651353 },
        { lng: 119.9252764567779, lat: 32.47627953588373 },
        { lng: 119.94340609430826, lat: 32.459344960063315 }
    ];
    // 路线图标宽度
    static pipeLineIconWidth = 123.65;
    // 路线图标高度
    static pipeLineIconHeight = 50;

    // 高亮图片位置
    static lightImgPositions = [
        { lng: 119.90652661526094, lat: 32.44866363140074 },
        { lng: 119.90807358299854, lat: 32.45888497873569 },
        { lng: 119.9280609430826, lat: 32.456794960063315 },
        { lng: 119.90897902843138, lat: 32.46658336701496 },
        { lng: 119.91840454082125, lat: 32.46066425993072 },
        { lng: 119.90881500671105, lat: 32.48200263374862 },
        { lng: 119.9272764567779, lat: 32.47353953588373 }
    ];
    // 高亮图片的宽高
    static lightImgSizes = [
        { width: 200, height: 300 },
        { width: 130, height: 62 },
        { width: 870, height: 130 },
        { width: 130, height: 180 },
        { width: 450, height: 90 },
        { width: 100, height: 240 },
        { width: 680, height: 90 }
    ];


    // 1经度对应3D模型坐标X轴的长度 => lngToObject3DX
    // 1纬度对应3D模型坐标Z轴的长度 => latToObject3DZ
    static lngToObject3DX = 93815.009874142068525748445840366;
    static latToObject3DZ = -112249.66656363197477846898570451;
    // 3D模型坐标系的原点对应经纬度
    static origin = { x: 119.92672212218824, z: 32.46281482545325 };

}