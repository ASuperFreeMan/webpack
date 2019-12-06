import { MapControls } from './MapControls';

let CreateMapControls = (function () {
    let instance;
    return function (container) {
        if (!instance) {
            instance = new MapControls(container);
        }
        return instance;
    }
})()

export { CreateMapControls };