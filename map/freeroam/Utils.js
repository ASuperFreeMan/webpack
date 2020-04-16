export function judgeMent(e, eventObj, direction) {
    if (eventObj === "key") {

        if (direction === "up") {

            return (e.keyCode === 87 || e.keyCode === 119 || e.keyCode === 38);

        } else if (direction === "down") {

            return (e.keyCode === 115 || e.keyCode === 83 || e.keyCode === 40);

        } else if (direction === "left") {

            return (e.keyCode === 65 || e.keyCode === 97 || e.keyCode === 37);

        } else if (direction === "right") {

            return (e.keyCode === 68 || e.keyCode === 100 || e.keyCode === 39);

        }

    } else if (eventObj === "mouse") {

        let domWith = $(document).width();
        let domHeight = $(document).height();

        if (direction === "up") {

            return (
                e.y < domHeight / 2 &&
                (
                    (e.x > domWith / 2 && e.x - domWith / 2 < domHeight / 2 * Math.tan(10 * Math.PI / 180))
                    || (e.x < domWith / 2 && domWith / 2 - e.x < domHeight / 2 * Math.tan(10 * Math.PI / 180))
                )
            );

        } else if (direction === "down") {

            return (
                e.y > domHeight * (2 / 3) &&
                (
                    (e.x > domWith / 2 && e.x - domWith / 2 < domHeight * (1 / 3) * Math.tan(10 * Math.PI / 180))
                    || (e.x < domWith / 2 && domWith / 2 - e.x < domHeight * (1 / 3) * Math.tan(10 * Math.PI / 180))
                )
            );

        } else if (direction === "left") {

            return (
                e.x < domWith / 2 && domWith / 2 - e.x > domHeight / 2 * Math.tan(10 * Math.PI / 180)
            );

        } else if (direction === "right") {

            return (
                e.x > domWith / 2 && e.x - domWith / 2 > domHeight / 2 * Math.tan(10 * Math.PI / 180)
            );

        }
    }

}

// 计算相机沿焦点方向前进一段距离后新的相机和焦点坐标
export function computeNewPositionAndTarget(position, target, n, direction, roam) {

    let newPositionZ;
    let newPositionX;
    let newTargetZ;
    let newTargetX;

    position = JSON.parse(JSON.stringify(position));
    target = JSON.parse(JSON.stringify(target));

    let theta = Math.atan((roam.curTarget().z - roam.curPosition().z) / (roam.curTarget().x - roam.curPosition().x));

    // 焦点在相机左上 || 焦点在相机左下
    if (target.z <= position.z && target.x <= position.x
        || target.z >= position.z && target.x <= position.x) {

        if (direction === "up") {
            newPositionZ = position.z - n * Math.sin(theta);
            newPositionX = position.x - n * Math.cos(theta);
            newTargetZ = target.z - n * Math.sin(theta);
            newTargetX = target.x - n * Math.cos(theta);
        } else if (direction === "down") {
            newPositionZ = position.z + n * Math.sin(theta);
            newPositionX = position.x + n * Math.cos(theta);
            newTargetZ = target.z + n * Math.sin(theta);
            newTargetX = target.x + n * Math.cos(theta);
        }

    }
    // 焦点在相机右下 || 焦点在相机右上
    else if (target.z >= position.z && target.x >= position.x
        || target.z <= position.z && target.x >= position.x) {

        if (direction === "up") {
            newPositionZ = position.z + n * Math.sin(theta);
            newPositionX = position.x + n * Math.cos(theta);
            newTargetZ = target.z + n * Math.sin(theta);
            newTargetX = target.x + n * Math.cos(theta);
        } else if (direction === "down") {
            newPositionZ = position.z - n * Math.sin(theta);
            newPositionX = position.x - n * Math.cos(theta);
            newTargetZ = target.z - n * Math.sin(theta);
            newTargetX = target.x - n * Math.cos(theta);
        }

    }

    return {
        position: { x: newPositionX, y: position.y, z: newPositionZ },
        target: { x: newTargetX, y: target.y, z: newTargetZ }
    }
}

// 计算当前相机在指定方向上的新焦点位置
export function computeNewTargetOfCamera(curTarget, curPosition, nextPosition, length, direction, theta) {

    let newTarget = { y: curTarget.y };
    let curTheta;

    if (theta !== undefined) {
        curTheta = theta;
    } else {
        curTheta = Math.atan((nextPosition.z - curPosition.z) / (nextPosition.x - curPosition.x));
    }

    // 下一个点在上一个点的左上 || 左下
    if (nextPosition.z <= curPosition.z && nextPosition.x <= curPosition.x
        || nextPosition.z >= curPosition.z && nextPosition.x <= curPosition.x) {

        if (direction === "up") {

            newTarget.z = curPosition.z - length * Math.sin(curTheta);
            newTarget.x = curPosition.x - length * Math.cos(curTheta);

        } else if (direction === "down") {

            newTarget.z = curPosition.z + length * Math.sin(curTheta);
            newTarget.x = curPosition.x + length * Math.cos(curTheta);

        }

    }
    // 下一个点在上一个点的右下 || 右上
    else if (nextPosition.z >= curPosition.z && nextPosition.x >= curPosition.x
        || nextPosition.z <= curPosition.z && nextPosition.x >= curPosition.x) {

        if (direction === "up") {

            newTarget.z = curPosition.z + length * Math.sin(curTheta);
            newTarget.x = curPosition.x + length * Math.cos(curTheta);

        } else if (direction === "down") {

            newTarget.z = curPosition.z - length * Math.sin(curTheta);
            newTarget.x = curPosition.x - length * Math.cos(curTheta);

        }

    }

    return newTarget;
}