export class AutoCreatePipelineConfig {

    //过渡相机位置
    static transitionCamera = {
        position: { x: -1692.6964275679534, y: 30, z: 117.58047372102737 },
        target: { x: -1699.8554164102306, y: 20, z: 160.251678000217 }
    };

    //加载时相机所在位置配置信息
    static loaderCameraConfig = {
        position: {
            x: -1900,
            y: 100,
            z: 700
        },
        target: {
            x: -280,
            y: 100,
            z: 435
        },
        isCameraFix: true
    };

    //获取（管道/管井）生成数据地址
    static getPipesDataUrl = "http://277jd48643.wicp.vip/api/v1/article/monitor/pipelineModeling";
    static getWellsDataUrl = "http://277jd48643.wicp.vip/api/v1/article/monitor/wellPointModeling";

    //获取（管道/管井）展示数据地址
    static getPipePresentDataUrl = "http://277jd48643.wicp.vip/api/v1/article/monitor/pipelineId";
    static getWellPresentDataUrl = "http://277jd48643.wicp.vip/api/v1/article/monitor/wellPointId";

    //进度条div class名
    static ProgressBarClassName = ".loading";

    //管网模型模板前缀
    static pipeNetworkTemplatePrefix = "pipeNetworkTemplate";
    //管网模型模板Name
    static pipeNetworkTemplateName = [
        "11328_",   //管井
        "11409_",   //默认      哑黄色
        "1404_",    //PE        亮黄
        "1231_",    //PVC       湖蓝
        "1058_",    //塑料      蓝色
        "885_",     //砼        紫红
        "712_",     //玻璃钢    紫色
        "539_",     //球铸铁    褐色
        "365_",     //钢        红
        "164_"      //铸铁      绿
    ]
}
