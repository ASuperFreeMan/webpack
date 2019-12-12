export class ShowInformationBox {
    constructor() {

    }

    isPipeline(node) {
        if (node != null && (node.userData.modelName == "pipeline" || node.userData.modelName == "well")) {
            // console.log("11111111111")
            this.selectInformationBox(node.name, node.userData.modelName)
        }
    }

    selectInformationBox(nodeName, modelName) {
        // console.log("2222222")
        const self = this;
        if (modelName == "pipeline") {
            $.ajax({
                // url:"http://192.168.0.43:8099/api/v1/article/monitor/pipelineId",
                // url: "http://192.168.0.100:8099/api/v1/article/monitor/pipelineId",
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
                    self.showInformationBox(content, closeContent, "40%", "35%")
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
                // url:"http://192.168.0.43:8099/api/v1/article/monitor/wellPointId",
                // url: "http://192.168.0.100:8099/api/v1/article/monitor/wellPointId",
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
                    self.showInformationBox(content, closeContent, "40%", "35%")
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

    showInformationBox(dataContent, closeContent, left, top) {
        // console.log("55555555555")
        // layer.open({
        //     skin: 'layer-dg',
        //     anim: -1,
        //     type: 1, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
        //     title: false,   //标题
        //     area: [width, height],   //宽高
        //     shade: 0,   //遮罩透明度
        //     content: $(dataContent),//支持获取DOM元素
        //     scrollbar: false,//屏蔽浏览器滚动条
        //     offset: ['40%', '35%'],
        //     shadeClose: true,
        //     move: dataContent
        // });

        var dc = document.getElementById(dataContent)
        dc.style.display = "block"
        dc.style.position = "absolute"
        dc.style.left = left
        dc.style.top = top
        var di = document.getElementById(closeContent)
        di.addEventListener("click", function () {
            dc.style.display = "none"
        })
    }

    // modelInfoBtnEvenInit() {
    //     $(".layui-layer-setwin").bind("click", function () {
    //         $("#pipeLineInformationBox").hide();
    //         $("#tubeWellInformationBox").hide();
    //     });
    // }
}



