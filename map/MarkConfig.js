export class MarkConfig {
    constructor() {
        // 泵站
        this.simpleMark1Config = {
            label: {
                text: "",
                pixelOffset: {
                    offSetY: -46,
                    offSetX: 0
                },
                font: "14px MicrosoftYaHei",
                backgroundColor: {
                    color: "#050e1c",
                    alpha: "0.7"
                },
                backgroundPadding: {
                    x: 5,
                    y: 5
                }
            },
            billboard: {
                uri: "",
                width: 150,
                height: 150
            }
        };
        // 管网
        this.simpleMark2Config = {
            label: {
                text: "",
                pixelOffset: {
                    offSetY: -13,
                    offSetX: 0
                },
                backgroundColor: {
                    color: "#050e1c",
                    alpha: "0.7"
                },
                backgroundPadding: {
                    x: 8,
                    y: 8
                },
                font: "12px monospace MicrosoftYaHei"
            },
            billboard: {
                uri: "",
                width: 120,
                height: 93
            }
        };
        // 污水处理厂
        this.simpleMark3Config = {
            billboard: {
                uri: require("../static/map/map_point/SewagePlant.png").default,
                width: 200,
                height: 228.99
            }
        };
        // 泵站详细
        this.complexMark1Config = {
            markMain: {
                label: {
                    text: "",
                    pixelOffset: {
                        offSetY: -60,
                        offSetX: -40
                    },
                    font: "13px MicrosoftYaHei",
                    fillColor: {
                        color: "rgba(17, 179, 255, 1)"
                    },
                    backgroundColor: {
                        color: "#050e1c",
                        alpha: "0.7"
                    },
                    backgroundPadding: {
                        x: 4,
                        y: 4
                    }
                },
                billboard: {
                    uri: "",
                    width: 170,
                    height: 211.033318
                }
            },
            mark1: {
                label: {
                    text: "",
                    pixelOffset: {
                        offSetY: 0,
                        offSetX: 9
                    },
                    font: "12px MicrosoftYaHei",
                    fillColor: {
                        color: "rgba(17, 179, 255, 1)"
                    },
                    backgroundColor: {
                        color: "#050e1c",
                        alpha: "0.7"
                    },
                    backgroundPadding: {
                        x: 1,
                        y: 1
                    }
                }
            },
            mark2: {
                label: {
                    text: "",
                    pixelOffset: {
                        offSetY: 0,
                        offSetX: 53
                    },
                    font: "12px MicrosoftYaHei",
                    fillColor: {
                        color: "white"
                    },
                    backgroundColor: {
                        color: "#050e1c",
                        alpha: "0.7"
                    },
                    backgroundPadding: {
                        x: 1,
                        y: 1
                    }
                }
            }
        }
        // 泵站名称和位置的对应关系
        this.pumPisitionRelations =
        {
            "新区": { lng: 119.92334412310579, lat: 32.45912334897602 },
            "鼓楼": { lng: 119.91918913656353, lat: 32.481450935724775 },
            "人民路": { lng: 119.91055736828286, lat: 32.49494268493277 },
            "泰山路": { lng: 119.90139987824196, lat: 32.48915927032641 },
            "济川路": { lng: 119.90996981772506, lat: 32.47539126999119 },
            "莲花三号区": { lng: 119.91180641989244, lat: 32.46098000150059 },
            "朝阳河": { lng: 119.90508780781307, lat: 32.446050056268285 },
            "西湖翠苑": { lng: 119.90369246576563, lat: 32.44507556175562 },
            "迎春路": { lng: 119.9576542913741, lat: 32.488150034637119 },
            "凤凰河": { lng: 119.92617699173111, lat: 32.4443045199755 },
            "东风路": { lng: 119.93101003668586, lat: 32.455581289890196 },
            "周山河": { lng: 119.92695697011298, lat: 32.43318249703584 },
            "春兰南路": { lng: 119.94700879769024, lat: 32.433971309060905 },
            "淮河路": { lng: 119.93334785766613, lat: 32.419625758085464 }
        }
        // 污水处理厂位置：
        this.sewagePlantPosition = { lng: 119.94865401261642, lat: 32.47677069761139 };
        // 管网位置
        this.pipeNetworkPitionRelations = [
            { lng: 119.92334412310579, lat: 32.45912334897602 },
            { lng: 119.91918913656353, lat: 32.481450935724775 },
            { lng: 119.91055736828286, lat: 32.49494268493277 },
            { lng: 119.90139987824196, lat: 32.48915927032641 },
            { lng: 119.90996981772506, lat: 32.47539126999119 }
        ]
        // simpleMarK1状态和图片对应关系
        this.simpleMarK1ImgUriRelations = {
            "error": require("../static/map/map_point/map_point1.png").default,
            "normal": require("../static/map/map_point/map_point2.png").default,
            "warning": require("../static/map/map_point/map_point3.png").default
        };
        // simpleMark2图片和状态对应关系
        this.simpleMark2ImgUriRelations = {
            "0": require("../static/map/map_point/map_icon1.png").default,
            "1": require("../static/map/map_point/map_icon2.png").default,
            "2": require("../static/map/map_point/map_icon3.png").default,
            "3": require("../static/map/map_point/map_icon4.png").default,
            "4": require("../static/map/map_point/map_icon5.png").default,
            "5": require("../static/map/map_point/point1.png").default,
            "6": require("../static/map/map_point/point2.png").default,
            "7": require("../static/map/map_point/point3.png").default,
            "8": require("../static/map/map_point/point4.png").default,
            "9": require("../static/map/map_point/point5.png").default,
        };
        // complexMarK1状态和图片对应关系
        this.complexMarK1ImgUriRelations = {
            "error": require("../static/map/map_point/map_point01.png").default,
            "normal": require("../static/map/map_point/map_point02.png").default,
            "warning": require("../static/map/map_point/map_point03.png").default
        };
        // complexMarK1左边文字换行长度
        this.complexMark1LeftTextLineFeedLength = 4;
    }

    getPumpPositionByName(name) {
        return this.pumPisitionRelations[name];
    }

    getPipeNetworkPition() {
        return this.pipeNetworkPitionRelations[Math.round(Math.random() * this.pipeNetworkPitionRelations.length)]
    }

    getSimpleMarK1ImgUriByState(state) {
        return this.simpleMarK1ImgUriRelations[state];
    }

    getSimpleMarK2ImgUriByState(state) {
        console.log(this.simpleMark2ImgUriRelations);
        return this.simpleMarK2ImgUriRelations[state.toString()];
    }

    getComplexMarK1ImgUriByState(state) {
        return this.complexMarK1ImgUriRelations[state];
    }

}