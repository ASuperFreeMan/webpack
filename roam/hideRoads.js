export class HideRoad {

    constructor(modelHide) {

        this.modelHide = modelHide;

    }

    road(checkbox) {
        if (checkbox.checked) {
            this.hideRoad()
        } else {
            this.restoreRoad()
        }
    }

    //隐藏路面
    hideRoad() {
        this.modelHide.hideByIdInObject3D("floor|boliti-CDfbx")
    }

    //显示路面
    restoreRoad() {

        this.modelHide.restoreById("floor|boliti-CDfbx")

    }

    showFlowTo(pipeline_all, urlImg) {
        for (let i = 0; i < pipeline_all.length; i++) {
            textureTool.addRepetitiveTexture(pipelineScene[i], urlImg)
        }
        render()
    }

}

