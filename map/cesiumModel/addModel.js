import { DataRequest } from './dataRequest'

export class AddModel {
    constructor(viewer, urls) {
        this.viewer = viewer;

        this.pumpModelUrl = urls.mapModelUrl.pump;

        this.monitorModelUrl = urls.mapModelUrl.monitor;

        this.plantModelUrl = urls.mapModelUrl.plant;

        this.architectureModelUrl = urls.mapModelUrl.architecture;

        this.models = [];

        // this.addCityModels();
        // this.addWellModels();
        // this.addPipelineModels();
    }

    //外部建筑模型加载
    createModel(id, url, isScale) {
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

            let position = Cesium.Cartesian3.fromDegrees(119.92677790917063, 32.46318663013395, 0); // 119.92677790917063, 32.46318663013395
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

    createModelWithEntity(lng, lat, url, scale, color, isNeedUpdateColor) {
        let entity = this.viewer.entities.add({
            name: isNeedUpdateColor ? lng : '',
            position: Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), 0),
            model: {
                uri: url,
                scale: scale,
                color: color,
                colorBlendAmount: color ? 0.5 : 0,
                colorBlendMode: color ? Cesium.ColorBlendMode.REPLACE : Cesium.ColorBlendMode.MIX,
                // lightColor: new Cesium.Cartesian3(0, 1, 168 / 255)
            }
        })
        this.models.push(entity);
    }

    // 更新模型属性
    updateModel(lng, color) {
        for (let key in this.models) {
            let entity = this.models[key];
            if (lng == entity.name) {
                entity.model.color = Cesium.Color.fromCssColorString(color).withAlpha(.6);
                break;
            }
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
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curUrl1, 2, curPosition.color.line ? Cesium.Color.fromCssColorString(curPosition.color.line) : undefined);
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curUrl2, 2, curPosition.color.body ? Cesium.Color.fromCssColorString(curPosition.color.body) : undefined, true);
            }
        }
    }

    addMonitorModels(positions) {
        for (let key in positions) {
            let curUrl1 = this.monitorModelUrl[key][0];
            let curUrl2 = this.monitorModelUrl[key][1];

            for (let i = 0; i < positions[key].length; i++) {
                let curPosition = positions[key][i];
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curUrl1, 2);
                this.createModelWithEntity(curPosition.lng, curPosition.lat, curUrl2, 2, curPosition.color ? Cesium.Color.fromCssColorString(curPosition.color) : undefined, true);
            }
        }
    }

    addPlantModel(position) {
        let curUrl1 = this.plantModelUrl[0];
        let curUrl2 = this.plantModelUrl[1];

        this.createModelWithEntity(position.lng, position.lat, curUrl1, 2, position.color.line ? Cesium.Color.fromCssColorString(position.color.line) : undefined);
        this.createModelWithEntity(position.lng, position.lat, curUrl2, 2, position.color.body ? Cesium.Color.fromCssColorString(position.color.body) : undefined, true);
    }

    addCityModels(positions) {
        // this.createModel('boliti', this.boliti, true);
        // for (let key in this.floorUrl) {
        //     this.createModel('floor', this.floorUrl[key]);
        // }
        // this.createModel('other', this.otherUrl);

        let architectureListPositions = positions;

        for (let key in architectureListPositions) {
            let curPosition = architectureListPositions[key]
            this.createModelWithEntity(curPosition.lng, curPosition.lat, this.architectureModelUrl[key], 3);
        }

    }


}
