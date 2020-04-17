import { DataRequest } from './dataRequest'

export class AddModel {
    constructor(viewer, urls) {
        this.viewer = viewer;

        this.wellUrl = urls.wellUrl
        this.singlePipeTemplateUrl = urls.singlePipeTemplateUrl

        this.boliti = urls.boliti
        this.floorUrl = urls.floorUrl
        this.otherUrl = urls.otherUrl[1]

        this.models = [];

        // this.addCityModels();
        // this.addWellModels();
        // this.addPipelineModels();
    }

    //外部建筑模型加载
    createModel(id, url, isScale) {
        // 获取一个WGS84点的坐标点对应的世界坐标
        let origin = Cesium.Cartesian3.fromDegrees(119.92672212218824, 32.46281482545325, -10);
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
            // 进行90度旋转
            model.id = id;
            model.show = false;
            let position = Cesium.Cartesian3.fromDegrees(119.92672212218824, 32.46281482545325, -10);
            let mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
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

    addCityModels() {
        this.createModel('boliti', this.boliti, true);
        for (let key in this.floorUrl) {
            this.createModel('floor', this.floorUrl[key]);
        }
        this.createModel('other', this.otherUrl);
    }

}
