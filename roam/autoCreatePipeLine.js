import { ShowInformationBox } from './showInformationBox';

export class AutoCreatePipeLine {
    constructor(container, urls, urls2, dracoLibUrl) {
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
        this.pipeline_PE
        this.pipeline_PVC
        this.pipeline_Plastic //塑料
        this.pipeline_Concrete //砼
        this.pipeline_FRP //玻璃钢
        this.pipeline_DuctileIron //球墨铸铁
        this.pipeline_Steel//钢
        this.pipeline_Iron//铸铁
        this.pipelines
        this.wells
        this.pipeline_all = []
        this.urls = urls
        this.urls2 = urls2
        this.dracoLibUrl = dracoLibUrl
        this.showInformationBox = new ShowInformationBox();

        this.camera = {
            position: { x: -1692.6964275679534, y: 30, z: 117.58047372102737 },
            target: { x: -1699.8554164102306, y: 20, z: 160.251678000217 }
        };

        this.init();
    }

    getPipelineDatas() {
        const self = this;
        $.ajax({
            url: "http://192.168.0.43:8099/api/v1/article/monitor/pipelineModeling",
            // url:"http://192.168.0.43:8099/api/v1/article/monitor/pipelineModeling",
            type: "GET",
            success: function (d) {
                self.pipelines = d.data

                $.ajax({
                    url: "http://192.168.0.43:8099/api/v1/article/monitor/wellPointModeling",
                    // url:"http://192.168.0.43:8099/api/v1/article/monitor/wellPointModeling",
                    type: "GET",
                    success: function (d) {
                        self.wells = d.data
                        self.showPipeline();
                    },
                    error: function () {
                        alert("获取失败！")
                        console.log("well数据获取失败")
                    }
                })
            },
            error: function () {
                alert("获取失败！")
                console.log("line数据获取失败")
            }
        })
    }

    init() {
        this.getPipelineDatas();
        let con = document.getElementById(this.container);
        this.bustard = new Bustard(con);
        this.loader = this.bustard.use(new Bustard.Loader());
        this.color = this.bustard.use(new Bustard.Color({ isMutex: true }));
        this.color.activeClick = false;
        this.textureTool = this.bustard.use(new Bustard.Texture());
        this.bustard.core.getScene().add(this.bustard.core.getaxesHelper());
        this.roam = this.bustard.use(new Bustard.Roam())
        // this.light = this.bustard.use(new Bustard.Light())
        // this.light.addPointLightForScene("sun", { x: 0, y: 100, z: 0 }, 2, 0, 2)

        const self = this;
        Promise.all([
            //球铸铁
            self.loader.gltfLoadByUrl(this.urls[0], 'pipeline', false).then(value => {
                value.children[0].name = "carboniron"
            }),
            //玻璃钢
            self.loader.gltfLoadByUrl(this.urls[1], 'pipeline', false).then(value => {
                value.children[0].name = "glasssteel"
            }),
            //铁
            self.loader.gltfLoadByUrl(this.urls[2], 'pipeline', false).then(value => {
                value.children[0].name = "iron"
            }),
            //PE
            self.loader.gltfLoadByUrl(this.urls[3], 'pipeline', false).then(value => {
                value.children[0].name = "PE"
            }),
            //钢
            self.loader.gltfLoadByUrl(this.urls[4], 'pipeline', false).then(value => {
                value.children[0].name = "steel"
            }),
            //砼
            self.loader.gltfLoadByUrl(this.urls[5], 'pipeline', false).then(value => {
                value.children[0].name = "concrete"
            }),
            //塑料
            self.loader.gltfLoadByUrl(this.urls[6], 'pipeline', false).then(value => {
                value.children[0].name = "plastic"
            }),
            //PVC
            self.loader.gltfLoadByUrl(this.urls[7], 'pipeline', false).then(value => {
                value.children[0].name = "PVC"
            }),
            self.loader.gltfLoadByUrl(this.urls[8], 'pipeline', false).then(value => {
                value.children[0].name = "well"
            }),
        ]).then((result) => {
            self.roam.lookAt(self.camera.position, self.camera.target);
        });
        this.loader.setDraco(this.dracoLibUrl);
        this.loader.gltfLoadByUrls(this.urls2, 'floor', true).then(value => {
        })

        this.modelHide = this.bustard.use(new Bustard.Hide());
        this.modelHide.activeClick = false;
        this.pick = this.bustard.use(new Bustard.Pick());
        this.pick.pick = function (node, point) {
            console.log(node)
            self.showInformationBox.isPipeline(node);
        }
    }

    showPipeline() {
        this.getmodel();
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

    cloneModel() {

        for (let i = 0; i < this.wells.length; i++) {
            if (this.wells[i].wellX > -2000 && this.wells[i].wellX < 1800 && this.wells[i].wellZ > 400 && this.wells[i].wellZ < 1300) {
                let cloneModel = this.well.clone();
                cloneModel.name = this.wells[i].wellId
                cloneModel.userData.modelName = 'well'
                cloneModel.userData.uniqId = this.wells[i].wellId
                cloneModel.position.x = this.wells[i].wellX
                cloneModel.position.y = 0.1
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
        this.modelHide.hideById("pipeline|well");
        this.modelHide.hideById("pipeline|steel");
        this.modelHide.hideById("pipeline|glasssteel");
        this.modelHide.hideById("pipeline|carboniron");
        this.modelHide.hideById("pipeline|iron");
        this.modelHide.hideById("pipeline|PE");
        this.modelHide.hideById("pipeline|PVC");
        this.modelHide.hideById("pipeline|plastic");
        this.modelHide.hideById("pipeline|concrete");
        this.bustard.core.render();
        console.log(this.pipeline_all)
    }
}



