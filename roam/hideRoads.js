import { PipeNetworkConfig } from "./pipeNetworkConfig";

export class HideRoad {

    constructor(modelHide, textureTool) {

        this.modelHide = modelHide;
        this.textureTool = textureTool;

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

    showFlowTo(pipeline_all, urlImg) {
        for (let i = 0; i < pipeline_all.length; i++) {
            this.textureTool.addRepetitiveTexture(pipeline_all[i], urlImg, -0.06, 20)
        }
    }
}

