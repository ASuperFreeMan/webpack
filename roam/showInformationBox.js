export class ShowInformationBox {
    constructor() {

        this.removeEvents;
        this.addEvents;

    }

    setRemoveEvents(callback) {
        this.removeEvents = callback;
    }

    setAddEvents(callback) {
        this.addEvents = callback;
    }


    isPipeline(light, node) {
        if (node != null && (node.userData.modelName == "pipeline" || node.userData.modelName == "well")) {
            // console.log("11111111111")1474 1129
            // light.highLightByIds([1474, 1129])
            light.highLight(node)
            this.selectInformationBox(light, node.name, node.userData.modelName)
            // let pipeDC = document.getElementById("pipeLineInformationBox")
            // let wellDC = document.getElementById("tubeWellInformationBox")
            // pipeDC.style.display = "none"
            // wellDC.style.display = "none"

        }
    }

    selectInformationBox(light, nodeName, modelName) {
        // console.log("2222222")
        const self = this;
        if (modelName == "pipeline") {
            $.ajax({
                url: "http://277jd48643.wicp.vip/api/v1/article/monitor/pipelineId",
                data: {
                    pipelineId: nodeName
                },
                type: "GET",
                success: function (d) {
                    console.log("333333")
                    console.log(d.data)
                    let content = "pipeLineInformationBox"
                    let closeContent = "pipeClose"
                    self.showInformationBox(light, content, closeContent, "40%", "35%")
                    $("#pipingType").text(d.data.type)
                    $("#startNumber").text(d.data.startElevation)
                    $("#endNumber").text(d.data.endElevation)
                    $("#sectionSize").text(d.data.diameter)
                    $("#material").text(d.data.material)
                    // $("#whereRoad").text(d.data.conduitVo.whereRoad)
                    // self.modelInfoBtnEvenInit()
                },
                error: function () {
                    alert("获取失败！1111")
                }
            })
        }
        if (modelName == "well") {
            $.ajax({
                url: "http://277jd48643.wicp.vip/api/v1/article/monitor/wellPointId",
                data: {
                    wellPointId: nodeName
                },
                type: "GET",
                success: function (d) {
                    // console.log("444444")
                    // console.log(d.data)
                    let content = "tubeWellInformationBox"
                    let closeContent = "wellClose"
                    self.showInformationBox(light, content, closeContent, "40%", "35%")
                    $("#depth").text(d.data.depth)
                    $("#elevation").text(d.data.elevation)
                    // self.modelInfoBtnEvenInit()
                },
                error: function () {
                    alert("获取失败！2222")
                }
            })
        }

    }

    showInformationBox(light, dataContent, closeContent, left, top) {
        let mL = document.getElementById("mask")
        let dc = document.getElementById(dataContent)
        mL.style.display = "block"
        // 移除事件
        this.removeEvents();
        dc.style.display = "block"
        dc.style.position = "absolute"
        dc.style.left = left
        dc.style.top = top
        let di = document.getElementById(closeContent)
        const self = this;
        di.addEventListener("click", function () {
            dc.style.display = "none"
            mL.style.display = "none"
            try {
                light.removeHighLight()
            } catch{

            }
            // 添加事件
            self.addEvents();
        })
    }

}



