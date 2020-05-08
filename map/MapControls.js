import { MapConfig } from './MapConfig';
import { MarkConfig } from './MarkConfig';
import { FlowLine } from './flowLine';
import { FlowLine2 } from './flowLine2'
import { AddModel } from './cesiumModel/addModel'

export class MapControls {

	constructor(cesiumContainer, urls) {

		Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NzliNGE3Yy01ZDg2LTRkMDItYmY1Ny01NGRjNDQ2ZWYzZjEiLCJpZCI6MTY0NDAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzA1MjkzODN9._V0nIWioPvgBBye2HgyfRi4bcl6JJIjnviYk__qg4hI';

		this.viewer = new Cesium.Viewer(cesiumContainer, {
			geocoder: false, //是否显示地名查找控件
			homeButton: false, //是否显示Home按钮
			sceneModePicker: false, //是否显示投影方式控件
			baseLayerPicker: false, //是否显示图层选择控件
			navigationHelpButton: false, //是否显示帮助信息控件

			animation: false,  // 是否创建“动画”窗口小部件
			// timeline: false, //是否显示时间线控件
			fullscreenButton: false, //是否显示全屏按钮

			scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
			infoBox: false, //隐藏点击要素后的提示信息

			selectionIndicator: false // 关闭点击绿色框
		});
		console.log(Cesium.VERSION)

		new FlowLine();
		new FlowLine2();

		this.models;

		// 相机是否倾斜
		this.tiltFlag;

		if (MapConfig.cameraTiltDegree != -90) {
			this.tiltFlag = true;
		}

		this.flyEndShowRoute = MapConfig.flyEndShowRoute;
		this.flyEndShowAllMarks = MapConfig.flyEndShowAllMarks;

		// 是否旋转过地球
		this.isEarthRolling = false;
		// 相机近地面距离
		this.nearDistance = MapConfig.nearDistance;
		// 相机远地面距离
		this.farDistance = MapConfig.farDistance;
		// 管网感知相机远地面距离
		this.pipeNetworkPerceptionFarDistance = MapConfig.pipeNetworkPerceptionFarDistance;
		// 自由巡检远地面距离
		this.freeRoamFarDistance = MapConfig.freeRoamFarDistance;
		// 开始位置
		this.startPosition = MapConfig.startPosition;
		// 默认泰州位置
		this.defaultPosition = { x: this.startPosition.x, y: this.startPosition.y, z: this.farDistance };
		// 图标实体集合
		this.markEntities = [];
		// 高亮路线对象
		this.polylineDataSource;
		// 流动路线对象
		this.flowLineDataSource;
		// 管线图标集合
		this.pipelineMarkEntities = [];
		// 发光图片集合
		this.lightImgEntities = [];

		// 正常路线宽度
		this.normalLineWidth = MapConfig.normalLineWidth;
		// 高亮路线宽度
		this.highLineWidth = MapConfig.highLineWidth;
		// 流动线宽度
		this.flowLineWidth = MapConfig.flowLineWidth;
		// 记录上一个nameID
		this.oldHighLineNameID;

		// 左击事件
		this.leftClickHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
		// 鼠标移动事件
		this.mouseHoverHandler;
		// 旋转事件
		this.timeExecution;
		// arcGisMap层级
		this.arcGisMapLayer = 0;
		// 旋转停止时间
		this.clockStopTime = this.viewer.clock.stopTime;
		// 默认时间
		this.defaultTime = MapConfig.defaultTime;

		// 四棱錐图标实体集合
		this.pyramidMarkEntities = [];

		this.init();

		//隐藏版权信息
		this.viewer._cesiumWidget._creditContainer.style.display = "none";
		// 相机缩放最小限制
		this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;
		// 相机缩放最大限制
		this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 6000;
		// 取消拖动事件
		this.viewer.scene.screenSpaceCameraController.enableRotate = false;
		// 取消滚轮事件
		this.viewer.scene.screenSpaceCameraController.enableZoom = false;
		// 取消双击默认效果
		this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		// 不允许倾斜相机
		this.viewer.scene.screenSpaceCameraController.enableTilt = false;
		// 将原来鼠标中键倾斜视图修改为鼠标右键拖动
		this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];
		// 将原来鼠标右键拖动缩放修改为鼠标滚轮滚动
		this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL];

	}

	// 开启渲染循环
	openRenderLoop() {
		this.viewer.useDefaultRenderLoop = true;
	}

	// 关闭渲染循环
	closeRenderLoop() {
		this.viewer.useDefaultRenderLoop = false;
	}


	setMinimumZoomDistance(amount) {
		this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = amount;
	}

	setMaximumZoomDistance(amount) {
		this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = amount;
	}

	// 添加拖动
	addMapDrag() {
		this.viewer.scene.screenSpaceCameraController.enableRotate = true;
	}

	// 取消拖动
	removeMapDrag() {
		this.viewer.scene.screenSpaceCameraController.enableRotate = false;
	}

	// 添加滚动
	addMapWheel() {
		this.viewer.scene.screenSpaceCameraController.enableZoom = true;
	}

	// 取消滚动
	removeMapWheel() {
		this.viewer.scene.screenSpaceCameraController.enableZoom = false;
	}

	// 添加倾斜
	addMapEnableTilt() {
		this.viewer.scene.screenSpaceCameraController.enableTilt = true;
	}

	// 取消倾斜
	removeEnableTilt() {
		this.viewer.scene.screenSpaceCameraController.enableTilt = false;
	}

	// 左键点击事件
	setLeftClickAction(callback, isNotFly) {
		this.removeLeftClickAction();

		const self = this;
		this.leftClickHandler.setInputAction(function (click) {
			//获取地形表面的经纬度高程坐标
			// let ray = self.viewer.camera.getPickRay(click.position);
			// let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
			// let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			// let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
			// let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值

			// let cartographic = self.viewer.camera.positionCartographic;
			// let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
			// let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
			// let height = cartographic.height
			// console.log(lng + "," + lat)

			let position = JSON.parse(JSON.stringify(click.position));
			// position.x = position.x * 2744 / $(window).width();
			// position.y = position.y * 1134 / $(window).height();

			// 获取模型表面的经纬度高程坐标
			let pickedFeature = self.viewer.scene.pick(position);
			if (pickedFeature != undefined && pickedFeature.id && pickedFeature.id._name == "mark" && !pickedFeature.id._id.startsWith(MapConfig.pipeLineIdStart) && !pickedFeature.id._id.startsWith(MapConfig.lightImgIdStart)) {
				let cartesian = new Cesium.Cartesian3(pickedFeature.id._position._value.x, pickedFeature.id._position._value.y, pickedFeature.id._position._value.z);
				let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				let lng = Cesium.Math.toDegrees(cartographic.longitude);
				let lat = Cesium.Math.toDegrees(cartographic.latitude);
				// console.log(lng + ", " + lat)
				if (!isNotFly) {
					self.flyTo(lng, lat, self.nearDistance, undefined, undefined, "near");
				}
				if (callback != undefined) {
					let id = pickedFeature.id._id; // 此处id为图标id
					callback(id);
				}
			}

			let nameId; // 此处nameId为点击获取的路线id
			if (pickedFeature != undefined && pickedFeature.id && pickedFeature.id._id && pickedFeature.id._id.startsWith(MapConfig.lightImgIdStart)) {
				nameId = pickedFeature.id._id.substring(pickedFeature.id._id.indexOf('_') + 1);
			} else if (pickedFeature != undefined && pickedFeature.id.nameID != undefined) {
				nameId = pickedFeature.id.nameID;
			}

			if (callback != undefined && nameId != undefined && nameId <= MapConfig.lineMaxId) {
				// 1经度对应3D模型坐标X轴的长度 => lngToObject3DX
				// 1纬度对应3D模型坐标Z轴的长度 => latToObject3DZ
				const lngToObject3DX = MapConfig.lngToObject3DX, latToObject3DZ = MapConfig.latToObject3DZ;
				// 3D模型坐标系的原点对应经纬度
				const origin = MapConfig.origin;
				// 获取鼠标点击位置经纬度
				let ray = self.viewer.camera.getPickRay(click.position);
				let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
				let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
				let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
				let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
				// console.log("经度：" + lng + ", 纬度： " + lat)
				// 将经纬度转换成3D模型坐标
				let x = lngToObject3DX * (lng - origin.x);
				let z = latToObject3DZ * (lat - origin.z);
				let param = "x=" + x + "&z=" + z + "&id=" + nameId;
				// console.log("param: ........." + param)
				callback(param);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}

	removeLeftClickAction() {
		if (this.leftClickHandler) {
			this.leftClickHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		}
	}

	// hover事件
	setMouseHoverAction() {
		this.removeMouseHoverAction();
		this.mouseHoverHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
		const self = this;
		this.mouseHoverHandler.setInputAction(function (movement) {
			let position = JSON.parse(JSON.stringify(movement.endPosition));
			// position.x = position.x * 2744 / $(window).width();
			// position.y = position.y * 1134 / $(window).height();
			let pickedFeature = self.viewer.scene.pick(position);
			if (pickedFeature != undefined && pickedFeature.id && pickedFeature.id.name == "mark") {
				// let nameId;
				// if (pickedFeature.id.nameID != undefined) {
				// 	nameId = pickedFeature.id.nameID;
				// } else if (pickedFeature.id._id && pickedFeature.id._id.startsWith(MapConfig.lightImgIdStart)) {
				// 	nameId = pickedFeature.id._id.substring(pickedFeature.id._id.indexOf('_') + 1);
				// }
				// if (nameId <= MapConfig.lineMaxId) {
				// 	self.changeHighLightLineStateByNameID(nameId);
				// }
				if (document.body.style.cursor != 'pointer') {
					document.body.style.cursor = 'pointer';
				}
			} else {
				// self.changeHighLightLineStateByNameID();
				if (document.body.style.cursor != 'default') {
					document.body.style.cursor = 'default';
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}

	removeMouseHoverAction() {
		if (this.mouseHoverHandler) {
			this.mouseHoverHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			document.body.style.cursor = 'default';
		}
	}

	// 初始化配置
	init() {
		// this.setMouseHoverAction();
		// this.addDirectionalLight();
	}

	// 销毁配置
	destroy() {

	}

	// 设置概览主视角
	setHomeMainView() {
		this.setDefaultPosition(this.startPosition.x, this.startPosition.y, this.farDistance);
	}

	// 设置管网感知主视角
	setPipeNetworkPerceptionMainView() {
		this.flyTo(MapConfig.pipeNetworkPerceptionMainView.lng, MapConfig.pipeNetworkPerceptionMainView.lat, this.pipeNetworkPerceptionFarDistance);
		this.setDefaultPosition(this.startPosition.x, this.startPosition.y, this.pipeNetworkPerceptionFarDistance);
		this.isEarthRolling = true;
	}

	// 设置泵站监控主视角
	setPumpStationMonitoringMainView() {
		this.flyTo(MapConfig.pumpStationMonitoringMainView.lng, MapConfig.pumpStationMonitoringMainView.lat, this.farDistance);
		this.setDefaultPosition(this.startPosition.x, this.startPosition.y, this.farDistance);
		this.isEarthRolling = true;
	}

	// 设置自由巡检主视角
	setFreeRoamMainView() {
		let height = this.freeRoamFarDistance * Math.sin(35 * Math.PI / 180) + 15.8;
		this.flyTo(MapConfig.freeRoamMainView.lng, MapConfig.freeRoamMainView.lat, height, undefined, undefined, undefined, -35);
		this.setDefaultPosition(MapConfig.freeRoamMainView.lng, MapConfig.freeRoamMainView.lat, height);
		this.isEarthRolling = true;
	}

	// 设置默认位置
	setDefaultPosition(lng, lat, height) {
		this.defaultPosition.x = lng;
		this.defaultPosition.y = lat;
		if (height) {
			this.defaultPosition.z = height;
		}
	}

	// 相机飞行到泰州市海陵区默认位置
	earthRolling(isVisible) {
		let oldTiltFlag = this.tiltFlag;
		// 当前相机高度超过规定高度，需要垂直于地面
		let cartographic = this.viewer.camera.positionCartographic;
		let height = cartographic.height;

		if (height > MapConfig.cameraTiltMaxHight) {
			this.tiltFlag = false;
		}

		if (isVisible && !this.isEarthRolling) {
			const self = this;
			this.setDefaultPosition(this.startPosition.x, this.startPosition.y);
			this.flyTo(this.defaultPosition.x, this.defaultPosition.y, height, function () {
				self.flyTo(self.defaultPosition.x, self.defaultPosition.y, self.defaultPosition.z, function () {
					self.isEarthRolling = true;
					if (oldTiltFlag) {
						self.tiltFlag = true;
						self.flyTo(self.defaultPosition.x, self.defaultPosition.y, self.defaultPosition.z, function () {
							setTimeout(function () {
								if (self.flyEndShowRoute) {
									self.showRoute();
								}
								if (self.flyEndShowAllMarks) {
									self.showAllMarks();
								}
							}, MapConfig.waitTimeForShowIcon);
						})
					} else {
						setTimeout(function () {
							if (self.flyEndShowRoute) {
								self.showRoute();
							}
							if (self.flyEndShowAllMarks) {
								self.showAllMarks();
							}
						}, MapConfig.waitTimeForShowIcon);
					}
				}, MapConfig.flightTime);
			});
		} else {
			if (oldTiltFlag) {
				this.tiltFlag = true;
			}
			this.flyTo(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z);
		}
	}

	// 绕点旋转
	rotateOnPoint(point, time, callback) {
		time = time ? time : 80;
		let options = {
			lng: MapConfig.origin.x,
			lat: MapConfig.origin.z,
			height: 15.8,
			heading: 0.0,
			pitch: 0.0,
			roll: 0.0
		};
		// 给定相机距离点多少距离飞行
		let distance = MapConfig.freeRoamFarDistance;
		// 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
		let pitch = Cesium.Math.toRadians(-35);
		// 给定飞行一周所需时间，比如10s, 那么每秒转动度数
		if (point) {
			options.lng = Number(point.lng);
			options.lat = Number(point.lat);
			pitch = Cesium.Math.toRadians(-40);
			distance = 1219.9986250239356;
		}
		let position = Cesium.Cartesian3.fromDegrees(options.lng, options.lat, options.height);
		// 给定飞行一周所需时间，比如10s, 那么每秒转动度数
		let angle = 360 / time;

		let startTime = Cesium.JulianDate.fromDate(this.defaultTime);
		// let stopTime = Cesium.JulianDate.addSeconds(startTime, time, new Cesium.JulianDate());

		this.viewer.clock.startTime = startTime.clone();  // 开始时间
		this.viewer.clock.stopTime = this.clockStopTime;     // 结束时间
		this.viewer.clock.currentTime = startTime.clone(); // 当前时间
		this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
		this.viewer.clock.shouldAnimate = true;
		// this.viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK  // 时钟设置为当前系统时间; 忽略所有其他设置。
		// 相机的当前heading
		let initialHeading = this.viewer.camera.heading;
		const self = this;
		self.timeExecution = function TimeExecution() {
			// 当前已经过去的时间，单位s
			let delTime = Cesium.JulianDate.secondsDifference(self.viewer.clock.currentTime, self.viewer.clock.startTime);
			let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
			self.viewer.scene.camera.setView({
				destination: position, // 点的坐标
				orientation: {
					heading: heading,
					pitch: pitch,

				}
			});
			self.viewer.scene.camera.moveBackward(distance);

			if (Cesium.JulianDate.compare(self.viewer.clock.currentTime, self.viewer.clock.stopTime) >= 0) {
				self.viewer.clock.onTick.removeEventListener(self.timeExecution);
				if (callback) {
					callback();
				}
			}
		};
		self.viewer.clock.onTick.addEventListener(self.timeExecution);
	}

	stopRotate() {
		if (this.timeExecution) {
			this.viewer.clock.stopTime = this.viewer.clock.startTime;
			this.viewer.clock.onTick.removeEventListener(this.timeExecution);
		}
	}

	hideEarth() {
		this.viewer.scene.globe.show = false;
	}

	showEarth() {
		this.viewer.scene.globe.show = true;
	}

	// 设置地图
	setMap(url, layers) {
		// 移除所有影像图层
		this.viewer.imageryLayers.removeAll();
		// let imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
		//     url: url,
		//     tilingScheme: new Cesium.WebMercatorTilingScheme(),
		//     maximumLevel: 20
		// });

		// let imageryProvider = new Cesium.WebMapServiceImageryProvider({
		//     url: url,
		//     layers: layers,
		//     crs: "EPSG:3785",
		//     tilingScheme: new Cesium.WebMercatorTilingScheme(),
		//     parameters: {
		//         service: 'WMS',
		//         format: 'image/jpeg',
		//         transparent: true,
		//     }
		// });

		// this.viewer.imageryLayers.addImageryProvider(imageryProvider);

		this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
			url: url,
			tilingScheme: new Cesium.WebMercatorTilingScheme(),
			minimumLevel: 1,
			maximumLevel: 20
		}));
	}

	// 设置地图
	setArcGisMap(url, layers) {

		layers = (layers != "" && layers != undefined) ? layers : undefined;

		let imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
			url: url,
			// tilingScheme: new Cesium.WebMercatorTilingScheme(),
			tileDiscardPolicy: new Cesium.NeverTileDiscardPolicy(),
			layers: layers
		});

		this.viewer.imageryLayers.addImageryProvider(imageryProvider);

		this.arcGisMapLayer = 1;

		this.hideArcGisMap();

	}

	showArcGisMap() {
		if (this.arcGisMapLayer === 0) {
			let imageryProvider1 = this.viewer.imageryLayers.get(this.arcGisMapLayer + 1);
			if (imageryProvider1) {
				// imageryProvider.show = true;
				this.viewer.imageryLayers.lowerToBottom(imageryProvider1)
				this.arcGisMapLayer = 1;
			}
		}
	}

	hideArcGisMap() {
		if (this.arcGisMapLayer === 1) {
			let imageryProvider1 = this.viewer.imageryLayers.get(this.arcGisMapLayer);
			if (imageryProvider1) {
				// imageryProvider.show = false;
				this.viewer.imageryLayers.lowerToBottom(imageryProvider1)
				this.arcGisMapLayer = 0;
			}
		}
	}

	// 飞行到指定位置
	flyTo(lng, lat, height, callback, duration, distanceState, newPitch, newHeading) {
		// let cartographic = this.viewer.camera.positionCartographic;
		lng = Number(lng);
		lat = Number(lat);
		let heading = newHeading ? Number(newHeading) : 0;
		// 偏差值
		let deviation;
		if (distanceState == "near") {
			deviation = lat - MapConfig.nearDistanceDeviation;
		} else if (distanceState == "normal") {
			deviation = lat;
		} else {
			deviation = lat - MapConfig.farDistanceDeviation;
		}

		let pitch = -90;
		if (this.tiltFlag) {
			pitch = MapConfig.cameraTiltDegree;
		}
		if (newPitch) {
			pitch = newPitch;
		}
		this.viewer.scene.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
			orientation: {
				heading: Cesium.Math.toRadians(heading),      // east, default value is 0.0 (north)
				pitch: Cesium.Math.toRadians(pitch),     // default value (looking down)
				roll: 0.0                               // default value
			},
			duration: duration,
			complete: function () {
				if (callback != undefined) {
					callback();
				}
			}
		});
	}

	// 设置相机位置
	setView(lng, lat, height, distance) {
		// 偏差值
		let deviation = lat - MapConfig.farDistanceDeviation;
		const self = this;
		this.viewer.scene.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(lng, deviation, height), // 点的坐标
			orientation: {
				heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
				pitch: Cesium.Math.toRadians(MapConfig.cameraTiltDegree),
				roll: 0.0                             // default value
			},
			complete: function () {
				if (distance != undefined) {
					this.viewer.scene.camera.moveBackward(distance);
				}
				self.setDefaultPosition(lng, lat);
			}
		});
	}

	// 添加一个图标
	addMark(id, position, label, billboard) {
		let entity = this.viewer.entities.add({
			id: id,
			name: "mark",
			position: Cesium.Cartesian3.fromDegrees(Number(position.lng), Number(position.lat), 0),
			label: label != undefined ? {
				text: label.text,
				font: label.font != undefined ? label.font : '15px monospace 黑体',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				showBackground: true,
				backgroundPadding: label.backgroundPadding != undefined ? new Cesium.Cartesian2(label.backgroundPadding.x, label.backgroundPadding.y) : new Cesium.Cartesian2(7, 5),
				backgroundColor: label.backgroundColor != undefined ? Cesium.Color.fromCssColorString(label.backgroundColor.color).withAlpha(label.backgroundColor.alpha != undefined ? Number(label.backgroundColor.alpha) : 1) : Cesium.Color.BLACK,
				fillColor: label.fillColor != undefined ? Cesium.Color.fromCssColorString(label.fillColor.color).withAlpha(label.fillColor.alpha != undefined ? Number(label.fillColor.alpha) : 1) : Cesium.Color.WHITE,
				outlineColor: label.outlineColor != undefined ? Cesium.Color.fromCssColorString(label.outlineColor.color).withAlpha(label.outlineColor.alpha != undefined ? Number(label.outlineColor.alpha) : 1) : Cesium.Color.WHITE,
				outlineWidth: label.outlineWidth != undefined ? label.outlineWidth : 0,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				pixelOffset: new Cesium.Cartesian2(label.pixelOffset.offSetX, label.pixelOffset.offSetY),
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight),
				eyeOffset: new Cesium.Cartesian3(0, 0, -100)
			} : {},
			billboard: billboard != undefined ? {
				image: billboard.uri,
				width: billboard.width != undefined ? billboard.width : 700,
				height: billboard.height != undefined ? billboard.height : 500,
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight)
			} : {}
		});
		entity.show = false;
		if (id.startsWith(MapConfig.pipeLineIdStart)) {
			this.pipelineMarkEntities.push(entity);
		} else if (id.startsWith(MapConfig.lightImgIdStart)) {
			this.lightImgEntities.push(entity);
		} else {
			this.markEntities.push(entity);
		}
		// console.log("图标" + id + "生成了");

	}

	// 通过给定配置新增一个图标
	addSimpleMark1ByConfig(id, name, text, state) {
		if (state == undefined) {
			state = "normal";
		}
		let markConfig = new MarkConfig();
		markConfig.simpleMark1Config.billboard.uri = markConfig.getSimpleMarK1ImgUriByState(state);
		markConfig.simpleMark1Config.label.text = text;
		this.addMark(id, markConfig.getPumpPositionByName(name), markConfig.simpleMark1Config.label, markConfig.simpleMark1Config.billboard);
	}

	// 通过给定配置新增一个图标
	addSimpleMark2ByConfig(id, text, state) {
		if (state == undefined) {
			state = "0";
		}
		let markConfig = new MarkConfig();
		markConfig.simpleMark2Config.billboard.uri = markConfig.getSimpleMarK2ImgUriByState(state);
		markConfig.simpleMark2Config.label.text = text;
		this.addMark(id, markConfig.getPipeNetworkPition(), markConfig.simpleMark2Config.label, markConfig.simpleMark2Config.billboard);
	}

	// 通过给定配置新增一个图标
	addSimpleMark3ByConfig(id, name) {
		let markConfig = new MarkConfig();
		this.addMark(id, markConfig.sewagePlantPosition, undefined, markConfig.simpleMark3Config.billboard);
	}

	addComplexMark1ByConfig(id, name, leftText, middleTextList, rightTextList, state) {
		if (state == undefined) {
			state = "normal";
		}
		let markConfig = new MarkConfig();
		markConfig.complexMark1Config.markMain.label.text =
			leftText.length >= markConfig.complexMark1LeftTextLineFeedLength ? leftText.substring(0, markConfig.complexMark1LeftTextLineFeedLength) +
				"\n" + leftText.substring(markConfig.complexMark1LeftTextLineFeedLength) : leftText;
		markConfig.complexMark1Config.markMain.billboard.uri = markConfig.getComplexMarK1ImgUriByState(state);
		this.addMark(id, markConfig.getPumpPositionByName(name), markConfig.complexMark1Config.markMain.label, markConfig.complexMark1Config.markMain.billboard);
		for (let key in middleTextList) {
			markConfig.complexMark1Config.mark1.label.text = middleTextList[middleTextList.length - 1 - key] + ":";
			markConfig.complexMark1Config.mark1.label.pixelOffset.offSetY = -52 + key * -17;
			markConfig.complexMark1Config.mark2.label.text = rightTextList[rightTextList.length - 1 - key]
			markConfig.complexMark1Config.mark2.label.pixelOffset.offSetY = -52 + key * -17;
			this.addMark(id + "markMiddle" + key, markConfig.getPumpPositionByName(name), markConfig.complexMark1Config.mark1.label, markConfig.complexMark1Config.mark1.billboard);
			this.addMark(id + "markRight" + key, markConfig.getPumpPositionByName(name), markConfig.complexMark1Config.mark2.label, markConfig.complexMark1Config.mark2.billboard);
		}

	}

	addMonitorMark(id, position, label, billboard, name) {

	}

	// 批量添加图标
	addMarkList(markData) {
		if (Object.prototype.toString.call(markData) == '[object Array]') {
			for (let i in markData) {
				let mark = markData[i];
				this.addMark(mark.id, mark.position, mark.label, mark.billboard);
			}
		}
	}

	// 展示所有图标
	showAllMarks() {
		for (let i = 0; i < this.markEntities.length; i++) {
			this.markEntities[i].show = true;
			// console.log("图标" + i + "显示了")
		}
	}

	// 隐藏所有图标
	hideAllMarks() {
		for (let i = 0; i < this.markEntities.length; i++) {
			this.markEntities[i].show = false;
		}
	}

	// 批量更新图标数据
	updateMarkList(entityList) {
		if (Object.prototype.toString.call(entityList) == '[object Array]') {
			for (let i = 0; i < entityList.length; i++) {
				let curEntity = entityList[i];
				let cesiumEntity = this.viewer.entities.getById(curEntity.id);
				if (cesiumEntity != undefined) {
					if (curEntity.label != undefined && curEntity.label.text != undefined && cesiumEntity.label.text._value != curEntity.label.text) {
						cesiumEntity.label.text._value = curEntity.label.text;
					}
					if (curEntity.label != undefined && curEntity.label.fillColor != undefined) {
						cesiumEntity.label.fillColor = Cesium.Color.fromCssColorString(curEntity.label.fillColor.color).withAlpha(curEntity.label.fillColor.alpha != undefined ? curEntity.label.fillColor.alpha : 1);
					}
					if (curEntity.billboard != undefined && curEntity.billboard.uri != undefined && cesiumEntity.billboard.image._value != curEntity.billboard.uri) {
						cesiumEntity.billboard.image._value = curEntity.billboard.uri;
					}
				}

			}
		}
	}

	// 通过id更新图标图片
	updateMarkImgById(id, imgUrI) {
		for (let i = 0; i < this.markEntities.length; i++) {
			if (this.markEntities[i].id == id) {
				let curEntity = this.viewer.entities.getById(id);
				this.markEntities[i].billboard.image._value = imgUrI;
				curEntity.billboard.image._value = imgUrI;
				break;
			}
		}
	}

	// 通过id获取图标图片地址
	getMarkImgById(id) {
		for (let i = 0; i < this.markEntities.length; i++) {
			if (this.markEntities[i].id == id) {
				return this.markEntities[i].billboard.image._value;
			}
		}
		return null;
	}


	// 通过id移除图标
	removeMarkById(id) {
		for (var i = 0; i < this.markEntities.length; i++) {
			if (this.markEntities[i].id == id) {
				this.viewer.entities.remove(this.markEntities[i]);
				break;
			}
		}
		this.markEntities.splice(i, 1);
	}

	// 移除所有图标
	removeAllMark() {
		for (let i = 0; i < this.markEntities.length; i++) {
			this.viewer.entities.remove(this.markEntities[i]);
		}
		this.markEntities.length = 0;
	}

	// 添加流动路线
	addFlowLine(url, time) {
		time = time ? time : 2000;

		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.flowLineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length - 7; i++) {
				let r = entities[i];
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.DEEPSKYBLUE, time)
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			for (let j = entities.length - 7; j < entities.length; j++) {
				let r = entities[j];
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLink2MaterialProperty(Cesium.Color.fromCssColorString("#e60012"), time)
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}
		});

	}

	// 设置流动时间
	setFlowLineTime(time) {
		if (this.flowLineDataSource) {
			let entities = this.flowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}
	}

	// 添加高亮路线
	addHighlightRoute(url) {
		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.polylineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.show = false;
				r.nameID = i;   //给每条线添加一个编号，方便之后对线修改样式
				if (i <= MapConfig.lineMaxId) {
					r.polyline.width = self.normalLineWidth;
					r.polyline.material = Cesium.Color.fromCssColorString("#FFAE00");
				} else {
					r.polyline.width = 0;
					r.polyline.material = Cesium.Color.fromCssColorString("#DCDCDC");
				}
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				// 设置这个属性让多边形贴地，ClassificationType.CESIUM_3D_TILE 是贴模型，ClassificationType.BOTH是贴模型和贴地
				// entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN; // 这个配置会引起不知名异常，接下来的代码不执行
			}
		});

		if (Object.prototype.toString.call(MapConfig.pipeLineIconImgUris) == '[object Array]') {
			let positions = MapConfig.pipeLineIconPositions;
			for (let i = 0; i < MapConfig.pipeLineIconImgUris.length; i++) {
				this.addMark(MapConfig.pipeLineIdStart + i, positions[i], undefined, {
					uri: MapConfig.pipeLineIconImgUris[i],
					width: MapConfig.pipeLineIconWidth,
					height: MapConfig.pipeLineIconHeight
				})
			}
		}

		if (Object.prototype.toString.call(MapConfig.lightImgUris) == '[object Array]') {
			let positions = MapConfig.lightImgPositions;
			let lightImgSizes = MapConfig.lightImgSizes;
			for (let i = 0; i < positions.length; i++) {
				this.addMark(MapConfig.lightImgIdStart + i, positions[i], undefined, {
					uri: MapConfig.lightImgUris[i],
					width: lightImgSizes[i].width,
					height: lightImgSizes[i].height
				});
			}
		}
	}

	showLightImgById(id) {
		for (let i = 0; i < this.lightImgEntities.length; i++) {
			if (this.lightImgEntities[i].id == MapConfig.lightImgIdStart + id) {
				this.lightImgEntities[i].show = true;
				break;
			}
		}
	}

	hideLightImgById(id) {
		for (let i = 0; i < this.lightImgEntities.length; i++) {
			if (this.lightImgEntities[i].id == MapConfig.lightImgIdStart + id) {
				this.lightImgEntities[i].show = false;
				break;
			}
		}
	}

	// 移到管线上时管线高亮，移出时管线正常
	changeHighLightLineStateByNameID(nameId) {
		if (nameId != undefined && nameId != this.oldHighLineNameID) {
			// this.setLineMaterial(nameId, "highlight");
			// this.setLineMaterial(this.oldHighLineNameID, "normal");
			if (this.oldHighLineNameID != undefined) {
				this.hideLightImgById(this.oldHighLineNameID);
			}
			this.oldHighLineNameID = nameId;
			this.showLightImgById(nameId);
		} else {
			if (this.oldHighLineNameID != undefined) {
				// this.setLineMaterial(this.oldHighLineNameID, "normal");
				this.hideLightImgById(this.oldHighLineNameID);
				this.oldHighLineNameID = undefined;
			}
		}
	}

	// 设置路线材质
	setLineMaterial(nameid, material) {
		if (this.polylineDataSource != undefined) {
			let entities = this.polylineDataSource.entities.values;
			if (material == "highlight") {
				for (let o = 0; o < entities.length; o++) {
					let m = entities[o];
					if (nameid == o) {
						m.polyline.width = this.highLineWidth;
						m.polyline.material = new Cesium.PolylineGlowMaterialProperty({
							glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
							color: Cesium.Color.fromCssColorString("#FFAE00").withAlpha(0.8)
						})
						break;
					}
				}
			} else if (material == "normal") {
				for (let o = 0; o < entities.length; o++) {
					let m = entities[o];
					if (nameid == o) {
						m.polyline.width = this.normalLineWidth;
						m.polyline.material = new Cesium.ColorMaterialProperty(
							Cesium.Color.fromCssColorString("#FFAE00")
						);
						break;
					}
				}
			}
		}
	}

	// 显示路线
	showRoute() {
		if (this.polylineDataSource != undefined) {
			let entities = this.polylineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = true;
			}
			for (let i = 0; i < this.pipelineMarkEntities.length; i++) {
				this.pipelineMarkEntities[i].show = true;
			}
		}

	}

	// 隐藏路线
	hideRoute() {
		if (this.polylineDataSource != undefined) {
			let entities = this.polylineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
			for (let i = 0; i < this.pipelineMarkEntities.length; i++) {
				this.pipelineMarkEntities[i].show = false;
			}
		}
	}

	// 显示流动路线
	showFLowLine() {
		if (this.flowLineDataSource != undefined) {
			let entities = this.flowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = true;
			}
		}
	}

	// 隐藏流动路线
	hideFlowLine() {
		if (this.flowLineDataSource != undefined) {
			let entities = this.flowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
		}
	}

	// 添加模型
	addModel(urls, callback, postions) {
		this.models = new AddModel(this.viewer, urls, callback, postions);
	}

	showAllModel() {
		if (this.models) {
			this.models.showAllModel();
		}
	}

	hideAllModel() {
		if (this.models) {
			this.models.hideAllModel();
		}
	}


	// 添加四棱锥图标
	addPyramidMark(id, position, label, billboard, color, alpha) {

		id = id ? id : Math.random() + '';
		color = color ? color : '#0028a9';
		alpha = alpha ? alpha : 0.6;

		let lng = Number(position.lng);
		let lat = Number(position.lat);
		let height = Number(position.height);
		let entity1 = this.viewer.entities.add({
			id: id,
			name: 'mark',
			show: true,
			position: Cesium.Cartesian3.fromDegrees(lng, lat, height + 30),
			label: label != undefined ? {
				text: label.text,
				font: label.font != undefined ? label.font : '18px Microsoft YaHei',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				showBackground: true,
				backgroundPadding: label.backgroundPadding != undefined ? new Cesium.Cartesian2(label.backgroundPadding.x, label.backgroundPadding.y) : new Cesium.Cartesian2(7, 5),
				backgroundColor: label.backgroundColor != undefined ? Cesium.Color.fromCssColorString(label.backgroundColor.color).withAlpha(label.backgroundColor.alpha != undefined ? Number(label.backgroundColor.alpha) : 1) : Cesium.Color.BLACK,
				fillColor: label.fillColor != undefined ? Cesium.Color.fromCssColorString(label.fillColor.color).withAlpha(label.fillColor.alpha != undefined ? Number(label.fillColor.alpha) : 1) : Cesium.Color.WHITE,
				outlineColor: label.outlineColor != undefined ? Cesium.Color.fromCssColorString(label.outlineColor.color).withAlpha(label.outlineColor.alpha != undefined ? Number(label.outlineColor.alpha) : 1) : Cesium.Color.WHITE,
				outlineWidth: label.outlineWidth != undefined ? label.outlineWidth : 0,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				pixelOffset: new Cesium.Cartesian2(label.pixelOffset.offSetX, label.pixelOffset.offSetY),
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight),
				eyeOffset: new Cesium.Cartesian3(0, 0, -1)
			} : {},
			billboard: billboard != undefined ? {
				image: billboard.uri,
				pixelOffset: new Cesium.Cartesian2(0, -100),
				width: billboard.width != undefined ? billboard.width : 100,
				height: billboard.height != undefined ? billboard.height : 21.25
			} : {}
		});

		let entity2 = this.viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
			show: true,
			cylinder: {
				//圆锥
				length: 45,
				topRadius: 30,
				bottomRadius: 0,
				material: Cesium.Color.fromCssColorString(color).withAlpha(alpha),
				slices: 4,
				outline: true,
				outlineColor: Cesium.Color.fromCssColorString('#11b3ff')
			}
		});
		let entity3 = this.viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(lng, lat, height + 45),
			show: true,
			// label: {
			// 	//文字标签
			// 	text: name,
			// 	font: "normal 20px MicroSoft YaHei", // 15pt monospace
			// 	style: Cesium.LabelStyle.FILL_AND_OUTLINE,
			// 	fillColor: Cesium.Color.WHITE,
			// 	verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
			// 	pixelOffset: new Cesium.Cartesian2(0, -80),   //偏移量
			// 	showBackground: true,
			// 	backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
			// },
			cylinder: {
				//圆锥
				length: 45,
				topRadius: 0,
				bottomRadius: 30,
				material: Cesium.Color.fromCssColorString(color).withAlpha(alpha),
				slices: 4,
				outline: true,
				outlineColor: Cesium.Color.fromCssColorString('#11b3ff')
			}
		});

		this.pyramidMarkEntities.push(entity1, entity2, entity3);
	}

	// 显示四棱锥图标
	showAllPyramidMark() {
		for (let key in this.pyramidMarkEntities) {
			this.pyramidMarkEntities[key].show = true;
		}
	}

	// 隐藏四棱锥图标
	hideAllPyramidMark() {
		for (let key in this.pyramidMarkEntities) {
			this.pyramidMarkEntities[key].show = false;
		}
	}

	setSceneLightBrightness(brightness) {
		let stages = this.viewer.scene.postProcessStages;
		// this.viewer.scene.brightness = this.viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
		// this.viewer.scene.brightness.enabled = true;
		// this.viewer.scene.brightness.uniforms.brightness = Number(brightness);
		stages.add(Cesium.PostProcessStageLibrary.createLensFlareStage())
	}

	removeSceneLightBrightness() {
		let stages = this.viewer.scene.postProcessStages;
		let stage = stages.get(0);
		if (stage) {
			stages.remove(stage);
		}

	}

	setTime(date) {
		let currentTime = Cesium.JulianDate.fromDate(date);
		let endTime = Cesium.JulianDate.addHours(currentTime, 2, new Cesium.JulianDate());

		this.viewer.clock.currentTime = currentTime;
		this.viewer.timeline.zoomTo(currentTime, endTime);
	}

	addDirectionalLight() {
		let scene = this.viewer.scene;
		scene.globe.enableLighting = true;
		scene.globe.dynamicAtmosphereLighting = true;
		scene.globe.dynamicAtmosphereLightingFromSun = false;

		let sunLight = new Cesium.SunLight()
		scene.light = sunLight;

		this.setTime(this.defaultTime);
	}

}
