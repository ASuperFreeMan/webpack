import { PipeNetworkConfig } from "./pipeNetworkConfig";

export class HideRoad {

    constructor(modelHide, textureTool, transparent) {

        this.modelHide = modelHide;
        this.textureTool = textureTool;
        this.transparent = transparent;

    }

    road(invisible) {
        if (invisible == true) {
            this.hideRoad()
        } else {
            this.restoreRoad()
        }
    }

    //隐藏路面
    hideRoad() {
        for (let i = 0; i < PipeNetworkConfig.HIDE_ROAD_MODEL_NAME.length; i++) {
            this.modelHide.hideByIdInObject3D(PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX + "|" + PipeNetworkConfig.HIDE_ROAD_MODEL_NAME[i])
        }
    }

    //显示路面
    restoreRoad() {
        for (let i = 0; i < PipeNetworkConfig.HIDE_ROAD_MODEL_NAME.length; i++) {
            this.modelHide.restoreById(PipeNetworkConfig.ARCHITECTURE_MODEL_PREFIX + "|" + PipeNetworkConfig.HIDE_ROAD_MODEL_NAME[i])
        }
    }

    showFlowTo(pipeline_all, urlImg1, urlImg2) {
        for (let i = 0; i < pipeline_all.length; i++) {
            if (pipeline_all[i].userData.elevationDifference > 0) {
                this.textureTool.addRepetitiveTexture(pipeline_all[i], urlImg2, 0.04, 0.5)
            }
            if (pipeline_all[i].userData.elevationDifference < 0) {
                this.textureTool.addRepetitiveTexture(pipeline_all[i], urlImg1, -0.04, 0.5)
            }
            if (pipeline_all[i].userData.elevationDifference == 0) {
                this.textureTool.addRepetitiveTexture(pipeline_all[i], urlImg1, 0, 0.5)
            }
        }
    }

    //控制地面透明度
    adjustRoadTransparency(roadId, transparency) {
        console.log(roadId)
        console.log(transparency)
        console.log(this.transparent.getCore().getNodeByName(roadId))
        let obj = this.transparent.getCore().getNodeByName(roadId)
        for (let i = 0; i < obj.children.length; i++) {
            let type = obj.children[i].type
            if (type === "Mesh") {
                this.transparent.setMeshOpacity(obj.children[i], transparency);
            }
        }
    }
}

