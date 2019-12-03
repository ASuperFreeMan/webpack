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

        // 移除所有影像图层
        // this.viewer.imageryLayers.removeAll();
        //隐藏版权信息
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        // 相机近地面距离
        this.nearDistance = 4000;
        // 相机远地面距离
        this.farDistance = 6500;
        // 默认泰州位置
        this.defaultLocation = { x: 119.91421480425896, y: 32.42337447397941, z: 6500 };
        // 图标实体集合
        this.markEntities = [];
        // 高亮路线对象
        this.polylineDataSource;

        // 正常路线宽度
        this.normalLineWidth = 5;
        // 高亮路线宽度
        this.highLineWidth = 25;
        // 记录上一个nameID
        this.oldHighLineNameID;

        this.init();

        // 取消拖动事件
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        // 取消滚轮事件
        this.viewer.scene.screenSpaceCameraController.enableZoom = false;
    }

    // 左键点击事件
    setLeftClickAction(callback) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        const self = this;
        handler.setInputAction(function (click) {

            let pick = self.viewer.scene.pick(click.position);
            if (pick !== undefined && pick.id._name == "mark") {
                let cartesian = new Cesium.Cartesian3(pick.id._position._value.x, pick.id._position._value.y, pick.id._position._value.z);
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                // console.log(lng + ", " + lat)
                self.flyTo(lng, lat, self.nearDistance);

                let id = pick.id._id;
                callback(id);
            }

            if (pick !== undefined && pick.id.nameID !== undefined) {
                if (callback !== undefined) {
                    let name_id = pick.id.nameID;

                    if (name_id <= 4) {
                        // 1经度对应3D模型坐标X轴的长度 => lngToObject3DX
                        // 1纬度对应3D模型坐标Z轴的长度 => latToObject3DZ
                        const lngToObject3DX = 93815.009874142068525748445840366, latToObject3DZ = -112249.66656363197477846898570451;
                        // 3D模型坐标系的原点对应经纬度
                        const origin = { x: 119.92672212218824, z: 32.46281482545325 }
                        // 获取鼠标点击位置经纬度
                        let ray = self.viewer.camera.getPickRay(click.position);
                        let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
                        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                        // 将经纬度转换成3D模型坐标
                        let x = lngToObject3DX * (lng - origin.x);
                        let z = latToObject3DZ * (lat - origin.z);

                        let param = "x=" + x + "&z=" + z + "&id=" + name_id;
                        callback(param);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    setMouseHoverAction() {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        const self = this;
        handler.setInputAction(function (movement) {
            let pickedFeature = self.viewer.scene.pick(movement.endPosition);
            if (pickedFeature !== undefined && pickedFeature.id.nameID !== undefined) {
                let name_id = pickedFeature.id.nameID;
                if (name_id <= 5) {
                    self.changeHighLightLineStateByNameID(name_id);
                }
            } else {
                self.changeHighLightLineStateByNameID();
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    setMouseWheelAction() {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        const self = this;
        handler.setInputAction(function (movement) {
            let pitch = Cesium.Math.toDegrees(self.viewer.camera.pitch);
            let cartographic = self.viewer.camera.positionCartographic;
            let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
            let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
            let height = cartographic.height;

            if (height > 30000 && (-46 <= pitch && pitch <= -45)) {
                self.viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height), // 点的坐标
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                        pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
                        roll: 0.0                             // default value
                    }
                })
            } else if (height <= 30000 && (-90 <= pitch && pitch <= -89)) {
                self.viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height), // 点的坐标
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                        pitch: Cesium.Math.toRadians(-45),    // default value (looking down)
                        roll: 0.0                             // default value
                    }
                })
            }
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }

    // 初始化配置
    init() {
        this.setMouseHoverAction();
        this.setMouseWheelAction();
        // this.setMap();
    }

    // 销毁配置
    destory() {
        // 移除图标
        for (let i = 0; i < this.markEntities.length; i++) {
            this.viewer.entities.remove(this.markEntities[i]);
        }
        this.markEntities = [];
        // 去除高亮管线
        if (this.polylineDataSource !== undefined) {
            this.viewer.dataSources.remove(this.polylineDataSource);
        }
        // 飞到地球外面
        this.viewer.camera.flyHome();

    }

    // 相机飞行到泰州市海陵区默认位置
    earthRolling(show) {
        const self = this;
        if (show) {
            self.flyTo(self.defaultLocation.x, self.defaultLocation.y, self.defaultLocation.z, function () {
                setTimeout(function () {
                    self.showAllMarks();
                    self.showRoute();
                }, 2000);
            });
        } else {
            self.flyTo(self.defaultLocation.x, self.defaultLocation.y, self.defaultLocation.z);
        }

    }

    // 设置地图
    setMap() {
        let imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/workspace%3AL18@BaiduMap@png/{z}/{x}/{reverseY}.png',
            // tilingScheme: new Cesium.GeographicTilingScheme(),
            // minimumLevel: level < 4 ? level : 4,
            // maximumLevel: level
        });
        // this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        // let imageryProvider = new Cesium.WebMapServiceImageryProvider({
        //     url: 'http://localhost:8080/geoserver/workspace', // 'http://192.168.0.100:8080/geoserver/industry/wms'
        //     layers: 'industry:L5',
        //     parameters: {
        //         service: 'WMS',
        //         format: 'image/png',
        //         transparent: true,
        //         srs: "EPSG:3857",
        //     },
        //     // minimumLevel: level < 4 ? level : 4,
        //     // maximumLevel: level
        // });
        this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    }

    // 飞行到指定位置
    flyTo(lng, lat, height, callback) {
        // 偏差值
        let deviation = lat - 0.03688723352509;
        let cartographic = this.viewer.camera.positionCartographic;

        // 相机据地面高度超10000米时，镜头垂直于地面飞行
        if (cartographic.height > 30000 && height < 30000) {
            const self = this;
            self.viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
                orientation: {
                    heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                    pitch: Cesium.Math.toRadians(-90),    // default value (looking down)
                    roll: 0.0                             // default value
                },
                complete: function () {
                    self.setView(lng, deviation, height);
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
                    pitch: Cesium.Math.toRadians(-45),    // default value (looking down)
                    roll: 0.0                             // default value
                },
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
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, height), // 点的坐标
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(-45),    // default value (looking down)
                roll: 0.0                             // default value
            }
        });

        if (distance !== undefined) {
            this.viewer.scene.camera.moveBackward(distance);
        }

    }

    // 添加一个图标
    addMark(id, position, label, billboard) {
        let entity = this.viewer.entities.add({
            id: id,
            name: "mark",
            position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
            label: {
                text: label.text,
                font: label.font ? label.font : '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: label.fillColor !== undefined ? Cesium.Color.fromCssColorString(label.fillColor.color).withAlpha(label.fillColor.alpha) : Cesium.Color.WHITE,
                outlineColor: label.outlineColor !== undefined ? Cesium.Color.fromCssColorString(label.outlineColor.color).withAlpha(label.outlineColor.alpha) : Cesium.Color.BLACK,
                outlineWidth: label.outlineWidth !== undefined ? label.outlineWidth : 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(label.pixelOffset.offSetX, label.pixelOffset.offSetY),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100, 30000),
                scaleByDistance: new Cesium.NearFarScalar(100, 4, 30000, 0)
            },
            billboard: billboard !== undefined ? {
                image: billboard.uri,
                width: billboard.width !== undefined ? billboard.width : 700,
                height: billboard.height !== undefined ? billboard.height : 500,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100, 30000),
                scaleByDistance: new Cesium.NearFarScalar(100, 4, 30000, 0)
            } : {}
        });
        entity.show = false;
        this.markEntities.push(entity);
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
                this.viewer.entities.remove(this.markEntities[i])
            }
            break;
        }
        this.markEntities.splice(i, 1);
    }

    // 添加高亮路线
    addHighlightRoute(url) {
        let geojsonOptions = {
            clampToGround: true
        };
        // 从geojson文件加载行政区多边形边界数据
        // Data from : https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq
        let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
        const self = this;
        // Save an new entity collection of neighborhood data
        neighborhoodsPromise.then(function (dataSource) {
            self.viewer.dataSources.add(dataSource);
            self.polylineDataSource = dataSource;
            let entities = dataSource.entities.values;

            for (let i = 0; i < entities.length; i++) {
                let r = entities[i];
                r.show = false;
                r.nameID = i;   //给每条线添加一个编号，方便之后对线修改样式
                // r.polyline.width = self.highLineWidth;  //添加默认样式
                // r.polyline.material = new Cesium.PolylineGlowMaterialProperty({
                //     glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
                //     color: Cesium.Color.fromCssColorString("#FFAE00")
                // });
                if (i <= 5) {
                    r.polyline.width = self.normalLineWidth;
                    r.polyline.material = Cesium.Color.fromCssColorString("#FFAE00");
                } else {
                    r.polyline.width = 3;
                    r.polyline.material = Cesium.Color.fromCssColorString("#DCDCDC");
                }
                r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, 30000);
                // 将当前路线nameID添加到数组
                // self.highLineNameIds.push(i);
                // 设置这个属性让多边形贴地，ClassificationType.CESIUM_3D_TILE 是贴模型，ClassificationType.BOTH是贴模型和贴地
                // entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN; // 这个配置会引起不知名异常，接下来的代码不执行
            }

        });
    }

    // 移到管线上时管线高亮，移出时管线正常
    changeHighLightLineStateByNameID(nameid) {
        if (nameid !== undefined && nameid !== this.oldHighLineNameID) {
            this.setLineMaterial(nameid, "highlight");
            this.setLineMaterial(this.oldHighLineNameID, "normal");
            this.oldHighLineNameID = nameid;
        } else {
            if (this.oldHighLineNameID !== undefined) {
                this.setLineMaterial(this.oldHighLineNameID, "normal");
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
        }
    }

    // 隐藏路线
    hideRoute() {
        if (this.polylineDataSource !== undefined) {
            let entities = this.polylineDataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
                entities[i].show = false;
            }
        }
    }
}
