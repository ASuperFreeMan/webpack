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
        this.modelHide.hideByIdInObject3D("floor|boliti-CDfbx")
        this.modelHide.hideByIdInObject3D("floor|CDfbx")
        this.modelHide.hideByIdInObject3D("floor|标线fbx")
        this.modelHide.hideByIdInObject3D("dimian|boliti-CDfbx")
        // this.modelHide.hideByIdInObject3D("floor|boliti-buildingfbx")
    }

    //显示路面
    restoreRoad() {
        this.modelHide.restoreById("floor|boliti-CDfbx")
        this.modelHide.restoreById("floor|CDfbx")
        this.modelHide.restoreById("floor|标线fbx")
        this.modelHide.restoreById("dimian|boliti-CDfbx")
        // this.modelHide.restoreById("floor|boliti-buildingfbx")
    }

    showFlowTo(pipeline_all, urlImg) {
        for (let i = 0; i < pipeline_all.length; i++) {
            this.textureTool.addRepetitiveTexture(pipeline_all[i], urlImg, -0.06, 20)
        }
    }
}

