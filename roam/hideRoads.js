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

        this.modelHide.hideByIdInObject3D("floor|bolitifbx")
        this.modelHide.hideByIdInObject3D("floor|CDfbx")
        // this.modelHide.hideByIdInObject3D("zc|3140775_")

    }

    //显示路面
    restoreRoad() {

        this.modelHide.restoreById("floor|bolitifbx")
        this.modelHide.restoreById("floor|CDfbx")
        // this.modelHide.restoreById("zc|3140775_")

    }

}

