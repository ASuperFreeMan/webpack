import { MapConfig } from './MapConfig';
import { MarkConfig } from './MarkConfig';
import { FlowLine } from './flowLine';
import { FlowLine2 } from './flowLine2';
import { AddModel } from './cesiumModel/addModel';
import { BaiduImageryProvider } from './BaiduImageryProvider';

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
		new BaiduImageryProvider();

		this.model = new AddModel(this.viewer, urls);;

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
		// 凤凰路流动路线对象
		this.fengHuangFlowLineDataSource;
		// 济川路流动路线对象
		this.jiChuanFlowLineDataSource;
		// 污水厂尾水流动路线对象
		this.outWuShuiIndustryFlowLineDataSource;
		// 泵站尾水流动路线对象
		this.outPumpFlowLineDataSource;
		// 管线图标集合
		this.pipelineMarkEntities = [];
		// 发光图片集合
		this.lightImgEntities = [];
		// 波纹扩散实体集合
		this.circleRippleEntities = [];

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

		// 偏差的经纬度
		this.deviationLng = 0.0113;
		this.deviationLat = - 0.0065;

		this.init();

		// 关闭抗锯齿
		this.viewer.scene.fxaa = false;
		this.viewer.scene.postProcessStages.fxaa.enabled = false;

		this.viewer.scene.globe.maximumScreenSpaceError = 1.2;//这个越小，越早切换高图层

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
			let ray = self.viewer.camera.getPickRay(click.position);
			let cartesian = self.viewer.scene.globe.pick(ray, self.viewer.scene);
			let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
			let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值

			// let cartographic = self.viewer.camera.positionCartographic;
			// let lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
			// let lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
			// let height = cartographic.height
			console.log(lng + "," + lat)

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
			} else if (pickedFeature != undefined && pickedFeature.id && pickedFeature.id.nameID != undefined) {
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

			if (pickedFeature != undefined && pickedFeature.id && pickedFeature.id._name == "fenghuang") {
				let param = "fenghuang";
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

	updateBloom() {
		var viewModel = {
			show: true,
			glowOnly: false,
			contrast: 128,
			brightness: -0.3,
			delta: 1.0,
			sigma: 3.78,
			stepSize: 5.0,
		};

		Cesium.knockout.track(viewModel);
		var toolbar = document.getElementById("toolbar");
		Cesium.knockout.applyBindings(viewModel, toolbar);
		for (var name in viewModel) {
			if (viewModel.hasOwnProperty(name)) {
				Cesium.knockout
					.getObservable(viewModel, name)
					.subscribe(updatePostProcess);
			}
		}


		const self = this;
		function updatePostProcess() {
			var bloom = self.viewer.scene.postProcessStages.bloom;
			bloom.enabled = Boolean(viewModel.show);
			bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly);
			bloom.uniforms.contrast = Number(viewModel.contrast);
			bloom.uniforms.brightness = Number(viewModel.brightness);
			bloom.uniforms.delta = Number(viewModel.delta);
			bloom.uniforms.sigma = Number(viewModel.sigma);
			bloom.uniforms.stepSize = Number(viewModel.stepSize);
		}

		updatePostProcess();
	}

	updateAmbient() {
		var viewModel = {
			show: true,
			ambientOcclusionOnly: false,
			intensity: 3.0,
			bias: 0.1,
			lengthCap: 0.03,
			stepSize: 1.0,
			blurStepSize: 0.86,
		};

		Cesium.knockout.track(viewModel);
		var toolbar = document.getElementById("toolbar");
		Cesium.knockout.applyBindings(viewModel, toolbar);
		for (var name in viewModel) {
			if (viewModel.hasOwnProperty(name)) {
				Cesium.knockout
					.getObservable(viewModel, name)
					.subscribe(updatePostProcess);
			}
		}

		const self = this;
		function updatePostProcess() {
			var ambientOcclusion =
				self.viewer.scene.postProcessStages.ambientOcclusion;
			ambientOcclusion.enabled =
				Boolean(viewModel.show) || Boolean(viewModel.ambientOcclusionOnly);
			ambientOcclusion.uniforms.ambientOcclusionOnly = Boolean(
				viewModel.ambientOcclusionOnly
			);
			ambientOcclusion.uniforms.intensity = Number(viewModel.intensity);
			ambientOcclusion.uniforms.bias = Number(viewModel.bias);
			ambientOcclusion.uniforms.lengthCap = Number(viewModel.lengthCap);
			ambientOcclusion.uniforms.stepSize = Number(viewModel.stepSize);
			ambientOcclusion.uniforms.blurStepSize = Number(
				viewModel.blurStepSize
			);
		}
		updatePostProcess();
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
		this.flyTo(MapConfig.freeRoamMainView.lng, MapConfig.freeRoamMainView.lat, height + 1500, undefined, undefined, undefined, -35);
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
		if (point && point.lng && point.lat) {
			options.lng = Number(point.lng);
			options.lat = Number(point.lat);
			pitch = Cesium.Math.toRadians(-40);
			distance = 286.564328907688;  // 移动后处于高度200 公式：(height - 15.8) / Math.sin(40 * Math.PI / 180)
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

	setBaiduMap(proxy) {
		// 移除所有影像图层
		this.viewer.imageryLayers.removeAll();

		let url = "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200429&scale=1&ak=8d6c8b8f3749aed6b1aff3aad6f40e37&styles=t%3Aland%7Ce%3Ag%7Cc%3A%23e7f7fc%2Ct%3Awater%7Ce%3Aall%7Cc%3A%2396b5d6%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%23b0d3dd%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23a6cfcf%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%237dabb3%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%23e7f7fc%2Ct%3Aarterial%7Ce%3Ag.s%7Cc%3A%23b0d5d4%2Ct%3Alocal%7Ce%3Al.t.f%7Cc%3A%237a959a%2Ct%3Alocal%7Ce%3Al.t.s%7Cc%3A%23d6e4e5%2Ct%3Aarterial%7Ce%3Al.t.f%7Cc%3A%23374a46%2Ct%3Ahighway%7Ce%3Al.t.f%7Cc%3A%23374a46%2Ct%3Ahighway%7Ce%3Al.t.s%7Cc%3A%23e9eeed";
		let imageryLayer = this.viewer.imageryLayers.addImageryProvider(new Cesium.BaiduImageryProvider({
			// url: "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}",//&styles=pl&scaler=1&p=1
			url: proxy ? proxy : url,
			// maximumLevel: 8,
			credit: 'baidu map of street'
		}));

		imageryLayer.gamma = 0.8;
	}

	setTiandiMap() {
		// 移除所有影像图层
		this.viewer.imageryLayers.removeAll();

		let TDU_Key = "a89df02c93e5474e9ebeb81a32fcb487"//天地图申请的密钥

		let TDT_VEC_W = "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
			"&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
			"&style=default&format=tiles&tk=" + TDU_Key;


		var imageryProvider = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文服务
			url: TDT_VEC_W,//url地址
			layer: "img_w",	//WMTS请求的层名称
			style: "default",//WMTS请求的样式名称
			format: "tiles",//MIME类型，用于从服务器检索图像
			tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
			subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
			minimumLevel: 0,//最小层级
			maximumLevel: 18,//最大层级
		})

		let cia = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文注记服务
			url: "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
				"&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
				"&style=default.jpg&tk=" + TDU_Key,
			layer: "cia_w",
			style: "default",
			format: "tiles",
			tileMatrixSetID: "GoogleMapsCompatible",
			subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
			minimumLevel: 0,
			maximumLevel: 18,
		})

		this.viewer.imageryLayers.addImageryProvider(imageryProvider);
		this.viewer.imageryLayers.addImageryProvider(cia)//添加到cesium图层上

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

	// 取消飞行
	cancelFly() {
		let scene = this.viewer.scene;
		if (scene && (scene.tweens.length > 0)) {
			scene.tweens.removeAll();
		}
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
			position: Cesium.Cartesian3.fromDegrees(Number(position.lng), Number(position.lat), position.height ? Number(position.height) : 0),
			label: label != undefined ? {
				text: label.text,
				font: label.font != undefined ? label.font : '15px monospace 黑体',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				scale: label.scale ? Number(label.scale) : 1,
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

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.DEEPSKYBLUE, time);
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			let ellipsoid = self.viewer.scene.globe.ellipsoid;
			for (let i in entities) {
				let positions = entities[i].polyline.positions._value;
				for (let k = 0; k < positions.length; k++) {
					let cartographic = ellipsoid.cartesianToCartographic(positions[k]);
					let lat = Cesium.Math.toDegrees(Number(cartographic.latitude));
					let lng = Cesium.Math.toDegrees(Number(cartographic.longitude));
					let height = cartographic.height;
					let cartographic2 = Cesium.Cartographic.fromDegrees(lng + self.deviationLng, lat + self.deviationLat, height);
					let cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
					positions[k] = cartesian3;
				}
			}

		});

	}

	// 添加凤凰路流动路线
	addFengHuangFowLine(url, time) {
		time = time ? time : 2000;

		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.fengHuangFlowLineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.name = "fenghuang";
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.DEEPSKYBLUE, time);
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			let ellipsoid = self.viewer.scene.globe.ellipsoid;
			for (let i in entities) {
				let positions = entities[i].polyline.positions._value;
				for (let k = 0; k < positions.length; k++) {
					let cartographic = ellipsoid.cartesianToCartographic(positions[k]);
					let lat = Cesium.Math.toDegrees(Number(cartographic.latitude));
					let lng = Cesium.Math.toDegrees(Number(cartographic.longitude));
					let height = cartographic.height;
					let cartographic2 = Cesium.Cartographic.fromDegrees(lng + self.deviationLng, lat + self.deviationLat, height);
					let cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
					positions[k] = cartesian3;
				}
			}

		});
	}

	// 添加济川路流动路线
	addJiChuanFowLine(url, time) {
		time = time ? time : 2000;

		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.jiChuanFlowLineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.name = "jichuan";
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.DEEPSKYBLUE, time);
				r.polyline.width = self.flowLineWidth + 5;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			let ellipsoid = self.viewer.scene.globe.ellipsoid;
			for (let i in entities) {
				let positions = entities[i].polyline.positions._value;
				for (let k = 0; k < positions.length; k++) {
					let cartographic = ellipsoid.cartesianToCartographic(positions[k]);
					let lat = Cesium.Math.toDegrees(Number(cartographic.latitude));
					let lng = Cesium.Math.toDegrees(Number(cartographic.longitude));
					let height = cartographic.height;
					let cartographic2 = Cesium.Cartographic.fromDegrees(lng + self.deviationLng, lat + self.deviationLat, height);
					let cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
					positions[k] = cartesian3;
				}
			}

		});
	}

	// 添加污水厂尾水流动路线
	addOutWuShuiIndustryFowLine(url, time) {
		time = time ? time : 2000;

		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.outWuShuiIndustryFlowLineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.name = "wushui";
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLink2MaterialProperty(Cesium.Color.fromCssColorString("#e60012"), time)
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			let ellipsoid = self.viewer.scene.globe.ellipsoid;
			for (let i in entities) {
				let positions = entities[i].polyline.positions._value;
				for (let k = 0; k < positions.length; k++) {
					let cartographic = ellipsoid.cartesianToCartographic(positions[k]);
					let lat = Cesium.Math.toDegrees(Number(cartographic.latitude));
					let lng = Cesium.Math.toDegrees(Number(cartographic.longitude));
					let height = cartographic.height;
					let cartographic2 = Cesium.Cartographic.fromDegrees(lng + self.deviationLng, lat + self.deviationLat, height);
					let cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
					positions[k] = cartesian3;
				}
			}

		});
	}

	addOutPumpFlowLine(url, time, names) {
		time = time ? time : 2000;

		let geojsonOptions = {
			clampToGround: true
		};
		// 从geojson文件加载管线
		let neighborhoodsPromise = Cesium.GeoJsonDataSource.load(url, geojsonOptions);
		const self = this;
		neighborhoodsPromise.then(function (dataSource) {
			self.viewer.dataSources.add(dataSource);
			self.outPumpFlowLineDataSource = dataSource;
			let entities = dataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				if (names) {
					r.name = names[i];
				}
				r.show = false;
				r.polyline.material = new Cesium.PolylineTrailLink2MaterialProperty(Cesium.Color.fromCssColorString("#e60012"), time)
				r.polyline.width = self.flowLineWidth;
				r.polyline.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight);
				r.polyline.classificationType = Cesium.ClassificationType.TERRAIN;
			}

			let ellipsoid = self.viewer.scene.globe.ellipsoid;
			for (let i in entities) {
				let positions = entities[i].polyline.positions._value;
				for (let k = 0; k < positions.length; k++) {
					let cartographic = ellipsoid.cartesianToCartographic(positions[k]);
					let lat = Cesium.Math.toDegrees(Number(cartographic.latitude));
					let lng = Cesium.Math.toDegrees(Number(cartographic.longitude));
					let height = cartographic.height;
					let cartographic2 = Cesium.Cartographic.fromDegrees(lng + self.deviationLng, lat + self.deviationLat, height);
					let cartesian3 = ellipsoid.cartographicToCartesian(cartographic2);
					positions[k] = cartesian3;
				}
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

		if (this.fengHuangFlowLineDataSource) {
			let entities = this.fengHuangFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}

		if (this.jiChuanFlowLineDataSource) {
			let entities = this.jiChuanFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}

		if (this.outWuShuiIndustryFlowLineDataSource) {
			let entities = this.outWuShuiIndustryFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}

		if (this.outPumpFlowLineDataSource) {
			let entities = this.outPumpFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}
	}

	setOutPumpFlowLineTime(time) {
		if (this.outPumpFlowLineDataSource) {
			let entities = this.outPumpFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				r.polyline.material.duration = time;
			}
		}
	}

	setOutPumpFlowLineTimeByName(name, time) {
		if (this.outPumpFlowLineDataSource) {
			let entities = this.outPumpFlowLineDataSource.entities.values;

			for (let i = 0; i < entities.length; i++) {
				let r = entities[i];
				if (r.name == name) {
					r.polyline.material.duration = time;
				}
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

		if (this.fengHuangFlowLineDataSource != undefined) {
			let entities = this.fengHuangFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = true;
			}
		}

		if (this.jiChuanFlowLineDataSource != undefined) {
			let entities = this.jiChuanFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = true;
			}
		}

		if (this.outWuShuiIndustryFlowLineDataSource != undefined) {
			let entities = this.outWuShuiIndustryFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = true;
			}
		}

		if (this.outPumpFlowLineDataSource != undefined) {
			let entities = this.outPumpFlowLineDataSource.entities.values;
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

		if (this.fengHuangFlowLineDataSource != undefined) {
			let entities = this.fengHuangFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
		}

		if (this.jiChuanFlowLineDataSource != undefined) {
			let entities = this.jiChuanFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
		}

		if (this.outWuShuiIndustryFlowLineDataSource != undefined) {
			let entities = this.outWuShuiIndustryFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
		}

		if (this.outPumpFlowLineDataSource != undefined) {
			let entities = this.outPumpFlowLineDataSource.entities.values;
			for (let i = 0; i < entities.length; i++) {
				entities[i].show = false;
			}
		}
	}

	// 添加模型
	addPumpModel(positions) {
		if (this.model) {
			this.model.addPumpModels(positions);
		}
	}

	addMonitorModel(positions) {
		if (this.model) {
			this.model.addMonitorModels(positions);
		}
	}

	addPlantModel(position) {
		if (this.model) {
			this.model.addPlantModel(position);
		}
	}

	addCityModel(positions) {
		if (this.model) {
			this.model.addCityModels(positions);
		}
	}

	showAllModel() {
		if (this.model) {
			this.model.showAllModel();
		}
	}

	hideAllModel() {
		if (this.model) {
			this.model.hideAllModel();
		}
	}

	showMonitorModel() {
		this.model.showMonitorModel();
	}

	hideMonitorModel() {
		this.model.hideMonitorModel();
	}

	updateModel(name, bodyColor, lineColor) {
		this.model.updateModel(name, bodyColor, lineColor);
	}

	updateMonitorModel(name, color) {
		this.model.updateMonitorModel(name, color);
	}

	changePumpModelScale(name, scale) {
		this.model.changePumpModelScale(name, scale);
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
				eyeOffset: new Cesium.Cartesian3(0, 0, -100)
			} : {},
			billboard: billboard != undefined ? {
				image: billboard.uri,
				pixelOffset: new Cesium.Cartesian2(0, -100),
				width: billboard.width != undefined ? billboard.width : 100,
				height: billboard.height != undefined ? billboard.height : 21.25,
				distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, MapConfig.cameraTiltMaxHight)
			} : {}
		});

		// let entity2 = this.viewer.entities.add({
		// 	position: Cesium.Cartesian3.fromDegrees(lng, lat, height),
		// 	show: true,
		// 	cylinder: {
		// 		//圆锥
		// 		length: 45,
		// 		topRadius: 30,
		// 		bottomRadius: 0,
		// 		material: Cesium.Color.fromCssColorString(color).withAlpha(alpha),
		// 		slices: 4,
		// 		outline: true,
		// 		outlineColor: Cesium.Color.fromCssColorString('#11b3ff')
		// 	}
		// });
		// let entity3 = this.viewer.entities.add({
		// 	position: Cesium.Cartesian3.fromDegrees(lng, lat, height + 45),
		// 	show: true,
		// 	// label: {
		// 	// 	//文字标签
		// 	// 	text: name,
		// 	// 	font: "normal 20px MicroSoft YaHei", // 15pt monospace
		// 	// 	style: Cesium.LabelStyle.FILL_AND_OUTLINE,
		// 	// 	fillColor: Cesium.Color.WHITE,
		// 	// 	verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
		// 	// 	pixelOffset: new Cesium.Cartesian2(0, -80),   //偏移量
		// 	// 	showBackground: true,
		// 	// 	backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0)
		// 	// },
		// 	cylinder: {
		// 		//圆锥
		// 		length: 45,
		// 		topRadius: 0,
		// 		bottomRadius: 30,
		// 		material: Cesium.Color.fromCssColorString(color).withAlpha(alpha),
		// 		slices: 4,
		// 		outline: true,
		// 		outlineColor: Cesium.Color.fromCssColorString('#11b3ff')
		// 	}
		// });

		this.pyramidMarkEntities.push(entity1);
	}

	// 更新图标
	updatePyramidMark(id, imageUri) {
		for (let key in this.pyramidMarkEntities) {
			if (id == this.pyramidMarkEntities[key].id) {
				this.pyramidMarkEntities[key].billboard.image = imageUri;
				break;
			}
		}
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

		// this.viewer.shadows = true;
		// let shadowMap = this.viewer.shadowMap;
		// shadowMap.maximumDistance = 10000.0;
		// shadowMap.size = 4096;

		let sunLight = new Cesium.SunLight()
		scene.light = sunLight;

		this.setTime(this.defaultTime);
	}

	// 添加波纹效果
	addCircleRipple(data) {
		let curR = data.minR;

		function changeR() { //这是callback，参数不能内传
			curR = curR + data.deviationR;
			if (curR >= data.maxR) {
				curR = data.minR;
			}
			return curR;
		}

		function getR() {
			return curR;
		}

		let entity = this.viewer.entities.add({
			id: data.id ? data.id : Math.random(),
			name: "",
			position: Cesium.Cartesian3.fromDegrees(Number(data.lng), Number(data.lat), data.height ? Number(data.height) : 0),
			show: true,
			ellipse: {
				semiMajorAxis: new Cesium.CallbackProperty(changeR, false),
				semiMinorAxis: new Cesium.CallbackProperty(getR, false),
				height: data.height ? Number(data.height) : 0,
				material: new Cesium.ImageMaterialProperty({
					image: data.imageUrl,
					repeat: new Cesium.Cartesian2(1.0, 1.0),
					transparent: true,
					color: new Cesium.CallbackProperty(function () {
						let alp = 1 - curR / data.maxR;
						return Cesium.Color.WHITE.withAlpha(alp)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
					}, false)
				})
			}
		});
		this.circleRippleEntities.push(entity);
	}

	hideAllCircleRipple() {
		for (let key in this.circleRippleEntities) {
			this.circleRippleEntities[key].show = false;
		}
	}

	showAllCircleRipple() {
		for (let key in this.circleRippleEntities) {
			this.circleRippleEntities[key].show = true;
		}
	}

}
