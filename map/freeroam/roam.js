class Roam {

    constructor(viewer) {

        this.viewer = viewer;

    }

    lookAt(position, target) {
        let angle = Math.atan((target.z - position.z) / (target.x / position.x));
        let pitch = this.viewer.scene.camera.pitch;
        pitch += angle * Math.PI / 180;
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, deviation, 100), // 点的坐标
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(pitch),
                roll: 0.0                             // default value
            },
            complete: function () {
            }
        });
    }

    curPosition() {
        let cartesian3 = this.viewer.scene.camera.positionWC;
        return { x: cartesian3.x, y: cartesian3.y, z: cartesian3.z };
    }

    curTarget() {

        let x = this.viewer.scene.camera.heading;


    }
}