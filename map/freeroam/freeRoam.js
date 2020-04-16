import { judgeMent, computeNewPositionAndTarget, computeNewTargetOfCamera } from './Utils'
import { Graph } from './Graph';
import { houseCoords } from './houseCoords';
import { FreeRoamConfiguration } from './freeRoamConfiguration';
import { HouseFreeRoamConfig } from './houseFreeRoamConfig';

export class FreeRoam {
    constructor(roam) {

        this.roam = roam;

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
        this.moveDirection = [];
        // 记录接下来要走的点
        this.nextCoordsCode = [];
        // 相机最近经过的点
        this.cameraJustPassedCoord;
        // 设置相机坐标Y轴
        this.positionY = FreeRoamConfiguration.positionY;
        // 设置焦点坐标Y轴
        this.targetY = FreeRoamConfiguration.targetY;
        // 一次前进距离
        this.onceForwardDistance = FreeRoamConfiguration.onceForwardDistance;
        // 一次后退距离
        this.onceBackwardDistance = FreeRoamConfiguration.onceBackwardDistance;
        // 坐标点检测范围（相机到达某一坐标点范围内后会被检测到）,值是一次前进距离的一半
        this.detectionRange = FreeRoamConfiguration.detectionRange;

        // 设定相机与焦点之间的水平距离
        this.horizontalDistanceBetweenCameraAndTarget = FreeRoamConfiguration.horizontalDistanceBetweenCameraAndTarget;

        // 镜头刚旋转时相机及焦点的位置
        this.oldPosition;
        this.oldTarget;

        // 键盘事件、鼠标点击事件对象
        this.keyDownEventFn;

        // 记录之前相机状态
        this.oldState;

        this.coordObj;

        this.coordName;
    }

    setSize(width, height) {
        this.index.setSize(width, height);
    }

    // 移除鼠标事件和键盘事件
    removeEvents() {
        document.removeEventListener("keydown", this.keyDownEventFn);
    }

    // 配置鼠标事件和键盘事件
    addEvents() {
        this.removeEvents();
        this.setKeyboardEvents();
    }

    // 根据传入参数定位巡检
    startByParam(coordName) {

        this.coordName = coordName;

        this.initTheRelationOfVertexsToCoords();

        let curPoint, nextPoint;
        if (coordName == "house") {
            curPoint = houseCoords[0][0];
            nextPoint = houseCoords[0][1];

            this.positionY = HouseFreeRoamConfig.positionY;
            this.targetY = HouseFreeRoamConfig.targetY;
            this.onceForwardDistance = HouseFreeRoamConfig.onceForwardDistance;
            this.onceBackwardDistance = HouseFreeRoamConfig.onceBackwardDistance;
            this.detectionRange = HouseFreeRoamConfig.detectionRange;
        } else if (coordName == "quarters") {
            curPoint = quartersCoords[0][0];
            nextPoint = quartersCoords[0][1];

            this.positionY = FreeRoamConfiguration.positionY;
            this.targetY = FreeRoamConfiguration.targetY;
            this.onceForwardDistance = FreeRoamConfiguration.onceForwardDistance;
            this.onceBackwardDistance = FreeRoamConfiguration.onceBackwardDistance;
            this.detectionRange = FreeRoamConfiguration.detectionRange;
        }
        this.start("0[0]", curPoint, "0[1]", nextPoint);
    }

    // 从初始位置开始巡检
    start(cur, curPoint, next, nextPoint) {
        if (cur !== undefined && curPoint !== undefined && next !== undefined && nextPoint !== undefined) {
            curPoint.y = this.positionY;
            nextPoint.y = this.targetY;
            this.roam.lookAt(
                curPoint, nextPoint
            );
            this.moveDirection.length = 0;
            this.moveDirection.push(cur, next);
        } else {
            this.positionY = FreeRoamConfiguration.positionY;
            this.targetY = FreeRoamConfiguration.targetY;
            this.onceForwardDistance = FreeRoamConfiguration.onceForwardDistance;
            this.onceBackwardDistance = FreeRoamConfiguration.onceBackwardDistance;
            this.detectionRange = FreeRoamConfiguration.detectionRange;

            this.initTheRelationOfVertexsToCoords(quartersCoords);
            quartersCoords[0][0].y = this.positionY;
            quartersCoords[0][1].y = this.targetY;
            this.roam.lookAt(
                quartersCoords[0][0], quartersCoords[0][1]
            );
            this.moveDirection.length = 0;
            this.moveDirection.push("0[0]", "0[1]");
        }

        this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

        this.changeFlag = false;

        this.atForkRoadRotateFlag = false;

        // 移除cameraControls中的监听事件
        // this.pick.getCore().removeAllListenerEventsFromCameraControls();

        this.addEvents();
    }

    end() {
        this.removeEvents();
        // this.pick.getCore().addAllListenerEventsFromCameraControls();
        if (this.coordName == "house") {
            this.roam.lookAt(
                houseCoords[0][0], houseCoords[0][1]
            );
        } else {
            this.roam.lookAt(
                quartersCoords[0][0], quartersCoords[0][1]
            );
        }

    }

    // 初始化顶点和坐标之间的关系
    initTheRelationOfVertexsToCoords() {

        this.graph = null;
        this.graph = new Graph();

        let newCoords;

        if (this.coordName == "house") {

            newCoords = houseCoords;

            this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "1[0]");
            this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "2[0]");

            this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "3[0]");
            this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "4[0]");

            this.graph.addEdge("4[" + (newCoords[3].length - 1) + "]", "5[0]");
            this.graph.addEdge("4[" + (newCoords[3].length - 1) + "]", "6[0]");

            this.graph.addEdge("5[" + (newCoords[5].length - 1) + "]", "7[0]");
            this.graph.addEdge("5[" + (newCoords[5].length - 1) + "]", "8[0]");

            this.graph.addEdge("7[" + (newCoords[5].length - 1) + "]", "9[0]");
            this.graph.addEdge("7[" + (newCoords[5].length - 1) + "]", "10[0]");

        } else {

            newCoords = quartersCoords;

            this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "1[0]");
            this.graph.addEdge("0[" + (newCoords[0].length - 1) + "]", "2[0]");

            this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "3[0]");
            this.graph.addEdge("1[" + (newCoords[1].length - 1) + "]", "12[0]");

            this.graph.addEdge("2[" + (newCoords[2].length - 1) + "]", "4[0]");
            this.graph.addEdge("2[" + (newCoords[2].length - 1) + "]", "13[0]");

            this.graph.addEdge("3[" + (newCoords[3].length - 1) + "]", "5[0]");
            this.graph.addEdge("3[" + (newCoords[3].length - 1) + "]", "6[0]");

            this.graph.addEdge("4[" + (newCoords[4].length - 1) + "]", "5[" + (newCoords[5].length - 1) + "]");
            this.graph.addEdge("4[" + (newCoords[4].length - 1) + "]", "7[0]");

            this.graph.addEdge("6[" + (newCoords[6].length - 1) + "]", "8[0]");
            this.graph.addEdge("6[" + (newCoords[6].length - 1) + "]", "12[" + (newCoords[12].length - 1) + "]");

            this.graph.addEdge("7[" + (newCoords[7].length - 1) + "]", "9[0]");
            this.graph.addEdge("7[" + (newCoords[7].length - 1) + "]", "13[" + (newCoords[13].length - 1) + "]");

            this.graph.addEdge("8[" + (newCoords[8].length - 1) + "]", "10[0]");
            this.graph.addEdge("8[" + (newCoords[8].length - 1) + "]", "11[0]");

            this.graph.addEdge("9[" + (newCoords[9].length - 1) + "]", "10[" + (newCoords[10].length - 1) + "]");
            this.graph.addEdge("9[" + (newCoords[9].length - 1) + "]", "11[" + (newCoords[11].length - 1) + "]");

        }

        for (let i = 0; i < Object.keys(newCoords).length; i++) {
            this.addEdge(i, 0, newCoords[i].length - 1);
        }


        this.vertexs = null;
        this.vertexs = new Graph();

        for (let i in newCoords) {
            for (let j = 0; j < newCoords[i].length; j++) {
                this.vertexs.setVertex(i + "[" + j + "]", newCoords[i][j]);
            }
        }

    }

    addEdge(prefix, start, end) {
        for (let i = start; i + 1 <= end; i++) {
            this.graph.addEdge(prefix + "[" + i + "]", prefix + "[" + (i + 1) + "]");
        }
    }

    // 事件开始时的配置
    eventStartConfiguration(range, e) {
        let curPosition = this.roam.curPosition();
        let curTarget = this.roam.curTarget();

        // 处理从前进改为后退或相反的那一瞬间
        if (judgeMent(e, "key", "up")) {
            let curState = "前进";
            if (this.oldState === undefined) {
                this.oldState = curState;
            } else if (this.oldState !== curState) {
                this.oldState = curState;

                // 从后退改为前进时若不在岔路口旋转，则应更新this.moveDirection
                if (!this.atForkRoadRotateFlag) {
                    let from = this.moveDirection[1];
                    let to = this.moveDirection[0];
                    this.moveDirection.length = 0;
                    this.moveDirection.push(from, to);
                }
                this.changeFlag = false;
            }
        } else if (judgeMent(e, "key", "down")) {
            let curState = "后退";
            if (this.oldState === undefined || this.oldState !== curState) {
                this.oldState = curState;

                // 从后退改为前进时若不在岔路口旋转，则应更新this.moveDirection
                if (!this.atForkRoadRotateFlag) {
                    let from = this.moveDirection[1];
                    let to = this.moveDirection[0];
                    this.moveDirection.length = 0;
                    this.moveDirection.push(from, to);
                }
                this.changeFlag = false;
            }
        }

        // 处理不在岔路口时的镜头旋转
        if (this.oldPosition !== undefined && this.oldTarget !== undefined
            &&
            (
                judgeMent(e, "key", "up") || judgeMent(e, "key", "down")
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

            this.cameraJustPassedCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(this.moveDirection[1])));

            let relatedCoords = JSON.parse(JSON.stringify(this.graph.getItem(this.moveDirection[1])));

            this.nextCoordsCode.length = 0;

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
                this.cameraJustPassedCoord.y = this.positionY;
                let nextCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(this.nextCoordsCode[0])));
                if (nextCoord !== null) {

                    let newTarget = {};

                    if (judgeMent(e, "key", "up")) {

                        newTarget = computeNewTargetOfCamera(curTarget, this.cameraJustPassedCoord, nextCoord, this.horizontalDistanceBetweenCameraAndTarget, "up");

                    } else if (judgeMent(e, "key", "down") || judgeMent(e, "key", "down")) {

                        newTarget = computeNewTargetOfCamera(curTarget, this.cameraJustPassedCoord, nextCoord, this.horizontalDistanceBetweenCameraAndTarget, "down");

                    }

                    newTarget.y = this.targetY;
                    this.roam.lookAt(this.cameraJustPassedCoord, newTarget);
                    this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

                    let from = this.moveDirection[1];
                    let to = this.nextCoordsCode[0];
                    this.moveDirection.length = 0;
                    this.moveDirection.push(from, to);
                }

            } else if (this.nextCoordsCode.length === 0) { //到达终点

                this.changeFlag = true;
                this.nextCoordsCode.push(this.moveDirection[0]);

            }
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
    setKeyboardEvents() {

        if (this.keyDownEventFn !== undefined) {
            document.removeEventListener('keydown', this.keyDownEventFn);
        }

        let range = this.detectionRange;
        // 前进一下的距离
        let n = this.onceForwardDistance;

        const self = this;
        document.addEventListener('keydown', this.keyDownEventFn = function (e) {

            self.eventStartConfiguration(range, e);

            // ascll码 87：W  119：w  38：up
            if (judgeMent(e, "key", "up")) {
                self.keyboardChangeLine(e);
                if (!self.changeFlag) {
                    self.cameraForward(n);
                }
            }
            // ascll码 115：S  119：s  38：down
            else if (judgeMent(e, "key", "down")) {
                self.keyboardChangeLine(e);
                if (!self.changeFlag) {
                    self.cameraBackward();
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
    keyboardChangeLine(e) {
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

            this.cameraJustPassedCoord.y = this.positionY;
            let nextCoord = JSON.parse(JSON.stringify(this.vertexs.getItem(resultLengthCode)));
            if (nextCoord !== null) {

                let newTarget = {};

                if (judgeMent(e, "key", "up")) {

                    newTarget = computeNewTargetOfCamera(curTarget, this.cameraJustPassedCoord, nextCoord, this.horizontalDistanceBetweenCameraAndTarget, "up");

                } else if (judgeMent(e, "key", "down")) {

                    newTarget = computeNewTargetOfCamera(curTarget, this.cameraJustPassedCoord, nextCoord, this.horizontalDistanceBetweenCameraAndTarget, "down");

                }

                newTarget.y = this.targetY;
                this.roam.lookAt(this.cameraJustPassedCoord, newTarget);
                this.theta = Math.atan((this.roam.curTarget().z - this.roam.curPosition().z) / (this.roam.curTarget().x - this.roam.curPosition().x));

                this.nextCoordsCode = [resultLengthCode];
                let from = this.moveDirection[1];
                let to = this.nextCoordsCode[0];
                this.moveDirection.length = 0;
                this.moveDirection.push(from, to);

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
    cameraBackward() {
        // 后退一下的距离
        let n = this.onceBackwardDistance;

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
        newTarget = computeNewTargetOfCamera(curTarget, curPosition, curTarget, this.horizontalDistanceBetweenCameraAndTarget, "down");
        newTarget.y = this.targetY;
        this.roam.lookAt(newPosition, newTarget);

        // 逆转移动方向记录
        let from = this.moveDirection[1];
        let to = this.moveDirection[0];
        this.moveDirection.length = 0;
        this.moveDirection.push(from, to);

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
        newTarget = computeNewTargetOfCamera(curTarget, curPosition, curTarget, this.horizontalDistanceBetweenCameraAndTarget, "up", rotationTheta);
        newTarget.y = this.targetY;
        this.roam.lookAt(newPosition, newTarget);

        // 判断是否到了岔路口
        if (this.changeFlag) {
            this.atForkRoadRotateFlag = true;
        }
    }


}



