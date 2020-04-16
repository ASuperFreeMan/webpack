export class DataRequest {

    constructor() {

        this.RequestURL = {
            Pipeline_Base_Request_URL: "http://192.168.0.100:8099/api/v1/article/monitor/pipelineModeling",
            Pipeline_All_Request_URL: "",
            WellPoint_Base_Request_URL: "http://192.168.0.100:8099/api/v1/article/monitor/wellPointModeling",
            WellPoint_All_Request_URL: "",
        };
    }

    //获取管线数据
    getPipelinesData() {
        let tempPipelineData;
        $.ajax({
            url: this.RequestURL.Pipeline_Base_Request_URL,
            type: "GET",
            async: false,
            //这里需要同步,不然后面获取的值是未定义/空
            success: function (result) {
                // console.log(result.data);
                // noinspection JSPotentiallyInvalidUsageOfClassThis
                tempPipelineData = result.data;
            },
            error: function () {
                console.log("管道数据获取失败")
            }
        })
        return tempPipelineData;
    }

    //获取管井信息
    getWellsData() {
        let tempWellData;
        $.ajax({
            url: this.RequestURL.WellPoint_Base_Request_URL,
            type: "GET",
            async: false,
            success: function (result) {
                // console.log(result.data[0]);
                tempWellData = result.data;
            },
            error: function () {
                console.log("管井数据获取失败！")
            }
        })
        return tempWellData;
    }

}
