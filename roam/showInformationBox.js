export class ShowInformationBox {
    constructor() {

    }

    isPipeline(node) {
        if (node != null && (node.userData.modelName == "pipeline" || node.userData.modelName == "well")) {
            this.selectInformationBox(node.name, node.userData.modelName)
        }
    }

    selectInformationBox(nodeName, modelName) {
        const self = this;
        if (modelName == "pipeline") {
            $.ajax({
                // url:"http://192.168.0.43:8099/api/v1/article/monitor/pipelineId",
                url: "http://277jd48643.wicp.vip/api/v1/article/monitor/pipelineId",
                data: {
                    pipelineId: nodeName
                },
                type: "GET",
                success: function (d) {
                    let content = "#pipeLineInformationBox"
                    self.showInformationBox(content)
                    $("#pipingType").text(d.data.type)
                    $("#startNumber").text(d.data.startElevation)
                    $("#endNumber").text(d.data.endElevation)
                    $("#sectionSize").text(d.data.diameter)
                    $("#material").text(d.data.material)
                    // $("#whereRoad").text(d.data.conduitVo.whereRoad)
                    self.modelInfoBtnEvenInit()
                },
                error: function () {
                    alert("获取失败！1111")
                }
            })
        }
        if (modelName == "well") {
            $.ajax({
                // url:"http://192.168.0.43:8099/api/v1/article/monitor/wellPointId",
                url: "http://277jd48643.wicp.vip/api/v1/article/monitor/wellPointId",
                data: {
                    wellPointId: nodeName
                },
                type: "GET",
                success: function (d) {
                    let content = "#tubeWellInformationBox"
                    self.showInformationBox(content)
                    $("#depth").text(d.data.depth)
                    $("#elevation").text(d.data.elevation)
                    self.modelInfoBtnEvenInit()
                },
                error: function () {
                    alert("获取失败！2222")
                }
            })
        }

    }

    howInformationBox(dataContent) {

        layer.open({
            skin: 'layer-dg',
            anim: -1,
            type: 1, //Layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,
            title: false,   //标题
            area: ['auto', 'auto'],   //宽高
            shade: 0,   //遮罩透明度
            content: $(dataContent),//支持获取DOM元素
            scrollbar: false,//屏蔽浏览器滚动条
            offset: ['300px', '500px'],
            shadeClose: true,
            move: dataContent
        });
    }

    modelInfoBtnEvenInit() {
        $(".layui-layer-setwin").bind("click", function () {
            $("#pipeLineInformationBox").hide();
            $("#tubeWellInformationBox").hide();
        });
    }
}



