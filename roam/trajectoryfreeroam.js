import { judgeMent, computeNewPositionAndTarget, computeNewTargetOfCamera } from './Utils'
import { Graph } from './Graph';
import { newCoords } from './coords';
import { AutoCreatePipeLine } from './autoCreatePipeLine';

import { HideRoad } from './hideRoads';

export class TrajectoryFreeroam {
    constructor(container, urls, urls2, dracoLibUrl, url3, bgImgUrl, x, z, id) {
        this.autoCreatePipeLine = new AutoCreatePipeLine(container, urls, urls2, dracoLibUrl, url3, bgImgUrl);
        const self = this;
        this.autoCreatePipeLine.init(function (x, z, id) {
            self.startByParam(x, z, id);
        }, x, z, id);

        this.roam = this.autoCreatePipeLine.roam;
        this.pick = this.autoCreatePipeLine.pick;

        this.hideRoad = new HideRoad(this.autoCreatePipeLine.modelHide, this.autoCreatePipeLine.textureTool);

        // 记录相机和焦点的连线与x轴的夹角
        this.theta;
        // 记录有没有到岔路口
        this.changeFlag = false;
        // 记录有没有在岔路口旋转
        this.atForkRoadRotateFlag = false;
        // 记录顶点编号对应坐标
        this.vertexs;
        // 记录点与点之间的关系
        this.graph;
        // 记录当前朝向
        this.moveDirection;
        // 记录接下来要走的点
        this.nextCoordsCode = [];
        // 相机最近经过的点
        this.curCoord;
        // 设置相机坐标Y轴
        this.positionY = 5;
        // 设置焦点坐标Y轴
        this.targetY = 4;

        // 设定相机与焦点之间的水平距离
        this.length = 20;

        // 镜头刚旋转时相机及焦点的位置
        this.oldPosition;
        this.oldTarget;

        // 键盘事件、鼠标点击事件对象
        this.keyDownEventFn;
        this.mouseDownEventFn;

        // 记录之前相机状态
        this.oldState;
    }


    showFlowTo(urlImg) {
        this.hideRoad.showFlowTo(this.autoCreatePipeLine.pipeline_all, urlImg)
    }

    getHideRoadObject() {
        return this.hideRoad;
    }

    getAutoCreatePipeLineObject() {
        return this.autoCreatePipeLine;
    }

    setSize(width, height) {
        this.roam.getCore().resetSize(width, height);
    }

    getNewCoords() {
        return newCoords;
    }


    startByParam(x, z, id) {
        if (x !== undefined && z !== undefined && id !== undefined) {
            for (let i = 0; i + 1 < newCoords[id].length; i++) {
                let curPoint = newCoords[id][i];
                let nextPoint = newCoords[id][i + 1];
                if ((curPoint.x <= x && x <= nextPoint.x) || (curPoint.z <= z && z <= nextPoint.z)) {
                    this.start(id + "[" + i + "]", curPoint, id + "[" + (i + 1) + "]", nextPoint);
                    break;
                }
            }
        }
    }

    start(cur, curPoint, next, nextPoint) {
        if (cur !== undefined && curPoint !== undefined && next !== undefined && nextPoint !== undefined) {
            curPoint.y = this.positionY;
            nextPoint.y = this.targetY;
            this.roam.lookAt(
                curPoint, nextPoint
            );
            this.moveDirection = [cur, next];
        } else {
            newCoords[0][0].y = this.positionY;
            newCoords[0][1].y = this.targetY;
            this.roam.lookAt(
                newCoords[0][0], newCoords[0][1]
            );
            this.moveDirection = ["0[0]", "0[1]"];
        }

        this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

        // 移除cameraControls中的监听事件
        this.pick.getCore().removeAllListenerEventsFromCameraControls();

        this.init();
        this.setClickMouseEvents();
        this.setKeyEvents();
    }

    end() {
        document.removeEventListener("keydown", this.keyDownEventFn);
        document.removeEventListener("mousedown", this.mouseDownEventFn);

        this.pick.getCore().addAllListenerEventsFromCameraControls();
        this.roam.lookAt(camera.position, camera.target);
    }


    init() {

        this.vertexs = new Graph();

        // let k = 0;
        for (let i in newCoords) {
            for (let j = 0; j < newCoords[i].length; j++) {
                this.vertexs.setVertex(i + "[" + j + "]", newCoords[i][j]);
            }
        }

        this.graph = new Graph();

        this.addEdge(0, 0, newCoords[0].length - 1);
        this.addEdge(1, 0, newCoords[1].length - 1);
        this.addEdge(2, 0, newCoords[2].length - 1);
        this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "1[0]");
        this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "2[0]");
        this.addEdge(3, 0, newCoords[3].length - 1);
        this.addEdge(4, 0, newCoords[4].length - 1);
        this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "3[0]");
        this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "4[0]");

    }

    addEdge(prefix, start, end) {
        for (let i = start; i + 1 <= end; i++) {
            this.graph.addEdge(prefix + "[" + i + "]", prefix + "[" + (i + 1) + "]");
        }
    }

    // 事件开始时的配置
    dataInit(range, e) {
        let curPosition = this.roam.curPosition();
        let curTarget = this.roam.curTarget();

        // 处理从前进改为后退或相反的那一瞬间
        if (judgeMent(e, "key", "up") || judgeMent(e, "mouse", "up")) {
            let curState = "前进";
            if (this.oldState === undefined) {
                this.oldState = curState;
            } else if (this.oldState !== curState) {
                this.oldState = curState;

                // 从后退改为前进时若不在岔路口旋转，则应更新this.moveDirection
                if (!this.atForkRoadRotateFlag) {
                    let from = this.moveDirection[1];
                    let to = this.moveDirection[0];
                    this.moveDirection = [from, to];
                }
                this.changeFlag = false;
            }
        } else if (judgeMent(e, "key", "down") || judgeMent(e, "mouse", "down")) {
            let curState = "后退";
            if (this.oldState === undefined || this.oldState !== curState) {
                this.oldState = curState;

                // 从后退改为前进时若不在岔路口旋转，则应更新this.moveDirection
                if (!this.atForkRoadRotateFlag) {
                    let from = this.moveDirection[1];
                    let to = this.moveDirection[0];
                    this.moveDirection = [from, to];
                }
                this.changeFlag = false;
            }
        }

        // 处理不在岔路口时的镜头旋转
        if (this.oldPosition !== undefined && this.oldTarget !== undefined
            &&
            (
                judgeMent(e, "key", "up") || judgeMent(e, "key", "down")
                || judgeMent(e, "mouse", "up") || judgeMent(e, "mouse", "down")
            )

        ) {
            if (!this.atForkRoadRotateFlag) {
                let r = Math.pow(this.oldTarget.z - this.oldPosition.z, 2) + Math.pow(this.oldTarget.x - this.oldPosition.x, 2);
                let hypotenuse = r + r; // 斜边的平方
                let curLength = Math.pow(this.oldTarget.z - this.roam.curTarget().z, 2) + Math.pow(this.oldTarget.x - this.roam.curTarget().x, 2);
                if (curLength > hypotenuse) {
                    this.cameraReverse();
                    curPosition = this.roam.curPosition();
                    curTarget = this.roam.curTarget();
                } else {
                    curPosition = JSON.parse(JSON.stringify(this.oldPosition));
                    curTarget = JSON.parse(JSON.stringify(this.oldTarget));
                    this.roam.lookAt(curPosition, curTarget);
                }
            }
            this.oldPosition = undefined;
            this.oldTarget = undefined;
        }


        // 判断是否在前进方向的终点附近
        if (this.vertexs.getItem(this.moveDirection[1]).x - range <= curPosition.x && this.vertexs.getItem(this.moveDirection[1]).x + range >= curPosition.x
            && this.vertexs.getItem(this.moveDirection[1]).z - range <= curPosition.z && this.vertexs.getItem(this.moveDirection[1]).z + range >= curPosition.z) {

            this.curCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(this.moveDirection[1])));

            let relatedCoords = JSON.parse(JSON.stringify(this.graph.getItem(this.moveDirection[1])));

            this.nextCoordsCode = [];

            // 通过前进方向排除之前走过的点
            for (let i = 0; i < relatedCoords.length; i++) {
                if (relatedCoords[i] !== this.moveDirection[0]) {
                    this.nextCoordsCode.push(relatedCoords[i]);
                }
            }

            if (this.nextCoordsCode.length > 1) { // 在岔路口处，包含选择道路的处理逻辑

                this.changeFlag = true;

            } else if (this.nextCoordsCode.length === 1) { // 前方只有一个点
                this.changeFlag = false;
                this.curCoord.y = this.positionY;
                let nextCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(this.nextCoordsCode[0])));
                if (nextCoord !== null) {

                    let newTarget = {};

                    if (judgeMent(e, "key", "up") || judgeMent(e, "mouse", "up")) {

                        newTarget = computeNewTargetOfCamera(curTarget, this.curCoord, nextCoord, this.length, "up");

                    } else if (judgeMent(e, "key", "down") || judgeMent(e, "key", "down")) {

                        newTarget = computeNewTargetOfCamera(curTarget, this.curCoord, nextCoord, this.length, "down");

                    }

                    newTarget.y = this.targetY;
                    this.roam.lookAt(this.curCoord, newTarget);
                    this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

                    let from = this.moveDirection[1];
                    let to = this.nextCoordsCode[0];
                    this.moveDirection = [from, to];
                }

            } else if (nextCoordsCode.length === 0) { //到达终点

                changeFlag = true;
                nextCoordsCode.push(moveDirection[0]);

            }
        }

    }

    // 鼠标点击事件
    setClickMouseEvents() {
        let range = 1;
        // 前进一下的距离
        let n = 2;
        let timer;

        // 去除右击默认事件
        document.oncontextmenu = () => {
            return false;
        };

        const self = this;
        document.addEventListener("mousedown", this.mouseDownEventFn = function (e) {

            timer = setInterval(function () {

                if (e.button === 2) {
                    let point = self.pick.getPoint(e.x, e.y);

                    self.dataInit(range, e);

                    // 点击上面
                    if (judgeMent(e, "mouse", "up")) {
                        if (!self.changeFlag) {
                            self.cameraForward(n);
                        }
                    }
                    // 点击右边
                    else if (judgeMent(e, "mouse", "right")) {
                        if (!self.changeFlag) {

                        } else {
                            self.mouseChangeLine(self.nextCoordsCode, point, "right");
                        }

                    }
                    else if (judgeMent(e, "mouse", "left")) {
                        if (!self.changeFlag) {
                            // this.cameraLeftRotation();
                        } else {
                            self.mouseChangeLine(self.nextCoordsCode, point, "left");
                        }
                    }
                    // 点击下面
                    else if (judgeMent(e, "mouse", "down")) {
                        self.keyChangeLine(e);
                        if (!self.changeFlag) {
                            self.cameraBack();
                        }
                    }
                }

            }, 50);

        });

        document.addEventListener("mouseup", function (e) {
            clearInterval(timer);
        })

    }

    // 路线切换配置（鼠标）
    mouseChangeLine(coords, point, direction) {
        if (this.changeFlag && point !== null) {
            let curPosition = this.roam.curPosition();
            let curTarget = this.roam.curTarget();

            // 焦点在相机左上（相机右边就是右上，相机左边就是左下）
            if (curTarget.z <= curPosition.z && curTarget.x <= curPosition.x) {
                // 按下左键
                if (direction === "left") {
                    this.mouseChangeLineDetailJudge(coords, point, "left_upper", "left")
                }
                // 按下右键
                else if (direction === "right") {
                    this.mouseChangeLineDetailJudge(coords, point, "left_upper", "right");
                }
            }
            // 焦点在相机左下（相机右边就是左上，相机左边就是右下）
            else if (curTarget.z >= curPosition.z && curTarget.x <= curPosition.x) {
                // 按下左键
                if (direction === "left") {
                    this.mouseChangeLineDetailJudge(coords, point, "left_lower", "left");
                }
                // 按下右键
                else if (direction === "right") {
                    this.mouseChangeLineDetailJudge(coords, point, "left_lower", "right");
                }
            }
            // 焦点在相机右下（相机右边就是左下，相机左边就是右上）
            else if (curTarget.z >= curPosition.z && curTarget.x >= curPosition.x) {
                // 按下左键
                if (direction === "left") {
                    this.mouseChangeLineDetailJudge(coords, point, "right_lower", "left");
                }
                // 按下右键
                else if (direction === "right") {
                    this.mouseChangeLineDetailJudge(coords, point, "right_lower", "right");
                }
            }
            // 焦点在相机右上（相机右边就是右下，相机左边就是左上）
            else if (curTarget.z <= curPosition.z && curTarget.x >= curPosition.x) {
                // 按下左键
                if (direction === "left") {
                    this.mouseChangeLineDetailJudge(coords, point, "right_upper", "left");
                }
                // 按下右键
                else if (direction === "right") {
                    this.mouseChangeLineDetailJudge(coords, point, "right_upper", "right");
                }
            }

        }
    }

    // 路线切换详细配置（鼠标）
    mouseChangeLineDetailJudge(coords, point, judge1, judge2) {
        let curPosition = this.roam.curPosition();
        let curCoord;
        let finalKey;
        let finalCoord;
        let maxLength = null;
        let expression;

        for (let i = 0; i < coords.length; i++) {

            curCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(coords[i])));

            if (curCoord !== undefined) {
                // 当前相机位置与下一个点的连线与x轴的夹角
                let targetTheta = Math.abs(Math.atan((curCoord.z - curPosition.z) / (curCoord.x - curPosition.x)));

                if (judge1 === "left_upper" && judge2 === "left") {
                    expression = (curCoord.z >= curPosition.z && curCoord.x <= curPosition.x
                        || curCoord.z <= curPosition.z && curCoord.x <= curPosition.x && this.theta > targetTheta);
                } else if (judge1 === "left_upper" && judge2 === "right") {
                    expression = (curCoord.z <= curPosition.z && curCoord.x >= curPosition.x
                        || curCoord.z <= curPosition.z && curCoord.x <= curPosition.x && this.theta < targetTheta);
                } else if (judge1 === "left_lower" && judge2 === "left") {
                    expression = (curCoord.z >= curPosition.z && curCoord.x >= curPosition.x
                        || curCoord.z >= curPosition.z && curCoord.x <= curPosition.x && this.theta < targetTheta);
                } else if (judge1 === "left_lower" && judge2 === "right") {
                    expression = (curCoord.z <= curPosition.z && curCoord.x <= curPosition.x
                        || curCoord.z >= curPosition.z && curCoord.x <= curPosition.x && this.theta > targetTheta);
                } else if (judge1 === "right_lower" && judge2 === "left") {
                    expression = (curCoord.z <= curPosition.z && curCoord.x >= curPosition.x
                        || curCoord.z >= curPosition.z && curCoord.x >= curPosition.x && this.theta > targetTheta);
                } else if (judge1 === "right_lower" && judge2 === "right") {
                    expression = curCoord.z >= (curPosition.z && curCoord.x <= curPosition.x
                        || curCoord.z >= curPosition.z && curCoord.x >= curPosition.x && this.theta < targetTheta);
                } else if (judge1 === "right_upper" && judge2 === "left") {
                    expression = (curCoord.z <= curPosition.z && curCoord.x <= curPosition.x
                        || curCoord.z <= curPosition.z && curCoord.x >= curPosition.x && this.theta < targetTheta);
                } else if (judge1 === "right_upper" && judge2 === "right") {
                    expression = (curCoord.z >= curPosition.z && curCoord.x >= curPosition.x
                        || curCoord.z <= curPosition.z && curCoord.x >= curPosition.x && this.theta > targetTheta);
                }

                if (expression) {

                    let length = this.computeVector(this.curCoord, point);

                    // 找寻向量乘积最大的那个坐标
                    if (maxLength === null || length > maxLength) {
                        maxLength = length;
                        finalKey = coords[i];
                        finalCoord = this.curCoord;
                    }
                }
            } else {
                console.log("我出错了： " + coords[i] + ", 出错函数： this.mouseChangeLineDetailJudge");
            }

        }

        if (finalCoord !== undefined) {
            // 路线切换后进行的配置
            this.roam.lookAt(
                { x: curPosition.x, y: this.positionY, z: curPosition.z },
                { x: finalCoord.x, y: this.targetY, z: finalCoord.z }
            );

            let from = this.moveDirection[1];
            let to = finalKey;
            this.moveDirection = [from, to];
            this.nextCoordsCode = [to];
            this.changeFlag = false;
            this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));
        }
    }

    // 计算向量乘积
    computeVector(coord, point) {
        let curPosition = this.roam.curPosition();
        let vector1X = (point.x - curPosition.x) / Math.sqrt((point.x - curPosition.x) * (point.x - curPosition.x) + (point.z - curPosition.z) * (point.z - curPosition.z));
        let vector1Z = (point.z - curPosition.z) / Math.sqrt((point.x - curPosition.x) * (point.x - curPosition.x) + (point.z - curPosition.z) * (point.z - curPosition.z));

        let vector2X = (coord.x - curPosition.x) / Math.sqrt((coord.x - curPosition.x) * (coord.x - curPosition.x) + (coord.z - curPosition.z) * (coord.z - curPosition.z));
        let vector2Z = (coord.z - curPosition.z) / Math.sqrt((coord.x - curPosition.x) * (coord.x - curPosition.x) + (coord.z - curPosition.z) * (coord.z - curPosition.z));

        return vector1X * vector2X + vector1Z * vector2Z;
    }

    // 键盘事件
    setKeyEvents() {
        let range = 1;
        // 前进一下的距离
        let n = 2;

        const self = this;
        document.addEventListener('keydown', this.keyDownEventFn = function (e) {

            self.dataInit(range, e);

            // ascll码 87：W  119：w  38：up
            if (judgeMent(e, "key", "up")) {
                self.keyChangeLine(e);
                if (!self.changeFlag) {
                    self.cameraForward(n);
                }
            }
            // ascll码 115：S  119：s  38：down
            else if (judgeMent(e, "key", "down")) {
                self.keyChangeLine(e);
                if (!self.changeFlag) {
                    self.cameraBack();
                }
            }
            // ascll码 65：A  97：a  37：left
            else if (judgeMent(e, "key", "left")) {
                self.cameraLeftRotation();
            }
            // ascll码 68：D  100：d  39：right
            else if (judgeMent(e, "key", "right")) {
                self.cameraRightRotation();
            }

        });

    }

    // 键盘切换路线配置
    keyChangeLine(e) {
        let curTarget = this.roam.curTarget();

        // 在岔路口处通过键盘转向，并且按了前进或后退键后找出下一个点和前进方向
        if (this.atForkRoadRotateFlag &&
            (
                judgeMent(e, "key", "up") || judgeMent(e, "key", "down")
            )

        ) {
            let resultLengthCode;
            if (judgeMent(e, "key", "up")) {
                let maxLength = null;
                for (let i = 0; i < this.nextCoordsCode.length; i++) {
                    let cur = JSON.parse(JSON.stringify(this.vertexs.getItem(this.nextCoordsCode[i])));
                    let curlength = this.computeVector(cur, this.roam.curTarget());
                    // 找寻向量乘积最大的那个坐标
                    if (maxLength === null || curlength > maxLength) {
                        maxLength = curlength;
                        resultLengthCode = this.nextCoordsCode[i];
                    }
                }
            } else if (judgeMent(e, "key", "down")) {
                let minLength = null;
                for (let i = 0; i < this.nextCoordsCode.length; i++) {
                    let cur = JSON.parse(JSON.stringify(this.vertexs.getItem(this.nextCoordsCode[i])));
                    let curlength = this.computeVector(cur, this.roam.curTarget());
                    // 找寻向量乘积最小的那个坐标
                    if (minLength === null || curlength < minLength) {
                        minLength = curlength;
                        resultLengthCode = this.nextCoordsCode[i];
                    }
                }
            }

            this.curCoord.y = this.positionY;
            let nextCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(resultLengthCode)));
            if (nextCoord !== null) {

                let newTarget = {};

                if (judgeMent(e, "key", "up")) {

                    newTarget = computeNewTargetOfCamera(curTarget, this.curCoord, nextCoord, this.length, "up");

                } else if (judgeMent(e, "key", "down")) {

                    newTarget = computeNewTargetOfCamera(curTarget, this.curCoord, nextCoord, this.length, "down");

                }

                newTarget.y = this.targetY;
                this.roam.lookAt(this.curCoord, newTarget);
                this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

                this.nextCoordsCode = [resultLengthCode];
                let from = this.moveDirection[1];
                let to = this.nextCoordsCode[0];
                this.moveDirection = [from, to];

                this.atForkRoadRotateFlag = false;
                this.changeFlag = false;
            }
        }
    }

    // 相机前进的配置
    cameraForward(n) {
        let curPosition = this.roam.curPosition();
        let curTarget = this.roam.curTarget();
        let newPosition;
        let newTarget;

        let result = computeNewPositionAndTarget(curPosition, curTarget, n, "up", this.roam);
        newPosition = result.position;
        newTarget = result.target;

        this.roam.lookAt(
            newPosition, newTarget
        );
    }

    // 相机后退的配置
    cameraBack() {
        // 后退一下的距离
        let n = 1;

        let curPosition = this.roam.curPosition();
        let curTarget = this.roam.curTarget();
        let newPosition;
        let newTarget;

        let result = computeNewPositionAndTarget(curPosition, curTarget, n, "down", this.roam);
        newPosition = result.position;
        newTarget = result.target;

        this.roam.lookAt(
            newPosition, newTarget
        );
        this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));
    }

    // 相机逆转的配置
    cameraReverse() {
        let curPosition, curTarget;

        if (this.oldPosition !== undefined && this.oldTarget !== undefined) {
            curPosition = JSON.parse(JSON.stringify(this.oldPosition));
            curTarget = JSON.parse(JSON.stringify(this.oldTarget));
        } else {
            curPosition = this.roam.curPosition();
            curTarget = this.roam.curTarget();
        }

        let newPosition = JSON.parse(JSON.stringify(curPosition));
        let newTarget = {};


        // 逆转镜头方向
        newPosition.y = this.positionY;
        newTarget = computeNewTargetOfCamera(curTarget, curPosition, curTarget, this.length, "down");
        newTarget.y = this.targetY;
        this.roam.lookAt(newPosition, newTarget);

        // 逆转移动方向记录
        let from = this.moveDirection[1];
        let to = this.moveDirection[0];
        this.moveDirection = [from, to];

        // 更改前进的下一个点
        this.nextCoordsCode = [this.moveDirection[1]];

        // 相机转向之后可以前进
        this.changeFlag = false;

        this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));
    }

    // 相机左转的配置
    cameraLeftRotation() {
        this.cameraRotation("left");
    }

    // 相机右转的配置
    cameraRightRotation() {
        this.cameraRotation("right");
    }

    cameraRotation(direction) {
        let curPosition = this.roam.curPosition();
        let curTarget = this.roam.curTarget();
        let rotationTheta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

        if (this.oldPosition === undefined && this.oldTarget === undefined) {
            this.oldPosition = this.roam.curPosition();
            this.oldTarget = this.roam.curTarget();
        }

        let newPosition = JSON.parse(JSON.stringify(curPosition));
        let newTarget = {};

        if (direction === "left") {
            rotationTheta -= 5 * Math.PI / 180;
        } else if (direction === "right") {
            rotationTheta += 5 * Math.PI / 180;
        }

        // 旋转镜头
        newPosition.y = this.positionY;
        newTarget = computeNewTargetOfCamera(curTarget, curPosition, curTarget, this.length, "up", rotationTheta);
        newTarget.y = this.targetY;
        this.roam.lookAt(newPosition, newTarget);

        // 判断是否到了岔路口
        if (this.changeFlag) {
            this.atForkRoadRotateFlag = true;
        }
    }


}



