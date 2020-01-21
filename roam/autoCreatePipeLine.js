import { ShowInformationBox } from './showInformationBox';
import { HideRoad } from './hideRoads';
import { TrajectoryFreeroam } from './trajectoryfreeroam';
import { PipeNetworkConfig } from './pipeNetworkConfig';

export class AutoCreatePipeLine {
    constructor(container, urls, x, z, id) {
        this.container = container;
        this.bustard;
        this.loader;
        this.sprite;
        this.color;
        this.textureTool;
        this.modelHide;
        this.pick;
        this.well;
        this.roam;
        this.light;
        this.transparent
        this.pipeNetworkTemplate = []
        this.pipeline_all = []
        this.well_all = []
        this.pipeTemplateUrl = urls.pipeTemplateUrl
        this.groundUrl = urls.groundUrl
        this.CDAndBXUrl = urls.CDAndBXUrl
        this.BLTUrl = urls.BLTUrl
        this.floorUrl = urls.floorUrl
        this.roadSignsUrl = urls.roadSignsUrl
        this.treeUrl = urls.treeUrl
        this.otherUrl = urls.otherUrl
        this.bgImgUrl1 = urls.bgImgUrl1
        this.bgImgUrl2 = urls.bgImgUrl2
        this.dracoLibUrl = urls.dracoLibUrl
        this.yuanzhutu = urls.yuanzhutu
        this.stationNamePictureUrl = urls.stationNamePictureUrl
        this.pipeline_state = 0
        this.renderInterval;
        this.progressBarTimer;
        const self = this;
        this.x = x;
        this.z = z;
        this.id = id;
        this.init();
        this.hideRoad = new HideRoad(this.modelHide, this.textureTool, this.transparent);
        this.trajectoryFreeroam = new TrajectoryFreeroam(this.roam, this.pick);
        this.showInformationBox = new ShowInformationBox();
        this.showInformationBox.setRemoveEvents(function () {
            self.trajectoryFreeroam.removeEvents();
        });
        this.showInformationBox.setAddEvents(function () {
            self.trajectoryFreeroam.addEvents();
        });

        this.humanPerspectiveInfo = {};


    }

    start() {
        this.trajectoryFreeroam.start();
    }

    startByParam(x, z, id) {
        this.trajectoryFreeroam.startByParam(x, z, id);
    }

    //显示管道流向
    showFlowTo(urlImg1, urlImg2) {
        // this.hideRoad.showFlowTo(this.pipeline_all, urlImg1, urlImg2)
        this.pipeline_state = 1
        for (let i = 0; i < this.pipeline_all.length; i++) {
            if (this.pipeline_all[i].userData.elevationDifference > 0) {
                this.textureTool.addRepetitiveTexture(this.pipeline_all[i], urlImg2, 0.04, 1)
            }
            if (this.pipeline_all[i].userData.elevationDifference < 0) {
                this.textureTool.addRepetitiveTexture(this.pipeline_all[i], urlImg1, -0.04, 1)
            }
            if (this.pipeline_all[i].userData.elevationDifference == 0) {
                this.textureTool.addRepetitiveTexture(this.pipeline_all[i], urlImg1, 0, 1)
            }
        }


        const self = this;
        this.renderInterval = setInterval(function () {
            for (let i = 0; i < self.pipeline_all.length; i++) {
                if (self.pipeline_all[i].userData.elevationDifference > 0) {
                    self.pipeline_all[i].children[0].material.map.offset.x += 0.04
                }
                if (self.pipeline_all[i].userData.elevationDifference < 0) {
                    self.pipeline_all[i].children[0].material.map.offset.x += -0.04
                }
                if (self.pipeline_all[i].userData.elevationDifference == 0) {
                    self.pipeline_all[i].children[0].material.map.offset.x += 0.04
                }
            }
            self.bustard.core.render()
        }, 20)
    }
    //隐藏管道流向
    hideFlowTo() {
        const self = this;
        if (this.pipeline_state == 1) {
            clearInterval(this.renderInterval)
            for (let i = 0; i < this.pipeline_all.length; i++) {
                // console.log(this.pipeline_all[i])
                this.pipeline_all[i].children[0].geometry.dispose()
                this.pipeline_all[i].children[0].material.map.dispose()
                this.pipeline_all[i].children[0].material.dispose()
                this.pipeline_all[i].parent.remove(this.pipeline_all[i])
                self.bustard.core.getScene().remove(this.pipeline_all[i].parent)
            }
            this.createPipeModels()
            this.pipeline_state = 0
        }

    }

    //显示路面
    showRoads() {
        this.hideRoad.restoreRoad();
    }
    //隐藏路面
    hideRoads() {
        this.hideRoad.hideRoad()
    }


    getHideRoadObject() {
        return this.hideRoad;
    }

    setSize(width, height) {
        this.roam.getCore().resetSize(width, height);
    }

    //获取管线数据
    getPipelinesData() {
        const self = this;
        $.ajax({
            url: PipeNetworkConfig.GET_PIPES_DATA_URL,
            type: "GET",
            success: function (d) {
                self.pipelines = d.data
                // console.log(d.data)
            },
            error: function () {
                console.log("管道数据获取失败")
            }
        })
    }
    //获取管井信息
    getWellsData() {
        const self = this;
        $.ajax({
            url: PipeNetworkConfig.GET_WELLS_DATA_URL,
            type: "GET",
            success: function (d) {
                self.wells = d.data
            },
            error: function () {
                console.log("管井数据获取失败！")
            }
        })
    }

    init() {
        this.getPipelinesData();
        this.getWellsData();
        let con = document.getElementById(this.container);
        this.bustard = new Bustard(con);
        this.loader = this.bustard.use(new Bustard.Loader(PipeNetworkConfig.LOADER_CAMERA_CONFIG));
        //加载解压器
        this.loader.setDraco(this.dracoLibUrl);
        this.bustard.core.addImgToBackground(this.bgImgUrl1)
        this.color = this.bustard.use(new Bustard.Color({ isMutex: true }));
        this.color.activeClick = false;
        this.textureTool = this.bustard.use(new Bustard.Texture());
        this.bustard.core.getScene().add(this.bustard.core.getaxesHelper());
        this.roam = this.bustard.use(new Bustard.Roam())
        this.modelHide = this.bustard.use(new Bustard.Hide());
        this.modelHide.activeClick = false;
        this.light = this.bustard.use(new Bustard.Light())
        this.light.activeClick = false;
        this.renderInterval = 0
        this.transparent = this.bustard.use(new Bustard.Transparent())
        this.transparent.activeClick = false
        this.sprite = this.bustard.use(new Bustard.Sprite({
            fontSize: 60,
            borderThickness: 1,
            scale: [50, 50, 50]
        }));
        this.pick = this.bustard.use(new Bustard.Pick());
        const self = this;
        this.pick.pick = function (node, point) {
            console.log(node)
            console.log(point)
            // console.log("相机位置：" + self.roam.curPosition().z + "," + self.roam.curPosition().y + "," + self.roam.curPosition().x);
            // console.log("焦点位置：" + self.roam.curTarget().z + "," + self.roam.curTarget().y + "," + self.roam.curTarget().x);
            self.showInformationBox.isPipeline(self.light, node);
        }

        this.loadModels();
    }

    //进度条定时器
    addProgressBarTimer() {
        let progressBarWidth = 0
        this.progressBarTimer = setInterval(function () {
            progressBarWidth = progressBarWidth + 20
            if (progressBarWidth >= 740) {
                progressBarWidth = 740
            }
            document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = progressBarWidth + 'px';
        }, 13)
    }
    //加载模型
    loadModels() {
        $(PipeNetworkConfig.PROGRESS_BAR_CLASS_NAME).fadeIn()
        // this.addProgressBarTimer();
        const self = this;
        Promise.all([
            //加载管网模板
            self.loader.gltfLoadByUrl(self.pipeTemplateUrl, PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_PREFIX,
                true).then(value => {
                }),
        ]).then((result) => {
            //获取管网模板
            self.getPipeNetworkTemplate();
            //设置过渡相机
            self.roam.lookAt(PipeNetworkConfig.TRANSITION_CAMERA.position, PipeNetworkConfig.TRANSITION_CAMERA.target);
            //加载路牌
            self.loader.gltfLoadByUrls(self.roadSignsUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = "80px";
                //加载地面
                self.loader.gltfLoadByUrl(self.groundUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                    //压低地面
                    value.position.set(0, -0.22, 0)
                    document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = "160px";
                    //加载cd和标线
                    self.loader.gltfLoadByUrls(self.CDAndBXUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                        //加载玻璃体
                        self.loader.gltfLoadByUrl(self.BLTUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                            document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = "320px";
                            console.log(value)
                            // console.log(value.children[0].children[0])
                            value.children[0].children[0].children[2].material.transparent = true
                            value.children[0].children[0].children[2].material.opacity = 0.9
                            value.children[0].children[0].children[3].material.transparent = true
                            value.children[0].children[0].children[3].material.opacity = 0.9
                            value.children[0].children[0].children[4].material.transparent = true
                            value.children[0].children[0].children[4].material.opacity = 0.9
                            value.children[0].children[0].children[5].material.transparent = true
                            value.children[0].children[0].children[5].material.opacity = 0.9
                            value.children[0].children[1].children[2].material.transparent = true
                            value.children[0].children[1].children[2].material.opacity = 0.9
                            value.children[0].children[2].children[2].material.transparent = true
                            value.children[0].children[2].children[2].material.opacity = 0.9
                            // value.children[0].children[2].children[3].material.transparent = true
                            // value.children[0].children[2].children[3].material.opacity = 0.9
                            // value.children[0].children[3].children[2].material.transparent = true
                            // value.children[0].children[3].children[2].material.opacity = 0.9
                            // self.color.setMeshColor(value.children[0].children[0].children[2], 0xaaa7a7)
                            // self.color.setMeshColor(value.children[0].children[0].children[3], 0xaaa7a7)
                            // self.color.setMeshColor(value.children[0].children[0].children[4], 0x6e6e6e)

                            //加载建筑
                            self.loader.gltfLoadByUrls(self.floorUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                                document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = "600px";
                                //加载其他（树）
                                self.loader.gltfLoadByUrls(self.otherUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                                    //创建管网
                                    // self.createWellModels();
                                    // self.createPipeModels();
                                    // // //隐藏管网模板
                                    // self.hidePipeNetworkTemplate();
                                    //移动相机到巡检起始位置
                                    if (self.x !== undefined && self.z !== undefined && self.id !== undefined) {
                                        self.trajectoryFreeroam.startByParam(self.x, self.z, self.id);
                                    }
                                    //清除进度条
                                    // clearInterval(self.progressBarTimer);
                                    document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = PipeNetworkConfig.PROGRESS_BAR_WIDTH_MAX;
                                    $(PipeNetworkConfig.PROGRESS_BAR_CLASS_NAME).fadeOut();
                                    // self.addGateway()
                                    // self.addStationNameCanvas()

                                })

                            })

                        })

                    })

                })

            })

        });
    }

    //切换全景相机
    togglePanoramicCameraControl() {
        this.bustard.core.removeAllListenerEventsFromCameraControls();
        this.bustard.core.addListenerEventsFromCameraControls();
    }
    //切换巡检相机
    toggleInspectionCameraControl() {
        this.bustard.core.removeAllListenerEventsFromCameraControls();
        this.bustard.core.addAllListenerEventsFromCameraControls();
        // this.bustard.core.setCameraValues(3500);
    }


    //进入全景视角
    togglePanoramicPerspective() {
        // 保存行人巡检视角信息
        this.humanPerspectiveInfo = {
            theta: this.trajectoryFreeroam.theta,
            // 记录有没有到岔路口
            changeFlag: this.trajectoryFreeroam.changeFlag,
            // 记录有没有在岔路口旋转
            atForkRoadRotateFlag: this.trajectoryFreeroam.atForkRoadRotateFlag,
            // 记录当前朝向
            moveDirection: this.trajectoryFreeroam.moveDirection,
            // 记录接下来要走的点
            nextCoordsCode: this.trajectoryFreeroam.nextCoordsCode,
            // 相机最近经过的点
            cameraJustPassedCoord: this.trajectoryFreeroam.cameraJustPassedCoord,
            // 镜头刚旋转时相机及焦点的位置
            oldPosition: this.trajectoryFreeroam.oldPosition,
            oldTarget: this.trajectoryFreeroam.oldTarget,
            // 记录之前相机状态
            oldState: this.trajectoryFreeroam.oldState,
            camera: {
                position: { x: this.roam.curPosition().x, y: this.roam.curPosition().y, z: this.roam.curPosition().z },
                target: { x: this.roam.curTarget().x, y: this.roam.curTarget().y, z: this.roam.curTarget().z }
            }
        }
        this.trajectoryFreeroam.removeEvents();

        this.togglePanoramicBackground();
        this.togglePanoramicCameraControl();
    }

    //切换巡检视角
    toggleInspectionPerspective() {
        // 读取行人巡检视角信息
        this.trajectoryFreeroam.theta = this.humanPerspectiveInfo.theta;
        this.trajectoryFreeroam.changeFlag = this.humanPerspectiveInfo.changeFlag;
        this.trajectoryFreeroam.atForkRoadRotateFlag = this.humanPerspectiveInfo.atForkRoadRotateFlag;
        this.trajectoryFreeroam.moveDirection = this.humanPerspectiveInfo.moveDirection;
        this.trajectoryFreeroam.nextCoordsCode = this.humanPerspectiveInfo.nextCoordsCode;
        this.trajectoryFreeroam.cameraJustPassedCoord = this.humanPerspectiveInfo.cameraJustPassedCoord;
        this.trajectoryFreeroam.oldPosition = this.humanPerspectiveInfo.oldPosition;
        this.trajectoryFreeroam.oldTarget = this.humanPerspectiveInfo.oldTarget;
        this.trajectoryFreeroam.oldState = this.humanPerspectiveInfo.oldState;

        this.toggleInspectionBackground();
        this.toggleInspectionCameraControl();
        this.roam.lookAt(this.humanPerspectiveInfo.camera.position, this.humanPerspectiveInfo.camera.target);
        this.bustard.core.removeAllListenerEventsFromCameraControls();
        this.trajectoryFreeroam.addEvents();

    }

    restoreInspectionPerspectiveConfig() {
        this.toggleInspectionBackground();
        this.toggleInspectionCameraControl();
    }

    //切换成全景背景
    togglePanoramicBackground() {
        this.bustard.core.addImgToBackground(this.bgImgUrl2)
        this.bustard.core.render();
    }
    //切换成巡检背景
    toggleInspectionBackground() {
        this.bustard.core.addImgToBackground(this.bgImgUrl1)
        this.bustard.core.render();
    }

    //获取管网模板
    getPipeNetworkTemplate() {
        for (let i = 0; i < PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME.length; i++) {
            this.pipeNetworkTemplate[i] = this.bustard.core.getNodeByName(PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME[i])
        }
    }
    //隐藏管网模板
    hidePipeNetworkTemplate() {
        for (let i = 0; i < PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME.length; i++) {
            this.modelHide.hideById(PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_PREFIX + "|" + PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME[i]);
        }
    }



    //创建管井
    createWellModels() {
        this.well_all = []
        for (let i = 0; i < this.wells.length; i++) {
            // if (this.wells[i].wellX > PipeNetworkConfig.PIPE_NETWORK_RANGE_X_1 && this.wells[i].wellX < PipeNetworkConfig.PIPE_NETWORK_RANGE_X_2 && this.wells[i].wellZ > PipeNetworkConfig.PIPE_NETWORK_RANGE_Z_1 && this.wells[i].wellZ < PipeNetworkConfig.PIPE_NETWORK_RANGE_Z_2) {
            let cloneModel = this.pipeNetworkTemplate[0].clone();
            cloneModel.name = this.wells[i].wellId
            cloneModel.userData.modelName = PipeNetworkConfig.WELL_MODEL_PREFIX
            cloneModel.userData.uniqId = this.wells[i].wellId
            cloneModel.position.x = this.wells[i].wellX
            cloneModel.position.y = -0.1
            cloneModel.position.z = this.wells[i].wellZ
            cloneModel.scale.set(1, 1, 1);
            cloneModel.visible = true
            this.well_all.push(cloneModel)
            this.bustard.core.getScene().add(cloneModel)
            // }
        }
        this.bustard.core.render();
    }
    //创建管线
    createPipeModels() {
        this.pipeline_all = []
        for (let i = 0; i < this.pipelines.length; i++) {
            // if (this.pipelines[i].pipelineX1 > PipeNetworkConfig.PIPE_NETWORK_RANGE_X_1 && this.pipelines[i].pipelineX1 < PipeNetworkConfig.PIPE_NETWORK_RANGE_X_2 && this.pipelines[i].pipelineZ1 > PipeNetworkConfig.PIPE_NETWORK_RANGE_Z_1 && this.pipelines[i].pipelineZ1 < PipeNetworkConfig.PIPE_NETWORK_RANGE_Z_2) {
            let cloneModel;
            if (this.pipelines[i].material === 'PE') {
                cloneModel = this.pipeNetworkTemplate[2].clone()
            } else if (this.pipelines[i].material === 'PVC') {
                cloneModel = this.pipeNetworkTemplate[3].clone()
            } else if (this.pipelines[i].material === '塑料') {
                cloneModel = this.pipeNetworkTemplate[4].clone()
            } else if (this.pipelines[i].material === '砼') {
                cloneModel = this.pipeNetworkTemplate[5].clone()
            } else if (this.pipelines[i].material === "玻璃钢") {
                cloneModel = this.pipeNetworkTemplate[6].clone()
            } else if (this.pipelines[i].material === '球墨铸铁') {
                cloneModel = this.pipeNetworkTemplate[7].clone()
            } else if (this.pipelines[i].material === '钢') {
                cloneModel = this.pipeNetworkTemplate[8].clone()
            } else if (this.pipelines[i].material === '铸铁') {
                cloneModel = this.pipeNetworkTemplate[9].clone()
            } else {
                cloneModel = this.pipeNetworkTemplate[1].clone()
            }
            let x1 = this.pipelines[i].pipelineX1;
            let y1 = 0;
            let z1 = this.pipelines[i].pipelineZ1;
            let x2 = this.pipelines[i].pipelineX2;
            let y2 = 0;
            let z2 = this.pipelines[i].pipelineZ2;
            let startElevation = this.pipelines[i].startElevation;
            let endElevation = this.pipelines[i].endElevation;
            let elevationDifference = startElevation - endElevation
            cloneModel.userData.elevationDifference = elevationDifference
            let radian = Math.atan(Math.abs(z2 - z1) / Math.abs(x2 - x1));
            let long = Math.sqrt((z2 - z1) * (z2 - z1) + (x2 - x1) * (x2 - x1));
            cloneModel.name = this.pipelines[i].pipelineId;
            cloneModel.userData.modelName = PipeNetworkConfig.PIPE_MODEL_PREFIX
            cloneModel.userData.uniqId = this.pipelines[i].pipelineId;
            if (z2 - z1 < 0 && x2 - x1 > 0) {
                cloneModel.position.x = x1 + Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z1 - Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, -radian)
            }
            if (z2 - z1 > 0 && x2 - x1 < 0) {
                cloneModel.position.x = x1 - Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z1 + Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, -radian);
            }
            if (z2 - z1 < 0 && x2 - x1 < 0) {
                cloneModel.position.x = x2 + Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z2 + Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, radian);
            }
            if (z2 - z1 === 0 && x2 - x1 < 0) {
                cloneModel.position.x = x1 - Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z1 + Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, radian);
            }
            if (z2 - z1 < 0 && x2 - x1 === 0) {
                cloneModel.position.x = x1 + Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z1 - Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, radian);
            }
            if (z2 - z1 >= 0 && x2 - x1 >= 0) {
                cloneModel.position.x = x1 + Math.abs(x2 - x1) / 2;
                cloneModel.position.z = z1 + Math.abs(z2 - z1) / 2;
                cloneModel.rotation.set(Math.PI / 2, 0, radian)
            }
            cloneModel.position.y = -2.8 + 0.1
            if (this.pipelines[i].diameter === 0) {
                cloneModel.scale.set(long / 10, 5, 5);
            } else {
                cloneModel.scale.set(long / 10, this.pipelines[i].diameter / 100, this.pipelines[i].diameter / 100);
            }
            cloneModel.visible = true
            this.pipeline_all.push(cloneModel)
            this.bustard.core.getScene().add(cloneModel);
            // }
        }
        this.bustard.core.render();
    }







    //控制地面透明度
    adjustRoadTransparency(transparency) {
        if (transparency == 0) {
            this.hideRoad.hideRoad()
        } else {
            this.hideRoad.restoreRoad()
            for (let i = 0; i < PipeNetworkConfig.HIDE_ROAD_MODEL_NAME.length; i++) {
                this.hideRoad.adjustRoadTransparency(PipeNetworkConfig.HIDE_ROAD_MODEL_NAME[i], transparency)
            }
        }
        this.bustard.core.render()
    }

    //添加光体
    addGateway() {
        for (let i = 0; i < PipeNetworkConfig.STATION_POSITION.length; i++) {
            this.bustard.core.addGateway(PipeNetworkConfig.STATION_POSITION[i].stationPosition, this.yuanzhutu[PipeNetworkConfig.STATION_POSITION[i].color], PipeNetworkConfig.STATION_COLOR[PipeNetworkConfig.STATION_POSITION[i].color])
        }

    }

    //添加泵站名画布
    addStationNameCanvas() {
        for (let i = 0; i < PipeNetworkConfig.STATION_POSITION.length; i++) {
            this.bustard.core.addPictureSprite({ x: PipeNetworkConfig.STATION_POSITION[i].stationPosition.x, y: 200, z: PipeNetworkConfig.STATION_POSITION[i].stationPosition.z }, this.stationNamePictureUrl[PipeNetworkConfig.STATION_POSITION[i].stationName], [188, 40, 100])
        }
    }

}


