import { PipeNetworkConfig } from './pipeNetworkConfig';
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
        if (node != null && (node.userData.modelName == PipeNetworkConfig.PIPE_MODEL_PREFIX || node.userData.modelName == PipeNetworkConfig.WELL_MODEL_PREFIX)) {
            light.highLight(node)
            this.selectInformationBox(light, node.name, node.userData.modelName)
        }
    }

    selectInformationBox(light, nodeName, modelName) {
        const self = this;
        if (modelName == PipeNetworkConfig.PIPE_MODEL_PREFIX) {
            $.ajax({
                url: PipeNetworkConfig.GET_PIPE_PRESENT_DATA_URL,
                data: {
                    pipelineId: nodeName
                },
                type: "GET",
                success: function (d) {
                    let content = "pipeLineInformationBox"
                    let closeContent = "pipeClose"
                    self.showInformationBox(light, content, closeContent, "45%", "300%")//300
                    $("#pipingType").text(d.data.type)
                    $("#startNumber").text(d.data.startElevation)
                    $("#endNumber").text(d.data.endElevation)
                    $("#sectionSize").text(d.data.diameter)
                    $("#material").text(d.data.material)
                },
                error: function () {
                    alert("获取管网展示信息失败！")
                }
            })
        }
        if (modelName == PipeNetworkConfig.WELL_MODEL_PREFIX) {
            $.ajax({
                url: PipeNetworkConfig.GET_WELL_PRESENT_DATA_URL,
                data: {
                    wellPointId: nodeName
                },
                type: "GET",
                success: function (d) {
                    let content = "tubeWellInformationBox"
                    let closeContent = "wellClose"
                    self.showInformationBox(light, content, closeContent, "46%", "315%")//315
                    $("#depth").text(d.data.depth)
                    $("#elevation").text(d.data.elevation)
                },
                error: function () {
                    alert("获取管井展示信息失败!")
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
            } catch{ }
            // 添加事件
            self.addEvents();
        })
    }

}



