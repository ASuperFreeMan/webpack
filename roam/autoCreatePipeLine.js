import { ShowInformationBox } from './showInformationBox';

export class AutoCreatePipeLine {
    constructor(container, urls, urls2, dracoLibUrl, url3, bgImgUrl) {
        this.container = container;
        this.bustard;
        this.loader;
        this.loader2;
        this.sprite;
        this.color;
        this.textureTool;
        this.modelHide;
        this.pick;
        this.well;
        this.roam;
        this.light;
        this.pipeline_PE
        this.pipeline_PVC
        this.pipeline_Plastic //塑料
        this.pipeline_Concrete //砼
        this.pipeline_FRP //玻璃钢
        this.pipeline_DuctileIron //球墨铸铁
        this.pipeline_Steel//钢
        this.pipeline_Iron//铸铁
        this.pipelines;
        this.wells;
        this.pipeline_all = []
        this.urls = urls
        this.urls2 = urls2
        this.url3 = url3
        this.bgImgUrl = bgImgUrl
        this.dracoLibUrl = dracoLibUrl
        this.showInformationBox = new ShowInformationBox();

        this.camera = {
            position: { x: -1692.6964275679534, y: 30, z: 117.58047372102737 },
            target: { x: -1699.8554164102306, y: 20, z: 160.251678000217 }
        };
        this.camera1 = {
            position: { x: -1500, y: 30, z: 650 },
            target: { x: -230, y: 30, z: 800 }
        };

    }

    getPipelineDatas() {
        const self = this;
        $.ajax({
            // url: "http://192.168.0.43:8099/api/v1/article/monitor/pipelineModeling",
            // url:"http://192.168.0.43:8099/api/v1/article/monitor/pipelineModeling",
            url: "http://277jd48643.wicp.vip/api/v1/article/monitor/pipelineModeling",
            type: "GET",
            success: function (d) {
                self.pipelines = d.data
                let time = new Date();
                let newdate = time.toLocaleString('chinese', { hour12: false });
                console.log("获取p" + newdate)
            },
            error: function () {
                alert("获取失败！")
                console.log("line数据获取失败")
            }
        })
    }

    getWellDatas() {
        const self = this;
        $.ajax({
            // url: "http://192.168.0.43:8099/api/v1/article/monitor/wellPointModeling",
            // url:"http://192.168.0.43:8099/api/v1/article/monitor/wellPointModeling",
            url: "http://277jd48643.wicp.vip/api/v1/article/monitor/wellPointModeling",
            type: "GET",
            success: function (d) {
                self.wells = d.data
                let time = new Date();
                let newdate = time.toLocaleString('chinese', { hour12: false });
                console.log("获取w" + newdate)
            },
            error: function () {
                alert("获取失败！")
                console.log("well数据获取失败")
            }
        })
    }

    init(callback, x, z, id) {
        this.getPipelineDatas();
        this.getWellDatas();
        let con = document.getElementById(this.container);
        this.bustard = new Bustard(con);
        this.loader = this.bustard.use(new Bustard.Loader());
        this.bustard.core.addImgToBackground(this.bgImgUrl)
        this.color = this.bustard.use(new Bustard.Color({ isMutex: true }));
        this.color.activeClick = false;
        this.textureTool = this.bustard.use(new Bustard.Texture());
        this.bustard.core.getScene().add(this.bustard.core.getaxesHelper());
        this.roam = this.bustard.use(new Bustard.Roam())
        this.modelHide = this.bustard.use(new Bustard.Hide());
        this.modelHide.activeClick = false;
        // this.light = this.bustard.use(new Bustard.Light())
        // this.light.activeClick = false;
        // this.light.addDirectionalLightForCamera("sun", { x: 0, y: 250, z: 0 })

        const self = this;
        Promise.all([
            //球铸铁
            self.loader.gltfLoadByUrl(self.urls[0], 'pipeline', false).then(value => {
                value.children[0].name = "carboniron"
            }),
            //玻璃钢
            self.loader.gltfLoadByUrl(self.urls[1], 'pipeline', false).then(value => {
                value.children[0].name = "glasssteel"
            }),
            //铁
            self.loader.gltfLoadByUrl(self.urls[2], 'pipeline', false).then(value => {
                value.children[0].name = "iron"
            }),
            //PE
            self.loader.gltfLoadByUrl(self.urls[3], 'pipeline', false).then(value => {
                value.children[0].name = "PE"
            }),
            //钢
            self.loader.gltfLoadByUrl(self.urls[4], 'pipeline', false).then(value => {
                value.children[0].name = "steel"
            }),
            //砼
            self.loader.gltfLoadByUrl(self.urls[5], 'pipeline', false).then(value => {
                value.children[0].name = "concrete"
            }),
            //塑料
            self.loader.gltfLoadByUrl(self.urls[6], 'pipeline', false).then(value => {
                value.children[0].name = "plastic"
            }),
            //PVC
            self.loader.gltfLoadByUrl(self.urls[7], 'pipeline', false).then(value => {
                value.children[0].name = "PVC"
            }),
            self.loader.gltfLoadByUrl(self.urls[8], 'pipeline', false).then(value => {
                value.children[0].name = "well"
            })
        ]).then((result) => {

            self.getmodel();
            self.roam.lookAt(self.camera.position, self.camera.target);
            self.loader.setDraco(self.dracoLibUrl);
            let time1 = new Date();
            let newdate1 = time1.toLocaleString('chinese', { hour12: false });
            console.log("加载城市" + newdate1)
            self.loader.gltfLoadByUrl(self.url3, "dimian", false).then(value => {
                value.position.set(0, -0.22, 0)
            })
            this.loader.gltfLoadByUrls(self.urls2, 'floor', true).then(value => {
                // self.roam.lookAt(self.camera1.position, self.camera1.target);
                self.cloneModel();
                self.hideModel();
                if (callback !== undefined) {
                    callback(x, z, id);
                }

            })
            let time2 = new Date();
            let newdate2 = time2.toLocaleString('chinese', { hour12: false });
            console.log("加载城市结束" + newdate2)
        });



        this.pick = this.bustard.use(new Bustard.Pick());
        this.pick.pick = function (node, point) {
            console.log(node)
            self.showInformationBox.isPipeline(node);
            // console.log("相机位置：" + self.roam.curPosition().z + "," + self.roam.curPosition().x);
            // console.log("焦点位置：" + self.roam.curTarget().z + "," + self.roam.curTarget().x);
        }
        // this.cloneModel();
    }

    showPipeline() {
        // this.getmodel();
        this.cloneModel();
        this.getPipelineDatas();
    }

    getmodel() {
        this.pipeline_PE = this.bustard.core.getNodeByName('PE');//PE
        this.pipeline_PVC = this.bustard.core.getNodeByName('PVC');//PVC
        this.pipeline_Plastic = this.bustard.core.getNodeByName('plastic');  //塑料
        this.pipeline_Concrete = this.bustard.core.getNodeByName('concrete'); //砼
        this.pipeline_FRP = this.bustard.core.getNodeByName('glasssteel'); //玻璃钢
        this.pipeline_DuctileIron = this.bustard.core.getNodeByName('carboniron'); //球铸铁
        this.pipeline_Steel = this.bustard.core.getNodeByName('steel'); //钢
        this.pipeline_Iron = this.bustard.core.getNodeByName('iron'); //铸铁
        this.well = this.bustard.core.getNodeByName('well');


    }
    hideModel() {
        this.modelHide.hideById("pipeline|steel");
        this.modelHide.hideById("pipeline|glasssteel");
        this.modelHide.hideById("pipeline|carboniron");
        this.modelHide.hideById("pipeline|iron");
        this.modelHide.hideById("pipeline|PE");
        this.modelHide.hideById("pipeline|PVC");
        this.modelHide.hideById("pipeline|plastic");
        this.modelHide.hideById("pipeline|concrete");
        this.modelHide.hideById("pipeline|9848_");
    }

    cloneModel() {
        for (let i = 0; i < this.wells.length; i++) {
            if (this.wells[i].wellX > -2000 && this.wells[i].wellX < 1800 && this.wells[i].wellZ > 400 && this.wells[i].wellZ < 1300) {
                let cloneModel = this.well.clone();
                cloneModel.name = this.wells[i].wellId
                cloneModel.userData.modelName = 'well'
                cloneModel.userData.uniqId = this.wells[i].wellId
                cloneModel.position.x = this.wells[i].wellX
                cloneModel.position.y = -0.1
                cloneModel.position.z = this.wells[i].wellZ
                cloneModel.scale.set(1, 1, 1);
                this.bustard.core.getScene().add(cloneModel)
            }
        }


        for (let i = 0; i < this.pipelines.length; i++) {
            if (this.pipelines[i].pipelineX1 > -2000 && this.pipelines[i].pipelineX1 < 1800 && this.pipelines[i].pipelineZ1 > 400 && this.pipelines[i].pipelineZ1 < 1300) {
                let cloneModel;
                if (this.pipelines[i].material === 'PE') {
                    cloneModel = this.pipeline_PE.clone()
                } else if (this.pipelines[i].material === 'PVC') {
                    cloneModel = this.pipeline_PVC.clone()
                } else if (this.pipelines[i].material === '塑料') {
                    cloneModel = this.pipeline_Plastic.clone()
                } else if (this.pipelines[i].material === '砼') {
                    cloneModel = this.pipeline_Concrete.clone()
                } else if (this.pipelines[i].material === "玻璃钢") {
                    cloneModel = this.pipeline_FRP.clone()
                } else if (this.pipelines[i].material === '球墨铸铁') {
                    cloneModel = this.pipeline_DuctileIron.clone()
                } else if (this.pipelines[i].material === '钢') {
                    cloneModel = this.pipeline_Steel.clone()
                } else if (this.pipelines[i].material === '铸铁') {
                    cloneModel = this.pipeline_Iron.clone()
                } else {
                    cloneModel = this.pipeline_Plastic.clone()
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
                cloneModel.userData.modelName = 'pipeline'
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
                this.pipeline_all.push(cloneModel)
                this.bustard.core.getScene().add(cloneModel);
            }

        }

        this.bustard.core.render();
    }
}



