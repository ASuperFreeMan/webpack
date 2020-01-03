import { MapConfiguration } from './mapConfiguration';

export class MapControls {

    constructor(cesiumContainer) {

        this.viewer = new Cesium.Viewer(cesiumContainer, {
            geocoder: false, //是否显示地名查找控件
            homeButton: false, //是否显示Home按钮
            sceneModePicker: false, //是否显示投影方式控件
            baseLayerPicker: false, //是否显示图层选择控件
            navigationHelpButton: false, //是否显示帮助信息控件

            animation: false,
            timeline: false, //是否显示时间线控件
            fullscreenButton: false, //是否显示全屏按钮

            scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
            infoBox: false, //隐藏点击要素后的提示信息

            selectionIndicator: false // 关闭点击绿色框
        });

        //隐藏版权信息
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        // 相机近地面距离
        this.nearDistance = MapConfiguration.nearDistance;
        // 相机远地面距离
        this.farDistance = MapConfiguration.farDistance;
        // 开始位置
        this.startPosition = MapConfiguration.startPosition;
        // 默认泰州位置
        this.defaultPosition = { x: this.startPosition.x, y: this.startPosition.y, z: this.farDistance };
        // 图标实体集合
        this.markEntities = [];
        // 高亮路线对象
        this.polylineDataSource;
        // 管线图标集合
        this.pipelineMarkEntities = [];
        // 发光图片集合
        this.lightImgEntities = [];

        // 正常路线宽度
        this.normalLineWidth = MapConfiguration.normalLineWidth;
        // 高亮路线宽度
        this.highLineWidth = MapConfiguration.highLineWidth;
        // 记录上一个nameID
        this.oldHighLineNameID;

        // 左击事件
        this.leftClickHandler;

        this.init();

        // 取消拖动事件
        // this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        // 取消滚轮事件
        // this.viewer.scene.screenSpaceCameraController.enableZoom = false;
        // 取消双击默认效果
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    }

    // 取消拖动
    removeDrag() {
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
    }

    // 取消滚动
    removeWheel() {
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    }

    // 添加拖动
    addDrag() {
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    }

    // 添加滚动
    addWheel() {
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
    }

    // 左键点击事件
    setLeftClickAction(callback) {
        if (this.leftClickHandler !== undefined) {
            this.leftClickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        this.leftClickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        const self = this;
        this.leftClickHandler.setInputAction(function (click) {
            //获取地形表面的经纬度高程坐标
            // let ray = self.viewer.camera.getPickRay(click.position);
            // let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
            // let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
            // let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
            // let cartographic = self.viewer.camera.positionCartographic;
            // let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
            // let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
            // console.log(lng + "," + lat)

            // 获取模型表面的经纬度高程坐标
            let pick = self.viewer.scene.pick(click.position);
            if (pick !== undefined && pick.id._name == "mark" && !pick.id._id.startsWith("pipe_line") && !pick.id._id.startsWith("light")) {
                let cartesian = new Cesium.Cartesian3(pick.id._position._value.x, pick.id._position._value.y, pick.id._position._value.z);
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                // console.log(lng + ", " + lat)
                self.flyTo(lng, lat, self.nearDistance, undefined, undefined, "near");
                if (callback !== undefined) {
                    let id = pick.id._id;
                    callback(id);
                }
            }

            let nameId;
            if (pick !== undefined && pick.id._id.startsWith('light')) {
                nameId = pick.id._id.substring(pick.id._id.indexOf('_') + 1);
            } else if (pick !== undefined && pick.id.nameID !== undefined) {
                nameId = pick.id.nameID;
            }

            if (callback !== undefined && nameId !== undefined && nameId <= MapConfiguration.lineMaxId) {
                // 1经度对应3D模型坐标X轴的长度 => lngToObject3DX
                // 1纬度对应3D模型坐标Z轴的长度 => latToObject3DZ
                const lngToObject3DX = MapConfiguration.lngToObject3DX, latToObject3DZ = MapConfiguration.latToObject3DZ;
                // 3D模型坐标系的原点对应经纬度
                const origin = MapConfiguration.origin;
                // 获取鼠标点击位置经纬度
                let ray = self.viewer.camera.getPickRay(click.position);
                let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                // console.log("经度：" + lng + ", 纬度： " + lat)
                // 将经纬度转换成3D模型坐标
                let x = lngToObject3DX * (lng - origin.x);
                let z = latToObject3DZ * (lat - origin.z);
                let param = "x=" + x + "&z=" + z + "&id=" + nameId;
                callback(param);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    // hover事件
    setMouseHoverAction() {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        const self = this;
        handler.setInputAction(function (movement) {
            let pickedFeature = self.viewer.scene.pick(movement.endPosition);
            if (pickedFeature !== undefined) {
                let nameId;
                if (pickedFeature.id.nameID !== undefined) {
                    nameId = pickedFeature.id.nameID;
                } else if (pickedFeature.id._id.startsWith('light')) {
                    nameId = pickedFeature.id._id.substring(pickedFeature.id._id.indexOf('_') + 1);
                }
                if (nameId <= MapConfiguration.lineMaxId) {
                    self.changeHighLightLineStateByNameID(nameId);
                }
            } else {
                self.changeHighLightLineStateByNameID();
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    // 初始化配置
    init() {
        this.setMouseHoverAction();
    }

    // 销毁配置
    destroy() {

    }

    // 设置管网感知主视角
    setPipeNetworkPerceptionMainView() {
        this.flyTo(this.startPosition.x, this.startPosition.y, this.farDistance);
        this.setDefaultPosition(this.startPosition.x, this.startPosition.y);
    }

    // 设置泵站监控主视角
    setPumpStationMonitoringMainView() {
        this.flyTo(this.startPosition.x, this.startPosition.y, this.farDistance);
        this.setDefaultPosition(this.startPosition.x, this.startPosition.y);
    }

    // 设置自由巡检主视角
    setFreeRoamMainView() {
        this.flyTo(MapConfiguration.freeRoamMainView.lng, MapConfiguration.freeRoamMainView.lat, this.farDistance);
        this.setDefaultPosition(MapConfiguration.freeRoamMainView.lng, MapConfiguration.freeRoamMainView.lat);
    }

    // 设置默认位置
    setDefaultPosition(lng, lat) {
        this.defaultPosition.x = lng;
        this.defaultPosition.y = lat;
    }

    // 相机飞行到泰州市海陵区默认位置
    earthRolling(isVisible) {
        const self = this;
        if (isVisible) {
            let cartographic = self.viewer.camera.positionCartographic;
            let height = cartographic.height;
            self.setDefaultPosition(this.startPosition.x, this.startPosition.y);
            self.flyTo(self.defaultPosition.x, self.defaultPosition.y, height, function () {
                self.flyTo(self.defaultPosition.x, self.defaultPosition.y, self.defaultPosition.z, function () {
                    self.flyTo(self.defaultPosition.x, self.defaultPosition.y, self.defaultPosition.z, function () {
                        setTimeout(function () {
                            self.showAllMarks();
                        }, MapConfiguration.waitTimeForShowIcon);
                    })
                }, MapConfiguration.flightTime);
            });
        } else {
            self.flyTo(self.defaultPosition.x, self.defaultPosition.y, self.defaultPosition.z);
        }
    }

    // 设置地图
    setMap(url, layers) {
        // 移除所有影像图层
        this.viewer.imageryLayers.removeAll();
        // let imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
        //     url: url,
        //     tilingScheme: new Cesium.WebMercatorTilingScheme(),
        //     maximumLevel: 20
        // });

        let imageryProvider = new Cesium.WebMapServiceImageryProvider({
            url: url,
            layers: layers,
            crs: "EPSG:3785",
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            parameters: {
                service: 'WMS',
                format: 'image/jpeg',
                transparent: true,
            }
        });

        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    }

    // 飞行到指定位置
    flyTo(lng, lat, height, callback, duration, distanceState) {
        let cartographic = this.viewer.camera.positionCartographic;
        // 偏差值
        let deviation;
        if (distanceState == "near") {
            deviation = lat - MapConfiguration.nearDistanceDeviation;
        } else if (distanceState == "normal") {
            deviation = lat;
        } else {
            deviation = lat - MapConfiguration.farDistanceDeviation;
        }
        // 相机据地面高度超一定高度时，镜头垂直于地面飞行
        if (cartographic.height > MapConfiguration.cameraTiltMaxHight) {
            const self = this;
            self.viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
                orientation: {
                    heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                    pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
                    roll: 0.0                             // default value
                },
                duration: duration,
                complete: function () {
                    if (callback !== undefined) {
                        callback();
                    }
                }
            });
        } else {
            this.viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
                orientation: {
                    heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                    pitch: Cesium.Math.toRadians(MapConfiguration.cameraTiltDegree),
                    roll: 0.0                            // default value
                },
                duration: duration,
                complete: function () {
                    if (callback !== undefined) {
                        callback();
                    }
                }
            });
        }
    }

    // 设置相机位置
    setView(lng, lat, height, distance) {
        // 偏差值
        let deviation = lat - MapConfiguration.farDistanceDeviation;
        const self = this;
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(MapConfiguration.cameraTiltDegree),
                roll: 0.0                             // default value
            },
            complete: function () {
                if (distance !== undefined) {
                    this.viewer.scene.camera.moveBackward(distance);
                }
                self.setDefaultPosition(lng, lat);
            }
        });
    }

    // 添加一个图标
    addMark(id, position, label, billboard) {
        let entity = this.viewer.entities.add({
            id: id,
            name: "mark",
            position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
            label: label !== undefined ? {
                text: label.text,
                font: label.font !== undefined ? label.font : '15px monospace 黑体',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                showBackground: true,
                backgroundPadding: label.backgroundPadding !== undefined ? new Cesium.Cartesian2(label.backgroundPadding.x, label.backgroundPadding.y) : new Cesium.Cartesian2(7, 5),
                backgroundColor: label.backgroundColor !== undefined ? Cesium.Color.fromCssColorString(label.backgroundColor.color).withAlpha(label.backgroundColor.alpha) : Cesium.Color.BLACK,
                fillColor: label.fillColor !== undefined ? Cesium.Color.fromCssColorString(label.fillColor.color).withAlpha(label.fillColor.alpha) : Cesium.Color.WHITE,
                outlineColor: label.outlineColor !== undefined ? Cesium.Color.fromCssColorString(label.outlineColor.color).withAlpha(label.outlineColor.alpha) : Cesium.Color.WHITE,
                outlineWidth: label.outlineWidth !== undefined ? label.outlineWidth : 0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(label.pixelOffset.offSetX, label.pixelOffset.offSetY),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfiguration.cameraTiltMaxHight),
            } : {},
            billboard: billboard !== undefined ? {
                image: billboard.uri,
                width: billboard.width !== undefined ? billboard.width : 700,
                height: billboard.height !== undefined ? billboard.height : 500,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfiguration.cameraTiltMaxHight),
            } : {}
        });
        entity.show = false;
        if (id.startsWith("pipe_line")) {
            this.pipelineMarkEntities.push(entity);
        } else if (id.startsWith("light")) {
            this.lightImgEntities.push(entity);
        } else {
            this.markEntities.push(entity);
        }

    }

    // 批量添加图标
    addMarkList(markData) {
        if (Object.prototype.toString.call(markData) == '[object Array]') {
            for (let i in markData) {
                let mark = markData[i];
                this.addMark(mark.id, mark.position, mark.label, mark.billboard);
            }
        }
    }

    // 展示所有图标
    showAllMarks() {
        for (let i = 0; i < this.markEntities.length; i++) {
            this.markEntities[i].show = true;
        }
    }

    // 隐藏所有图标
    hideAllMarks() {
        for (let i = 0; i < this.markEntities.length; i++) {
            this.markEntities[i].show = false;
        }
    }

    // 通过id移除图标
    removeMarkById(id) {
        for (var i = 0; i < this.markEntities.length; i++) {
            if (this.markEntities[i].id == id) {
                this.viewer.entities.remove(this.markEntities[i]);
                break;
            }
        }
        this.markEntities.splice(i, 1);
    }

    // 移除所有图标
    removeAllMark() {
        for (var i = 0; i < this.markEntities.length; i++) {
            this.viewer.entities.remove(this.markEntities[i]);
        }
        this.markEntities = [];
    }

    // 添加高亮路线
    addHighlightRoute(url, iconUrl, lightImgUrl) {
        let geojsonOptions = {
            clampToGround: true
        };
        // 从geojson文件加载管线
        let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
        const self = this;
        neighborhoodsPromise.then(function (dataSource) {
            self.viewer.dataSources.add(dataSource);
            self.polylineDataSource = dataSource;
            let entities = dataSource.entities.values;

            for (let i = 0; i < entities.length; i++) {
                let r = entities[i];
                r.show = false;
                r.nameID = i;   //给每条线添加一个编号，方便之后对线修改样式
                if (i <= MapConfiguration.lineMaxId) {
                    r.polyline.width = self.normalLineWidth;
                    r.polyline.material = Cesium.Color.fromCssColorString("#FFAE00");
                } else {
                    r.polyline.width = 0;
                    r.polyline.material = Cesium.Color.fromCssColorString("#DCDCDC");
                }
                r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfiguration.cameraTiltMaxHight);
                // 设置这个属性让多边形贴地，ClassificationType.CESIUM_3D_TILE 是贴模型，ClassificationType.BOTH是贴模型和贴地
                // entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN; // 这个配置会引起不知名异常，接下来的代码不执行
            }
        });

        if (Object.prototype.toString.call(iconUrl) == '[object Array]') {
            let positions = MapConfiguration.pipeLineIconPositions;
            for (let i = 0; i < iconUrl.length; i++) {
                this.addMark("pipe_line" + i, positions[i], undefined, {
                    uri: iconUrl[i],
                    width: MapConfiguration.pipeLineIconWidth,
                    height: MapConfiguration.pipeLineIconHeight
                })
            }
        }

        if (Object.prototype.toString.call(lightImgUrl) == '[object Array]') {
            let positions = MapConfiguration.lightImgPositions;
            let lightImgSizes = MapConfiguration.lightImgSizes;
            for (let i = 0; i < positions.length; i++) {
                this.addMark("light_" + i, positions[i], undefined, {
                    uri: lightImgUrl[i],
                    width: lightImgSizes[i].width,
                    height: lightImgSizes[i].height
                });
            }
        }
    }

    showLightImgById(id) {
        for (let i = 0; i < this.lightImgEntities.length; i++) {
            if (this.lightImgEntities[i].id == "light_" + id) {
                this.lightImgEntities[i].show = true;
                break;
            }
        }
    }

    hideLightImgById(id) {
        for (let i = 0; i < this.lightImgEntities.length; i++) {
            if (this.lightImgEntities[i].id == "light_" + id) {
                this.lightImgEntities[i].show = false;
                break;
            }
        }
    }

    // 移到管线上时管线高亮，移出时管线正常
    changeHighLightLineStateByNameID(nameId) {
        if (nameId !== undefined && nameId !== this.oldHighLineNameID) {
            // this.setLineMaterial(nameId, "highlight");
            // this.setLineMaterial(this.oldHighLineNameID, "normal");
            if (this.oldHighLineNameID !== undefined) {
                this.hideLightImgById(this.oldHighLineNameID);
            }
            this.oldHighLineNameID = nameId;
            this.showLightImgById(nameId);
        } else {
            if (this.oldHighLineNameID !== undefined) {
                // this.setLineMaterial(this.oldHighLineNameID, "normal");
                this.hideLightImgById(this.oldHighLineNameID);
                this.oldHighLineNameID = undefined;
            }
        }
    }

    // 设置路线材质
    setLineMaterial(nameid, material) {
        if (this.polylineDataSource !== undefined) {
            let entities = this.polylineDataSource.entities.values;
            if (material == "highlight") {
                for (let o = 0; o < entities.length; o++) {
                    let m = entities[o];
                    if (nameid == o) {
                        m.polyline.width = this.highLineWidth;
                        m.polyline.material = new Cesium.PolylineGlowMaterialProperty({
                            glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                            color: Cesium.Color.fromCssColorString("#FFAE00").withAlpha(0.8)
                        })
                        break;
                    }
                }
            } else if (material == "normal") {
                for (let o = 0; o < entities.length; o++) {
                    let m = entities[o];
                    if (nameid == o) {
                        m.polyline.width = this.normalLineWidth;
                        m.polyline.material = new Cesium.ColorMaterialProperty(
                            Cesium.Color.fromCssColorString("#FFAE00")
                        );
                        break;
                    }
                }
            }
        }
    }

    // 显示路线
    showRoute() {
        if (this.polylineDataSource !== undefined) {
            let entities = this.polylineDataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
                entities[i].show = true;
            }
            for (let i = 0; i < this.pipelineMarkEntities.length; i++) {
                this.pipelineMarkEntities[i].show = true;
            }
        }

    }

    // 隐藏路线
    hideRoute() {
        if (this.polylineDataSource !== undefined) {
            let entities = this.polylineDataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
                entities[i].show = false;
            }
            for (let i = 0; i < this.pipelineMarkEntities.length; i++) {
                this.pipelineMarkEntities[i].show = false;
            }
        }
    }
}
