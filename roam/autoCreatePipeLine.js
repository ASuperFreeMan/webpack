import { ShowInformationBox } from './showInformationBox';
import { HideRoad } from './hideRoads';
<<<<<<< HEAD
import { TrajectoryFreeroam } from './trajectoryfreeroam';
import { PipeNetworkConfig } from './pipeNetworkConfig';
=======
import { TrajectoryFreeroam } from './trajectoryFreeRoam';
>>>>>>> 25e25fb06753a7d1c458ac1308ea49a021aa4564

export class AutoCreatePipeLine {
    constructor(container, pipeUrl, cityUrls, dracoLibUrl, groundUrl, bgImgUrl, x, z, id) {
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
        this.pipeNetworkTemplate = []
        this.pipeline_all = []
        this.well_all = []
        this.pipeUrl = pipeUrl
        this.cityUrls = cityUrls
        this.groundUrl = groundUrl
        this.bgImgUrl = bgImgUrl
        this.dracoLibUrl = dracoLibUrl
        this.renderInterval;
        this.progressBarTimer;
        const self = this;
        this.x = x;
        this.z = z;
        this.id = id;
        this.init();
        this.hideRoad = new HideRoad(this.modelHide, this.textureTool);
        this.trajectoryFreeroam = new TrajectoryFreeroam(this.roam, this.pick);
        this.showInformationBox = new ShowInformationBox();
        this.showInformationBox.setRemoveEvents(function () {
            self.trajectoryFreeroam.removeEvents();
        });
        this.showInformationBox.setAddEvents(function () {
            self.trajectoryFreeroam.addEvents();
        });


    }

    start() {
        this.trajectoryFreeroam.start();
    }

    startByParam(x, z, id) {
        this.trajectoryFreeroam.startByParam(x, z, id);
    }

    //显示管道
    showFlowTo(urlImg) {
        this.hideRoad.showFlowTo(this.pipeline_all, urlImg)
        const self = this;
        this.renderInterval = setInterval(function () {
            self.bustard.core.render()
        }, 20)
    }
    //隐藏管道
    hideFlowTo() {
        for (let i = 0; i < this.pipeline_all.length; i++) {
            this.pipeline_all[i].parent.remove(this.pipeline_all[i])
        }
        this.createPipeModels()
        clearInterval(this.renderInterval)
    }

    getHideRoadObject() {
        return this.hideRoad;
    }

    setSize(width, height) {
        this.roam.getCore().resetSize(width, height);
    }


    getPipelinesData() {
        const self = this;
        $.ajax({
            url: PipeNetworkConfig.GET_PIPES_DATA_URL,
            type: "GET",
            success: function (d) {
                self.pipelines = d.data
            },
            error: function () {
                console.log("管道数据获取失败")
            }
        })
    }

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
        this.bustard.core.addImgToBackground(this.bgImgUrl)
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
        // this.light.addDirectionalLightForCamera("sun", { x: 0, y: 250, z: 0 })

        this.pick = this.bustard.use(new Bustard.Pick());
        const self = this;
        this.pick.pick = function (node, point) {
            console.log(node)
            console.log(point)
            // console.log("相机位置：" + self.roam.curPosition().z + "," + self.roam.curPosition().y + "," + self.roam.curPosition().x);
            // console.log("焦点位置：" + self.roam.curTarget().z + "," + self.roam.curTarget().y + "," + self.roam.curTarget().x);
            self.showInformationBox.isPipeline(self.light, node);

            console.log(self.bustard.core.getNodeByName("boliti-buildingfbx").chilren[2])

        }
        // this.cloneModel();
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

    loadModels() {
        $(PipeNetworkConfig.PROGRESS_BAR_CLASS_NAME).fadeIn()
        this.addProgressBarTimer();
        const self = this;
        Promise.all([
            self.loader.gltfLoadByUrl(self.pipeUrl, PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_PREFIX,
                true).then(value => {
                }),
        ]).then((result) => {
            self.getPipeNetworkTemplate();
            self.roam.lookAt(PipeNetworkConfig.TRANSITION_CAMERA.position, PipeNetworkConfig.TRANSITION_CAMERA.target);
            self.loader.setDraco(self.dracoLibUrl);
            self.loader.gltfLoadByUrl(self.groundUrl, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                value.position.set(0, -0.22, 0)
                self.loader.gltfLoadByUrls(self.cityUrls, PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX, false).then(value => {
                    self.createWellModels();
                    self.createPipeModels();
                    self.hidePipeNetworkTemplate();
                    if (self.x !== undefined && self.z !== undefined && self.id !== undefined) {
                        self.trajectoryFreeroam.startByParam(self.x, self.z, self.id);
                    }
                    clearInterval(this.progressBarTimer);
                    document.getElementById(PipeNetworkConfig.PROGRESS_BAR_FILL_ID).style.width = PipeNetworkConfig.PROGRESS_BAR_WIDTH_MAX;
                    $(PipeNetworkConfig.PROGRESS_BAR_CLASS_NAME).fadeOut();
                })
            })
        });
    }

    getPipeNetworkTemplate() {
        for (let i = 0; i < PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME.length; i++) {
            this.pipeNetworkTemplate[i] = this.bustard.core.getNodeByName(PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME[i])
        }
    }
    hidePipeNetworkTemplate() {
        for (let i = 0; i < PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME.length; i++) {
            this.modelHide.hideById(PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_PREFIX + "|" + PipeNetworkConfig.PIPE_NETWORK_TEMPLATE_NAME[i]);
        }
    }



    createWellModels() {
        this.well_all = []
        for (let i = 0; i < this.wells.length; i++) {
            if (this.wells[i].wellX > -2050 && this.wells[i].wellX < 3400 && this.wells[i].wellZ > -2275 && this.wells[i].wellZ < 2005) {
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
            }
        }
        this.bustard.core.render();
    }
    createPipeModels() {
        this.pipeline_all = []
        for (let i = 0; i < this.pipelines.length; i++) {
            if (this.pipelines[i].pipelineX1 > -2050 && this.pipelines[i].pipelineX1 < 3400 && this.pipelines[i].pipelineZ1 > -2275 && this.pipelines[i].pipelineZ1 < 2005 && this.pipelines[i].diameter >= 400) {
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
            }
        }
        this.bustard.core.render();
    }

}



