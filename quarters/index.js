
export class Index {
    constructor(container, urls, url) {
        this.bustard;
        this.roam;
        this.color;
        this.rotate;
        this.pick;
        this.moudelHide;
        this.light;
        this.container = container;
        this.urls = urls;
        this.url = url;

        // 定义相机及焦点初始化位置
        this.camera = {
            // position: { x: -77.9075810564545, y: -0.006797499134809685, z: 244.57739355723584 },
            // target: { x: -80.76982326736032, y: 0.6598728103408894, z: 136.82859859677515 }
            position: { x: 3.245405091319081, y: 1.7, z: -4.3388145296923755 },
            target: { x: 3.2270589831147216, y: 1, z: -3.08530244824404 }
        };

        this.initModel();

    }

    initModel() {
        let canvas = document.getElementById(this.container);
        this.bustard = new Bustard(canvas, false);
        this.roam = this.bustard.use(new Bustard.Roam());

        this.moudelHide = this.bustard.use(new Bustard.Hide());
        this.moudelHide.activeClick = false;

        let colorObj = new Bustard.Color({ color: 0x053e00, isMutex: true });
        colorObj.activeClick = false;
        this.color = this.bustard.use(colorObj);

        let drag = this.bustard.use(new Bustard.Drag());
        drag.stopDrag();

        let mark = this.bustard.use(new Bustard.Mark());
        mark.multiple = true;

        this.light = this.bustard.use(new Bustard.Light());
        this.light.activeClick = false;

        this.rotate = this.bustard.use(new Bustard.Rotate());

        this.pick = this.bustard.use(new Bustard.Pick(v => {
        }));
        const self = this;
        this.pick.pick = function (node, point) {  //单选的节点
            console.log(point)
        };
        // 设置camera参数
        // this.pick.getCore().initCameraProperty(0.1, 3000, 50);

        let loader = this.bustard.use(new Bustard.Loader({
            position: self.camera.position,
            target: self.camera.target,
            isCameraFix: true
        }));

        let mask = layer.load(2, {
            shade: [0.2, '#000000']
        });

        loader.setDraco(this.url);
        if (Object.prototype.toString.call(this.urls) == '[object Array]') {
            loader.gltfLoadByUrls(self.urls, 'zc').then(data => {
                console.log(data);
                layer.close(mask);
                self.light.adjustLight(1);
            })
        } else {
            loader.gltfLoadByUrl(self.urls, '').then(data => {
                console.log(data);
            })
        }
    }

    setSize(width, height) {
        this.roam.getCore().resetSize(width, height);
    }
}
