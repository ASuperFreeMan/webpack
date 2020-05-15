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

    static url = 'http://192.168.0.99:8099';
    //获取（管道/管井）生成数据地址192.168.80.169     192.168.16.231:8099
    static GET_PIPES_DATA_URL = this.url + "/api/v1/article/monitor/pipelineModeling";
    static GET_WELLS_DATA_URL = this.url + "/api/v1/article/monitor/wellPointModeling";

    //获取（管道/管井）展示数据地址
    static GET_PIPE_PRESENT_DATA_URL = this.url + "/api/v1/article/monitor/pipelineId";
    static GET_WELL_PRESENT_DATA_URL = this.url + "/api/v1/article/monitor/wellPointId";

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
        "CDnewfbx",
        // "buzhimingshufbx",
        // "treeFBX",
        // "liushufbx",
        "banmaxian-0107fbx",
        "boliti-cd-0109fbx",
        "luyuanshifbx"
    ]

    static PIPE_NETWORK_RANGE_X_1 = -2050
    static PIPE_NETWORK_RANGE_X_2 = 3400
    static PIPE_NETWORK_RANGE_Z_1 = -2275
    static PIPE_NETWORK_RANGE_Z_2 = 2005

    static STATION_POSITION = [
        {
            stationName: "RenMin",
            color: 0,
            stationPosition: { x: -1787.9607257436792, y: 75, z: -4236.427947830261 }
        },
        {
            stationName: "TaiShanGongYuan",
            color: 0,
            stationPosition: { x: -2742.6544656473216, y: 75, z: -3486.9014014182544 }
        },
        {
            stationName: "YingChun",
            color: 0,
            stationPosition: { x: 2699.940494212081, y: 75, z: -2974.2462103892994 }
        },
        {
            stationName: "GuLou",
            color: 0,
            stationPosition: { x: -1176.636103865347, y: 75, z: -1846.079592932775 }
        },
        {
            stationName: "JiChuan",
            color: 0,
            stationPosition: { x: -1560.5278113928214, y: 75, z: -1383.680998681536 }
        },
        {
            stationName: "SanHaoXiaoQu",
            color: 0,
            stationPosition: { x: -1602.2071011764083, y: 75, z: 193.56669420341794 }
        },
        {
            stationName: "XinQu",
            color: 0,
            stationPosition: { x: -202.52473040953586, y: 75, z: 269.2925547429185 }
        },
        {
            stationName: "Dongfeng",
            color: 0,
            stationPosition: { x: 367.7044039985151, y: 75, z: 765.2904133619832 }
        },
        {
            stationName: "Zhaoyang",
            color: 0,
            stationPosition: { x: -2093.2241745192614, y: 75, z: 1847.3345229827714 }
        },
        {
            stationName: "XiHuCuiYuan",
            color: 0,
            stationPosition: { x: -2120.571204334343, y: 75, z: 2017.6790888057435 }
        },
        {
            stationName: "Fenghuang",
            color: 0,
            stationPosition: { x: -50.344081915137664, y: 75, z: 2189.650665446006 }
        },
        {
            stationName: "ZhouShan",
            color: 0,
            stationPosition: { x: -216.3955423759502, y: 75, z: 3165.177110268197 }
        },
        {
            stationName: "ChunLanNan",
            color: 0,
            stationPosition: { x: 1899.6609995980739, y: 75, z: 3142.3321326097353 }
        },
        {
            stationName: "HuaiHe",
            color: 0,
            stationPosition: { x: 630.7209000223139, y: 75, z: 4136.589559715723 }
        },
        {
            stationName: "WuShuiChuLiChang",
            color: 1,
            stationPosition: { x: 2091.1627430316075, y: 75, z: -1475.4429082922213 }
        }
    ]

    static STATION_COLOR = ["#0028a9", "#04d3cd"]
}
