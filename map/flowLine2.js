
export class FlowLine2 {

    constructor() {

        function PolylineTrailLink2MaterialProperty(color, duration) {
            this._definitionChanged = new Cesium.Event();
            this._color = undefined;
            this._colorSubscription = undefined;
            this.color = color;
            this.duration = duration;
            this._time = (new Date()).getTime();
        }

        Object.defineProperties(PolylineTrailLink2MaterialProperty.prototype, {
            isConstant: {
                get: function () {
                    return false;
                }
            },
            definitionChanged: {
                get: function () {
                    return this._definitionChanged;
                }
            },
            color: Cesium.createPropertyDescriptor('color')
        });
        PolylineTrailLink2MaterialProperty.prototype.getType = function (time) {
            return 'PolylineTrailLink2';
        }
        PolylineTrailLink2MaterialProperty.prototype.getValue = function (time, result) {
            if (!Cesium.defined(result)) {
                result = {};
            }
            result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
            result.image = Cesium.Material.PolylineTrailLink2Image;
            result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
            return result;
        }
        PolylineTrailLink2MaterialProperty.prototype.equals = function (other) {
            return this === other
            // this === other ||
            //     (other instanceof PolylineTrailLink2MaterialProperty &&
            //         Cesium.Property.equals(this._color, other._color))
        }
        Cesium.PolylineTrailLink2MaterialProperty = PolylineTrailLink2MaterialProperty;
        Cesium.Material.PolylineTrailLink2Type = 'PolylineTrailLink2';
        Cesium.Material.PolylineTrailLink2Image = '/static/' + require('../static/map/pipeline/flowLine2.png').default;
        Cesium.Material.PolylineTrailLink2Source = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                      {\n\
                                                           czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                           vec2 st = materialInput.st;\n\
                                                           vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                           material.alpha = colorImage.a * color.a;\n\
                                                           material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                           return material;\n\
                                                       }";
        Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLink2Type, {
            fabric: {
                type: Cesium.Material.PolylineTrailLink2Type,
                uniforms: {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                    image: Cesium.Material.PolylineTrailLink2Image,
                    time: 0
                },
                source: Cesium.Material.PolylineTrailLink2Source
            },
            translucent: function (material) {
                return true;
            }
        });

    }
}

