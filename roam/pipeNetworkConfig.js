export class PipeNetworkConfig {

    //过渡相机
    static TRANSITION_CAMERA = {
        position: { x: -1692.6964275679534, y: 30, z: 117.58047372102737 },
        target: { x: -1699.8554164102306, y: 20, z: 160.251678000217 }
    };

    //加载时相机所在位置配置信息 
    static LOADER_CAMERA_CONFIG = {
        position: {
            x: -1900,
            y: 200,
            z: 700
        },
        target: {
            x: -280,
            y: 100,
            z: 435
        },
        isCameraFix: true

    };

    //获取（管道/管井）生成数据地址192.168.80.169     192.168.16.231:8099
    static GET_PIPES_DATA_URL = "http://192.168.0.100:8099/api/v1/article/monitor/pipelineModeling";
    static GET_WELLS_DATA_URL = "http://192.168.0.100:8099/api/v1/article/monitor/wellPointModeling";

    //获取（管道/管井）展示数据地址
    static GET_PIPE_PRESENT_DATA_URL = "http://192.168.0.100:8099/api/v1/article/monitor/pipelineId";
    static GET_WELL_PRESENT_DATA_URL = "http://192.168.0.100:8099/api/v1/article/monitor/wellPointId";

    static PROGRESS_BAR_CLASS_NAME = ".loading";
    static PROGRESS_BAR_WIDTH_MAX = '800px'
    static PROGRESS_BAR_FILL_ID = "fill"

    //管网模型模板前缀 
    static PIPE_NETWORK_TEMPLATE_PREFIX = "pipeNetworkTemplate";
    //管网模型模板Name
    static PIPE_NETWORK_TEMPLATE_NAME = [
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

    //建筑模型前缀 
    static ARCHITECTURE_MODEL_PREFIX = "architecture";
    //管前缀
    static PIPE_MODEL_PREFIX = "pipeline"
    //井前缀
    static WELL_MODEL_PREFIX = "well"

    //隐藏/透明路面时需要隐藏的构件名 
    static HIDE_ROAD_MODEL_NAME = [
        // "boliti-CDfbx",
        // "CDfbx",
        // "标线fbx",
        // "标线贴图面fbx",
        "凤凰东路-路牌fbx",
        "青年路-路牌fbx",
        "永晖路-路牌fbx",
        "济川东路-路牌fbx",
        "boliti-CDfbx",
        "CDnewfbx",
        "buzhimingshufbx",
        "treeFBX",
        "liushufbx",
        "banmaxian-0107fbx",
        "boliti-cd-0102fbx"

    ]

    static PIPE_NETWORK_RANGE_X_1 = -2050
    static PIPE_NETWORK_RANGE_X_2 = 3400
    static PIPE_NETWORK_RANGE_Z_1 = -2275
    static PIPE_NETWORK_RANGE_Z_2 = 2005

}
