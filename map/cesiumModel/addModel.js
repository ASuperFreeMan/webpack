import { DataRequest } from './dataRequest'

export class AddModel {
    constructor(viewer, urls) {
        this.viewer = viewer;

        this.pumpModelUrl = urls.mapModelUrl.pump;

        this.monitorModelUrl = urls.mapModelUrl.monitor;

        this.plantModelUrl = urls.mapModelUrl.plant;

        this.architectureModelUrl = urls.mapModelUrl.architecture;

        this.floorUrl = urls.floorUrlToCesium;



        this.models = [];

        this.monitorModels = [];

        // this.addCityModels();
        // this.addWellModels();
        // this.addPipelineModels();
    }

    //外部建筑模型加载
    createModelWithPrimitive(id, url, isScale) {
        // 获取一个WGS84点的坐标点对应的世界坐标
        let origin = Cesium.Cartesian3.fromDegrees(119.92672212218824, 32.46281482545325, 0);
        let baseModelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0));

        let Model = this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
            id: id,
            show: true,
            url: url,
            color: Cesium.Color.MINTCREAM,
            // lightColor: new Cesium.Cartesian3(3, 2.8, 2.4),
            // silhouetteColor: Cesium.Color.CHOCOLATE,
            // silhouetteSize: 5,
            // modelMatrix: baseModelMatrix,
            // colorBlendAmount: 1,
            // luminanceAtZenith: 0.5,
            // incrementallyLoadTextures: false
        }));

        const self = this;

        Model.readyPromise.then(function (model) {

            let position = Cesium.Cartesian3.fromDegrees(119.92672212218824 + 0.0113, 32.46281482545325 - 0.0066 - 0.000005, 0); // 119.92677790917063, 32.46318663013395
            let mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);

            // 进行90度旋转
            let rotation = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-90)));
            Cesium.Matrix4.multiply(mat, rotation, mat);

            if (isScale) {
                //拉伸
                let scale = 1 / 2.54;
                let scaleCartesian3 = new Cesium.Cartesian3(scale, scale, scale);
                Cesium.Matrix4.multiplyByScale(mat, scaleCartesian3, mat);
            }

            model.modelMatrix = mat;

            //保存模型
            self.models.push(model);
        });

        // Model.readyPromise.then(function (model) {
        //     var imagePath = "/static/map/imgs/test.png";
        //     var textures = model._rendererResources.textures;
        //     // for (let k in textures) {
        //     let texture = textures[0];
        //     console.log(texture)

        //     Cesium.Resource.fetchImage({
        //         url: imagePath
        //     }).then(function (image) {
        //         texture.copyFrom(image);
        //         texture.generateMipmap(); // Also replaces textures in mipmap
        //     }).otherwise(function (error) {
        //         console.log("Error finding livery!  Error = " + error);
        //     });
        //     // }

        // })

    }

    createModelWithEntity(lng, lat, height, url, scale, color, modelName, isNeedUpdateScale) {

        const self = this;

        function computeScale() {
            let cameraPosition = self.viewer.camera.positionWC;
            let entityPosition = Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), 0);
            let distance = Cesium.Cartesian3.distance(cameraPosition, entityPosition);
            if (distance >= 8000) {
                return scale;
            } else {
                let result = distance * (scale / 8000);
                if (result <= 0.2) {
                    result = 0.2;
                }
                return result;
            }
        }

        let entity = this.viewer.entities.add({
            name: modelName ? modelName : '',
            position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), height ? Number(height) : 0),
            model: {
                uri: url,
                scale: isNeedUpdateScale ? new Cesium.CallbackProperty(computeScale, false) : scale,
                color: color,
                colorBlendAmount: color ? 0.5 : 0,
                colorBlendMode: color ? Cesium.ColorBlendMode.REPLACE : Cesium.ColorBlendMode.MIX,
                // lightColor: new Cesium.Cartesian3(0, 1, 168 / 255)
            }
        })
        this.models.push(entity);
    }

    // 更新模型属性
    updateModel(name, bodyColor, lineColor) {
        for (let key in this.models) {
            let entity = this.models[key];
            let entityName = entity.name;
            if (entityName && entityName.startsWith(name)) {
                if (entityName.endsWith("body")) {
                    entity.model.color = Cesium.Color.fromCssColorString(bodyColor);
                } else if (entityName.endsWith("line")) {
                    entity.model.color = Cesium.Color.fromCssColorString(lineColor);
                }
            }
        }
    }

    updateMonitorModel(name, color) {
        for (let i = 0; i < this.monitorModels.length; i++) {
            let entity = this.monitorModels[i];
            if (entity.name == name && entity.ellipsoid) {
                entity.ellipsoid.outlineColor = Cesium.Color.fromCssColorString(color.line);
                entity.ellipsoid.material = Cesium.Color.fromCssColorString(color.body);
            }
        }
    }

    changePumpModelScale(name, scale) {
        for (let key in this.models) {
            let entity = this.models[key];
            let entityName = entity.name;
            if (entityName && entityName.startsWith(name)) {
                entity.model.scale = scale;
            }
        }
    }

    showMonitorModel() {
        for (let i = 0; i < this.monitorModels.length; i++) {
            this.monitorModels[i].show = true;
        }
    }

    hideMonitorModel() {
        for (let i = 0; i < this.monitorModels.length; i++) {
            this.monitorModels[i].show = false;
        }
    }

    showAllModel() {
        for (let key in this.models) {
            this.models[key].show = true;
        }
    }

    hideAllModel() {
        for (let key in this.models) {
            this.models[key].show = false;
        }
    }

    //生成模型加载
    createCustomModel(id, url, paramMatrix4, lineMaterial) {
        let color;
        if (lineMaterial) {
            switch (lineMaterial) {
                case '砼':
                    color = Cesium.Color.CRIMSON;
                    break;
                case '球墨铸铁':
                    color = Cesium.Color.DARKGOLDENROD;
                    break;
                case '玻璃钢':
                    color = Cesium.Color.DARKGREEN;
                    break;
                case '':
                    color = Cesium.Color.DARKMAGENTA;
                    break;
                case 'PE':
                    color = Cesium.Color.DARKORANGE;
                    break;
                case 'PVC':
                    color = Cesium.Color.DARKRED;
                    break;
                case "塑料":
                    color = Cesium.Color.DARKSALMON;
                    break;
                case '钢':
                    color = Cesium.Color.GOLD;
                    break;
            }
        }
        let model = this.viewer.scene.primitives.add(Cesium.Model.fromGltf({
            id: id,
            show: true,
            url: url,
            modelMatrix: paramMatrix4,
            color: color
        }));

        return model;
    }

    //获取平移后的modelMatrix矩阵
    getTranslationMatrix4(paramX, paramY, paramZ) {
        // 获取一个WGS84点的坐标点对应的世界坐标
        let origin = Cesium.Cartesian3.fromDegrees(119.92672212218824, 32.46281482545325, 1.0);
        let baseModelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0));

        //创建一个平移向量Cartesian3
        let translation = new Cesium.Cartesian3(paramX, paramY, paramZ);

        //创建一个此平移向量的4x4矩阵
        let translationMatrix4 = Cesium.Matrix4.fromTranslation(translation);

        return Cesium.Matrix4.multiply(baseModelMatrix, translationMatrix4, baseModelMatrix);
    }

    //理论:缩放->旋转->平移  4x4矩阵
    //操作:平移->旋转->缩放
    getTranslationRotationScaleMatrix4(translationX, translationY, translationZ, rotateAngle, scaleX, scaleY, scaleZ) {
        // 获取一个WGS84点的坐标点对应的世界坐标
        let origin = Cesium.Cartesian3.fromDegrees(119.92672212218824, 32.46281482545325, 1.0);
        let baseModelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0));

        //平移
        let translationCartesian3 = new Cesium.Cartesian3(translationX, translationY, translationZ);
        Cesium.Matrix4.multiply(baseModelMatrix, Cesium.Matrix4.fromTranslation(translationCartesian3), baseModelMatrix);

        //旋转
        let rotationMatrix3 = Cesium.Matrix3.fromRotationZ(rotateAngle);
        Cesium.Matrix4.multiply(baseModelMatrix, Cesium.Matrix4.fromRotationTranslation(rotationMatrix3), baseModelMatrix);

        //拉伸
        let scaleCartesian3 = new Cesium.Cartesian3(scaleX, scaleY, scaleZ);
        Cesium.Matrix4.multiplyByScale(baseModelMatrix, scaleCartesian3, baseModelMatrix);

        return baseModelMatrix;
    }

    addWellModels() {
        let dataRequest = new DataRequest();
        let baseWellData = dataRequest.getWellsData();

        // console.log(baseWellData);

        for (let i = 0; i < baseWellData.length; i++) {
            let tempModelMatrix4 = this.getTranslationMatrix4(baseWellData[i].wellX, -(baseWellData[i].wellZ), 0);
            this.createCustomModel(baseWellData[i].wellId, this.wellUrl, tempModelMatrix4);
        }
    }

    addPipelineModels() {
        let dataRequest = new DataRequest();
        let basePipelineData = dataRequest.getPipelinesData();

        // console.log(basePipelineData);

        //pipelineId - pipelineX1/X2 - pipelineY1/Y2 - pipelineZ1/Z2 - diameter - material - startElevation - endElevation
        let id, x1, x2, y1, y2, angle, scale;

        for (let i = 0; i < basePipelineData.length; i++) {
            let tempModelMatrix4;
            id = basePipelineData[i].pipelineId;
            x1 = basePipelineData[i].pipelineX1;
            x2 = basePipelineData[i].pipelineX2;
            y1 = basePipelineData[i].pipelineZ1;
            y2 = basePipelineData[i].pipelineZ2;

            if (x1 == x2 && y1 == y2) {
                continue;
            }

            angle = -Math.atan2(y1 - y2, x1 - x2) - Math.PI / 2;
            scale = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 25;

            tempModelMatrix4 = this.getTranslationRotationScaleMatrix4((x1 + x2) / 2, -((y1 + y2) / 2), 0, angle, 1, scale, 1);

            this.getPipelineModel(id, tempModelMatrix4, basePipelineData[i].material);
        }

    }

    getPipelineModel(id, modelMatrix, lineMaterial) {
        this.createCustomModel(id, this.singlePipeTemplateUrl, modelMatrix, lineMaterial);

    }


    addPumpModels(positions) {
        for (let key in positions) {
            let curUrl1 = this.pumpModelUrl[key][0];
            let curUrl2 = this.pumpModelUrl[key][1];

            for (let i = 0; i < positions[key].length; i++) {
                let curPosition = positions[key][i];
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curPosition.height ? curPosition.height : 0, curUrl1, 2, curPosition.color.line ? Cesium.Color.fromCssColorString(curPosition.color.line) : undefined, curPosition.name + "line", true);
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curPosition.height ? curPosition.height : 0, curUrl2, 2, curPosition.color.body ? Cesium.Color.fromCssColorString(curPosition.color.body) : undefined, curPosition.name + "body", true);
            }
        }
    }

    addMonitorModels(positions) {
        for (let key in positions) {
            // let curUrl1 = this.monitorModelUrl[key][0];
            // let curUrl2 = this.monitorModelUrl[key][1];
            // let curUrl3 = this.monitorModelUrl[key][2];

            // for (let i = 0; i < positions[key].length; i++) {
            //     let curPosition = positions[key][i];
            //     this.createModelWithEntity(curPosition.lng, curPosition.lat, 0, curUrl1, 2);
            //     this.createModelWithEntity(curPosition.lng, curPosition.lat, 0, curUrl2, 2, curPosition.color ? Cesium.Color.fromCssColorString(curPosition.color) : undefined, curPosition.name + "body");
            //     this.createModelWithEntity(curPosition.lng, curPosition.lat, 0, curUrl3, 2);
            // }

            // for (let i = 0; i < positions[key].length; i++) {
            //     let curPosition = positions[key][i];
            //     let lng = Number(curPosition.lng);
            //     let lat = Number(curPosition.lat);
            //     this.viewer.entities.add({
            //         position: Cesium.Cartesian3.fromDegrees(lng, lat, 100),
            //         show: true,
            //         cylinder: {
            //             length: 200,
            //             topRadius: 8,
            //             bottomRadius: 8,
            //             material: new Cesium.ImageMaterialProperty({
            //                 image: 'static/map/imgs/1.png',
            //                 color: Cesium.Color.WHITE,
            //                 repeat: new Cesium.Cartesian2(1, 1),
            //                 transparent: true
            //             })
            //         }
            //     });
            // }
            for (let i = 0; i < positions[key].length; i++) {
                let curPosition = positions[key][i];
                for (let j = 0; j < 5; j++) {
                    let height = 15 * j;
                    let lng = Number(curPosition.lng);
                    let lat = Number(curPosition.lat);
                    let color = curPosition.color;
                    let name = curPosition.name;
                    let entity = this.viewer.entities.add({
                        name: name,
                        show: false,
                        position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
                        ellipsoid: {
                            radii: new Cesium.Cartesian3(5, 5, 5),
                            outline: true,
                            outlineColor: Cesium.Color.fromCssColorString(color.line),
                            outlineWidth: 2,
                            material: Cesium.Color.fromCssColorString(color.body),
                        },
                    });
                    this.monitorModels.push(entity);
                }
            }
        }
    }

    addPlantModel(position) {
        let curUrl1 = this.plantModelUrl[0];
        let curUrl2 = this.plantModelUrl[1];

        this.createModelWithEntity(position.lng, position.lat, position.height ? position.height : 0, curUrl1, 2, position.color.line ? Cesium.Color.fromCssColorString(position.color.line) : undefined, undefined, true);
        this.createModelWithEntity(position.lng, position.lat, position.height ? position.height : 0, curUrl2, 2, position.color.body ? Cesium.Color.fromCssColorString(position.color.body) : undefined, undefined, true);
    }

    addCityModels(positions) {
        // this.createModelWithPrimitive('boliti', this.boliti, true);
        for (let key in this.floorUrl) {
            this.createModelWithPrimitive('floor', this.floorUrl[key]);
        }
        // this.createModelWithPrimitive('other', this.otherUrl);

        let architectureListPositions = positions;

        for (let key in architectureListPositions) {
            let curPosition = architectureListPositions[key]
            this.createModelWithEntity(curPosition.lng, curPosition.lat, 0, this.architectureModelUrl[key], curPosition.scale ? Number(curPosition.scale) : 1);
        }

    }


}
