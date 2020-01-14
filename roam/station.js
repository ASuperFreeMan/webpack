export var bustard
export var loader
export var sprite
export var pick
export var color
export var textureTool
export var modelHide
export var FlowImgUrl1
export var FlowImgUrl2
export var datas
export var NEW_DATA
export var renderInterval
export var stationName
export var STATION_MODEL_ALL
export var showFlowPipe = []
export var sprites = []
export var bengzhan = {

    //春兰
    chunlanStation: {
        qiang: [
            {
                start: 2,
                end: 11
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 19

            },
            {
                name: "污水泵2",
                index: 20
            },
            {
                name: "污水泵3",
                index: 21
            },
            {
                name: "污水泵4",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 53,
                index2: 35,
                index3: 55,
                index4: 54,
                index5: 56
            },
            {
                index1: 57,
                index2: 34,
                index3: 58,
                index4: 59,
                index5: 60
            },
            {
                index1: 61,
                index2: 36,
                index3: 62,
                index4: 63,
                index5: 64
            },
            {
                index1: 65,
                index2: 37,
                index3: 66,
                index4: 67,
                index5: 68
            }
        ],
        mainPipelineIndex: [
            69
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 31
            },
            {
                name: "捞渣机2",
                index: 29
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 39
            },
            {
                name: "传送带2",
                index: 38
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 28
            },
            {
                name: "启闭机2",
                index: 27
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 30
            },
        ]
    },

    //三号小区
    districtthreeStation: {
        qiang: [
            {
                start: 1,
                end: 9
            }
        ],
        controlBox: [
            {
                start: 25,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 0
            },
            {
                name: "污水泵2",
                index: 1
            }
        ],
        pipeNodeNames: [
            {
                index1: 19,
                index2: 17,
                index3: 20,
                index4: 18,
                index5: 24
            },
            {
                index1: 19,
                index2: 16,
                index3: 19,
                index4: 21,
                index5: 23
            }
        ],
        mainPipelineIndex: [
            22
        ],
        laozhaji: [

        ],
        qibiji: [

        ],
        lajichuansongji: [

        ]
    },

    //东风
    eastwindStation: {
        qiang: [
            {
                start: 1,
                end: 9
            }
        ],
        controlBox: [
            {
                start: 31,
                end: 33
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 0
            },
            {
                name: "污水泵2",
                index: 1
            },
            {
                name: "污水泵3",
                index: 2
            }
        ],
        pipeNodeNames: [
            {
                index1: 20,
                index2: 19,
                index3: 25,
                index4: 23,
                index5: 30
            },
            {
                index1: 20,
                index2: 18,
                index3: 24,
                index4: 26,
                index5: 28
            },
            {
                index1: 20,
                index2: 20,
                index3: 21,
                index4: 22,
                index5: 29
            }
        ],
        mainPipelineIndex: [
            27
        ],
        laozhaji: [

        ],
        qibiji: [

        ],
        lajichuansongji: [

        ]
    },

    //鼓楼
    gulouStation: {
        qiang: [
            {
                start: 2,
                end: 11
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 19

            },
            {
                name: "污水泵2",
                index: 20
            },
            {
                name: "污水泵3",
                index: 21
            },
            {
                name: "污水泵4",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 53,
                index2: 35,
                index3: 55,
                index4: 54,
                index5: 56
            },
            {
                index1: 57,
                index2: 34,
                index3: 58,
                index4: 59,
                index5: 60
            },
            {
                index1: 61,
                index2: 36,
                index3: 62,
                index4: 63,
                index5: 64
            },
            {
                index1: 65,
                index2: 37,
                index3: 66,
                index4: 67,
                index5: 68
            }
        ],
        mainPipelineIndex: [
            69
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 31
            },
            {
                name: "捞渣机2",
                index: 29
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 39
            },
            {
                name: "传送带2",
                index: 38
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 28
            },
            {
                name: "启闭机2",
                index: 27
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 30
            },
        ]
    },

    //济川
    jichuanStation: {
        qiang: [
            {
                start: 2,
                end: 14
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 19

            },
            {
                name: "污水泵2",
                index: 20
            },
            {
                name: "污水泵3",
                index: 21
            },
            {
                name: "污水泵4",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 53,
                index2: 37,
                index3: 55,
                index4: 54,
                index5: 56
            },
            {
                index1: 57,
                index2: 36,
                index3: 58,
                index4: 59,
                index5: 60
            },
            {
                index1: 61,
                index2: 38,
                index3: 62,
                index4: 63,
                index5: 64
            },
            {
                index1: 65,
                index2: 39,
                index3: 66,
                index4: 67,
                index5: 68
            }
        ],
        mainPipelineIndex: [
            69
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 33
            },
            {
                name: "捞渣机1",
                index: 31
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 41
            },
            {
                name: "传送带2",
                index: 40
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 28
            },
            {
                name: "启闭机2",
                index: 29
            },
            {
                name: "启闭机3",
                index: 30
            },
            {
                name: "启闭机4",
                index: 27
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 32
            },
        ]
    },

    //新区
    newdistrictStation: {
        qiang: [
            {
                start: 2,
                end: 14
            }
        ],
        controlBox: [
            {
                start: 22,
                end: 25
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 18

            },
            {
                name: "污水泵2",
                index: 19
            },
            {
                name: "污水泵3",
                index: 20
            },
            {
                name: "污水泵4",
                index: 21
            }
        ],
        pipeNodeNames: [
            {
                index1: 50,
                index2: 31,
                index3: 52,
                index4: 51,
                index5: 53
            },
            {
                index1: 54,
                index2: 30,
                index3: 55,
                index4: 56,
                index5: 57
            },
            {
                index1: 58,
                index2: 32,
                index3: 59,
                index4: 60,
                index5: 61
            },
            {
                index1: 62,
                index2: 33,
                index3: 63,
                index4: 64,
                index5: 65
            }
        ],
        mainPipelineIndex: [
            66
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 26
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 34
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 47
            },
            {
                name: "启闭机2",
                index: 48
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 27
            }
        ]
    },

    //泰山公园
    parkStation: {
        qiang: [
            {
                start: 2,
                end: 11
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 19

            },
            {
                name: "污水泵2",
                index: 20
            },
            {
                name: "污水泵3",
                index: 21
            },
            {
                name: "污水泵4",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 53,
                index2: 35,
                index3: 55,
                index4: 54,
                index5: 56
            },
            {
                index1: 57,
                index2: 34,
                index3: 58,
                index4: 59,
                index5: 60
            },
            {
                index1: 61,
                index2: 36,
                index3: 62,
                index4: 63,
                index5: 64
            },
            {
                index1: 65,
                index2: 37,
                index3: 66,
                index4: 67,
                index5: 68
            }
        ],
        mainPipelineIndex: [
            69
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 31
            },
            {
                name: "捞渣机2",
                index: 29
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 39
            },
            {
                name: "传送带2",
                index: 38
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 28
            },
            {
                name: "启闭机2",
                index: 27
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 30
            },
        ]
    },

    //人民路三栋
    peopleStation: {
        qiang: [
            {
                start: 1,
                end: 9
            }
        ],
        controlBox: [
            {
                start: 25,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 0
            },
            {
                name: "污水泵2",
                index: 1
            }
        ],
        pipeNodeNames: [
            {
                index1: 19,
                index2: 17,
                index3: 20,
                index4: 18,
                index5: 24
            },
            {
                index1: 19,
                index2: 16,
                index3: 19,
                index4: 21,
                index5: 23
            }
        ],
        mainPipelineIndex: [
            22
        ],
        laozhaji: [

        ],
        qibiji: [

        ],
        lajichuansongji: [

        ]
    },

    //凤凰河
    pheonixStation: {
        qiang: [
            {
                start: 2,
                end: 11
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 27
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 18

            },
            {
                name: "污水泵2",
                index: 19
            },
            {
                name: "污水泵3",
                index: 20
            },
            {
                name: "污水泵4",
                index: 21
            },
            {
                name: "污水泵5",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 58,
                index2: 36,
                index3: 60,
                index4: 59,
                index5: 61
            },
            {
                index1: 62,
                index2: 35,
                index3: 63,
                index4: 64,
                index5: 65
            },
            {
                index1: 66,
                index2: 37,
                index3: 67,
                index4: 68,
                index5: 69
            },
            {
                index1: 70,
                index2: 38,
                index3: 71,
                index4: 72,
                index5: 73
            },
            {
                index1: 75,
                index2: 39,
                index3: 76,
                index4: 77,
                index5: 78
            }
        ],
        mainPipelineIndex: [
            74
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 32
            },
            {
                name: "捞渣机1",
                index: 30
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 41
            },
            {
                name: "传送带2",
                index: 40
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 29
            },
            {
                name: "启闭机2",
                index: 28
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 31
            },
        ]
    },

    //西湖翠苑
    xihucuiyuanStation: {
        qiang: [
            {
                start: 1,
                end: 9
            }
        ],
        controlBox: [
            {
                start: 25,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 0
            },
            {
                name: "污水泵2",
                index: 1
            }
        ],
        pipeNodeNames: [
            {
                index1: 19,
                index2: 17,
                index3: 20,
                index4: 18,
                index5: 24
            },
            {
                index1: 19,
                index2: 16,
                index3: 19,
                index4: 21,
                index5: 23
            }
        ],
        mainPipelineIndex: [
            22
        ],
        laozhaji: [

        ],
        qibiji: [

        ],
        lajichuansongji: [

        ]
    },

    //朝阳河
    zhaoyangriverStation: {
        qiang: [
            {
                start: 1,
                end: 9
            }
        ],
        controlBox: [
            {
                start: 25,
                end: 26
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 0
            },
            {
                name: "污水泵2",
                index: 1
            }
        ],
        pipeNodeNames: [
            {
                index1: 19,
                index2: 17,
                index3: 20,
                index4: 18,
                index5: 24
            },
            {
                index1: 19,
                index2: 16,
                index3: 19,
                index4: 21,
                index5: 23
            }
        ],
        mainPipelineIndex: [
            22
        ],
        laozhaji: [

        ],
        qibiji: [

        ],
        lajichuansongji: [

        ]
    },

    //周山
    zhoushanriverStation: {
        qiang: [
            {
                start: 2,
                end: 11
            }
        ],
        controlBox: [
            {
                start: 23,
                end: 27
            }
        ],
        wushuibeng: [
            {
                name: "污水泵1",
                index: 18

            },
            {
                name: "污水泵2",
                index: 19
            },
            {
                name: "污水泵3",
                index: 20
            },
            {
                name: "污水泵4",
                index: 21
            },
            {
                name: "污水泵5",
                index: 22
            }
        ],
        pipeNodeNames: [
            {
                index1: 58,
                index2: 36,
                index3: 60,
                index4: 59,
                index5: 61
            },
            {
                index1: 62,
                index2: 35,
                index3: 63,
                index4: 64,
                index5: 65
            },
            {
                index1: 66,
                index2: 37,
                index3: 67,
                index4: 68,
                index5: 69
            },
            {
                index1: 70,
                index2: 38,
                index3: 71,
                index4: 72,
                index5: 73
            },
            {
                index1: 75,
                index2: 39,
                index3: 76,
                index4: 77,
                index5: 78
            }
        ],
        mainPipelineIndex: [
            74
        ],
        laozhaji: [
            {
                name: "捞渣机1",
                index: 32
            },
            {
                name: "捞渣机1",
                index: 30
            }
        ],
        chuansongdai: [
            {
                name: "传送带1",
                index: 41
            },
            {
                name: "传送带2",
                index: 40
            }
        ],
        qibiji: [
            {
                name: "启闭机1",
                index: 29
            },
            {
                name: "启闭机2",
                index: 28
            }
        ],
        lajichuansongji: [
            {
                name: "垃圾传送机1",
                index: 31
            },
        ]
    }

}


export function initWithConfig(StationName, glburl, imgUrl1, imgUrl2, bgUrl, data, dracoUrl) {
    analyticalData(StationName, glburl, imgUrl1, imgUrl2, bgUrl, data, dracoUrl);
}

export function init(glburl, bgUrl, dracoUrl) {
    var sss = document.getElementById('station');
    bustard = new Bustard(sss);
    bustard.core.addImgToBackground(bgUrl)
    var roam = bustard.use(new Bustard.Roam())
    loader = bustard.use(new Bustard.Loader());
    loader.setDraco(dracoUrl)
    var transparent = bustard.use(new Bustard.Transparent())
    transparent.activeClick = false
    sprite = bustard.use(new Bustard.Sprite({
        fontSize: 20,
        borderThickness: 5,
        scale: [1, 1, 1]
    }));
    color = bustard.use(new Bustard.Color({ isMutex: true }));
    color.activeClick = false;
    textureTool = bustard.use(new Bustard.Texture());
    Promise.all([
        loader.gltfLoadByUrl(glburl, 'station').then(value => {
            // console.log(value)
            STATION_MODEL_ALL = value.children[0].children
            // console.log(STATION_MODEL_ALL)
            // console.log(stationName)
            if (stationName == "districtthreeStation" || stationName == "peopleStation" || stationName == "zhaoyangriverStation" || stationName == "xihucuiyuanStation" || stationName == "eastwindStation") {
                roam.lookAt(
                    {
                        x: -9,
                        y: 6.8,
                        z: 12.8
                    },
                    {
                        x: 4.3,
                        y: 2.6,
                        z: 1.35
                    });
            } else {
                roam.lookAt(
                    {
                        x: -2.9,
                        y: 12.5,
                        z: 25
                    },
                    {
                        x: 0,
                        y: -1.3,
                        z: 1.7
                    });
            }
            if (stationName != "districtthreeStation" && stationName != "peopleStation" && stationName != "zhaoyangriverStation" && stationName != "xihucuiyuanStation" && stationName != "eastwindStation") {
                //主管线
                showFlowPipe.push(STATION_MODEL_ALL[bengzhan[stationName].mainPipelineIndex])
                //控制箱颜色
                for (let i = bengzhan[stationName].controlBox[0].start; i < bengzhan[stationName].controlBox[0].end; i++) {
                    for (let j = 0; j <= 2; j++) {
                        color.setMeshColor(STATION_MODEL_ALL[i].children[j], 0x858590)
                    }
                }
            }
            loadData();
        })
    ]);
    modelHide = bustard.use(new Bustard.Hide());
    modelHide.activeClick = false;
    pick = bustard.use(new Bustard.Pick());
    pick.pick = function (node, point) {
        console.log(node)
        // console.log("相机位置：" + roam.curPosition().z + "," + roam.curPosition().y + "," + roam.curPosition().x);
        // console.log("焦点位置：" + roam.curTarget().z + "," + roam.curTarget().y + "," + roam.curTarget().x);
        // modelHide.hideById(node.userData.uniqId)
        // color.setColorById("station|1116_",0xFF0000)
    }
}

export function analyticalData(StationName, glburl, imgUrl1, imgUrl2, bgUrl, data, dracoUrl) {
    FlowImgUrl1 = imgUrl1;
    FlowImgUrl2 = imgUrl2;
    datas = data;
    stationName = StationName;
    init(glburl, bgUrl, dracoUrl);
}

export function loadData() {
    loadEquipmentState();
    loadPumpDate();
    addFlow();
}



export function loadEquipmentState() {
    setEquipmentState(datas)
}

export function setEquipmentState(quipmentState) {
    if (stationName == "districtthreeStation" || stationName == "peopleStation" || stationName == "zhaoyangriverStation" || stationName == "xihucuiyuanStation" || stationName == "eastwindStation") {
        if (bengzhan[stationName].wushuibeng.length > 0) {
            for (let i = 0; i < bengzhan[stationName].wushuibeng.length; i++) {
                changeEquipmentState(STATION_MODEL_ALL[bengzhan[stationName].wushuibeng[i].index], quipmentState.wushuibeng[i].state)
            }
        }
    } else {
        // 污水泵
        if (bengzhan[stationName].wushuibeng.length > 0) {
            for (let i = 0; i < bengzhan[stationName].wushuibeng.length; i++) {
                changeEquipmentState(STATION_MODEL_ALL[bengzhan[stationName].wushuibeng[i].index], quipmentState.wushuibeng[i].state)
            }
        }
    }
    if (bengzhan[stationName].laozhaji.length > 0) {
        for (let i = 0; i < bengzhan[stationName].laozhaji.length; i++) {
            changeEquipmentState(STATION_MODEL_ALL[bengzhan[stationName].laozhaji[i].index], quipmentState.laozhaji[i].state)
        }
    }
    if (bengzhan[stationName].qibiji.length > 0) {
        for (let i = 0; i < bengzhan[stationName].qibiji.length; i++) {
            changeEquipmentState(STATION_MODEL_ALL[bengzhan[stationName].qibiji[i].index], quipmentState.qibiji[i].state)
        }
    }
    if (bengzhan[stationName].lajichuansongji.length > 0) {
        for (let i = 0; i < bengzhan[stationName].lajichuansongji.length; i++) {
            changeEquipmentState(STATION_MODEL_ALL[bengzhan[stationName].lajichuansongji[i].index], quipmentState.lajichuansongji[i].state)
        }
    }


}

export function changeEquipmentState(mesh, state) {
    if (state === 0) {
        color.setMeshColor(mesh, 0x008000)
    }
    if (state === 1) {
        color.setMeshColor(mesh, 0x808080)
    }
    if (state === 2) {
        color.setMeshColor(mesh, 0xFF0000)
    }
}




export function loadPumpDate() {
    loadPump(datas);
}

export function loadPump(pumData) {
    if (bengzhan[stationName].wushuibeng.length > 0) {
        for (let i = 0; i < bengzhan[stationName].wushuibeng.length; i++) {
            let pum = STATION_MODEL_ALL[bengzhan[stationName].wushuibeng[i].index]
            if (pumData.wushuibeng[i].state === 0) {
                // sprite.addText(datas.wushuibeng[i].data, [pum.position.x, (pum.position.y + 1), pum.position.z])
                var s = sprite.addCanvas(addPumpCanvas(pumData.wushuibeng[i].data), [pum.position.x, (pum.position.y + 2), pum.position.z], function (canvas, pos) {
                    // init();
                });
                sprites.push(s)
            }
        }
    }
}



export function addPumpCanvas(data) {
    let canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 400
    // canvas.textAlign = 'center'
    canvas.setAttribute('cursor', 'pointer');
    let ctx = canvas.getContext("2d");
    // ctx.textAlign = 'center'
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(25,25,112,0.8)';
    ctx.fillStyle = 'rgba(25,25,112,0.8)';
    ctx.beginPath();
    ctx.fillRect(0, 0, 300, 200);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "80px Cambria";
    ctx.fillText(data, 40, 125);
    ctx.fillText("A", 200, 125);
    return canvas;
}




export function addFlow() {
    addLZJFlowTo(datas)
    addFlowTo(datas)

}

export function addFlowTo(flowData) {
    if (stationName != "districtthreeStation" && stationName != "peopleStation" && stationName != "zhaoyangriverStation" && stationName != "xihucuiyuanStation" && stationName != "eastwindStation") {
        if (bengzhan[stationName].wushuibeng.length > 0) {
            for (let i = 0; i < bengzhan[stationName].wushuibeng.length; i++) {
                if (flowData.wushuibeng[i].state == 0) {
                    showFlowPipe.push(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index1])
                    color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index2], 0x91B5F9)
                } else {
                    // color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index1], 0x808080)
                    color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index2], 0x808080)
                    // color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index3], 0x808080)
                    // color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index4], 0x808080)
                    // color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[i].index5], 0x808080)
                }
            }
        }
    } else {
        if (bengzhan[stationName].wushuibeng.length > 0) {
            let x = 0;
            for (let i = 0; i < bengzhan[stationName].wushuibeng.length; i++) {
                if (flowData.wushuibeng[i].state == 0) {
                    x += 1;
                }
            }
            if (x == 0) {
                color.setMeshColor(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[1].index1], 0x808080)
            } else {
                showFlowPipe.push(STATION_MODEL_ALL[bengzhan[stationName].pipeNodeNames[1].index1])
            }
        }
    }

    renderInterval = setInterval(render, 20)
}



export function addLZJFlowTo(flowData) {
    if (bengzhan[stationName].laozhaji.length > 0) {
        for (let i = 0; i < bengzhan[stationName].laozhaji.length; i++) {
            if (flowData.laozhaji[i].state == 0) {
                let chuansongdai = STATION_MODEL_ALL[bengzhan[stationName].chuansongdai[i].index]
                textureTool.addRepetitiveTextureOnMesh(chuansongdai, FlowImgUrl2, 0.01, -2)
            }
        }
    }
}


export function render() {
    for (let i = 0; i < showFlowPipe.length; i++) {
        showFlowPipe[i].material.map.offset.y -= 0.02
    }
    pick.getCore().render()
}

//更新数据
export function upData(newdata) {
    if (newdata == null) {
        console.log("未传入新数据")
    } else {
        NEW_DATA = newdata
        updataPumData();
    }
}

export function updataPumData() {
    for (let i = 0; i < sprites.length; i++) {
        sprites[i].geometry.dispose()
        sprites[i].material.dispose()
        sprites[i].material.map.dispose()
        bustard.core.getScene().remove(sprites[i])
    }
    sprites = []
    loadPump(NEW_DATA)
    setEquipmentState(NEW_DATA)
    clearInterval(renderInterval)
    showFlowPipe = [];
    if (stationName != "districtthreeStation" && stationName != "peopleStation" && stationName != "zhaoyangriverStation" && stationName != "xihucuiyuanStation" && stationName != "eastwindStation") {
        showFlowPipe.push(STATION_MODEL_ALL[bengzhan[stationName].mainPipelineIndex])
    }
    addFlowTo(NEW_DATA)

}


//销毁
export function destroyPumpStation() {
    document.getElementById('station').innerHTML = "";
    clearInterval(renderInterval)
}