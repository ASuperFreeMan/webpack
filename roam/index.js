import { ShowInformationBox } from './showInformationBox';

export class Index {
    constructor(container, urls) {
        this.bustard;
        this.roam;
        this.color;
        this.rotate;
        this.pick;
        this.moudelHide;
        this.container = container;
        this.urls = urls;

        // 定义相机及焦点初始化位置
        this.camera = {
            position: { x: -1692.6964275679534, y: 30, z: 117.58047372102737 },
            target: { x: -1699.8554164102306, y: 20, z: 160.251678000217 }
        };

        this.initModel();

        this.showInformationBox = new ShowInformationBox();
    }

    initModel() {
        let canvas = document.getElementById(this.container);
        this.bustard = new Bustard(canvas);
        this.roam = this.bustard.use(new Bustard.Roam());

        this.moudelHide = this.bustard.use(new Bustard.Hide());
        this.moudelHide.activeClick = false;

        let colorObj = new Bustard.Color({ color: 0x053e00, isMutex: true });
        colorObj.activeClick = false;
        this.color = this.bustard.use(colorObj);

        let drag = this.bustard.use(new Bustard.Drag());
        drag.stopDrag();

        this.rotate = this.bustard.use(new Bustard.Rotate());

        this.pick = this.bustard.use(new Bustard.Pick(v => {
        }));
        const self = this;
        this.pick.pick = function (node, point) {  //单选的节点
            self.showInformationBox.isPipeline(node);
        };
        // 设置camera参数
        this.pick.getCore().initCameraProperty(0.2, undefined, 80);

        let loader = this.bustard.use(new Bustard.Loader({
            position: this.camera.position,
            target: this.camera.target,
            isCameraFix: true
        }));
        if (Object.prototype.toString.call(this.urls) == '[object Array]') {
            console.log(self.urls)
            Promise.all([
                loader.gltfLoadByUrl(self.urls[0], 'well', false).then(value => {
                    console.log(value)
                }),
                loader.gltfLoadByUrl(self.urls[1], 'pipeline', true).then(value => {
                    self.roam.lookAt(self.camera.position, self.camera.target);
                })
            ]);
        } else {
            loader.gltfLoadByUrl(self.urls, 'well').then(value => {

            })
        }
    }

    setSize(width, height) {
        this.roam.getCore().resetSize(width, height);
    }
}
