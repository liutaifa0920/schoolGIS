<template>
  <div class="home">
    <div id="cesiumContainer"></div>
    <div class="homeNav">
      <ul class="homeNavUl">
        <li @click="NavBuildClick">
          <div class="homeNavUlIcon navFristIcon">
            <img src="../../public/img/nav/bui.png" />
          </div>
          <p>教学院楼</p>
        </li>
        <li @click="NavStudentClick">
          <div class="homeNavUlIcon">
            <img src="../../public/img/nav/stu.png" />
          </div>
          <p>学生动态</p>
        </li>
        <li @click="NavTeacherClick">
          <div class="homeNavUlIcon">
            <img src="../../public/img/nav/tea.png" />
          </div>
          <p>教师考勤</p>
        </li>
      </ul>
    </div>
    <div v-if="buildInfoBoxFlag" class="buildInfoBox">
      <div class="buildInfoBoxTitle">
        <span>{{currentClickBuildInfo.name}}</span>
        <span @click="closeBuildInfoBox">X</span>
      </div>
      <ul class="buildInfoBoxText">
        <li>
          <p>名称 ：{{currentClickBuildInfo.name}}</p>
        </li>
        <li>
          <p>简介 ：{{currentClickBuildInfo.info}}</p>
        </li>
      </ul>
      <div class="buildInfoBoxImg">
        <img src="../../public/img/nav/bui.png" />
      </div>
    </div>
    <div class="teaInSchool" v-show="currentNavType == 'teacher'">
      <ul>
        <li>打卡数量 : {{10}} 人</li>
        <li>迟到数量 : {{20}} 人</li>
        <li>请假数量 : {{30}} 人</li>
      </ul>
    </div>
  </div>
</template>

<script>
var viewer = null;
var tileset = null;
var entitiesList = [];
var entitiesItem = null;
var handler = null;

var stuEntitiesList = [];
var stuEntitiesItem = null;
export default {
  data() {
    return {
      currentNavType: null,
      entitiesInfo: [
        {
          name: "建筑a",
          info: "简介1",
          lon: 118.29662785554709,
          lat: 34.96830790030865,
          height: 30.0,
          imgUrl: ""
        },
        {
          name: "建筑b",
          info: "简介2",
          lon: 118.29732574997546,
          lat: 34.9685020221569,
          height: 40.0,
          imgUrl: ""
        },
        {
          name: "建筑c",
          info: "简介3",
          lon: 118.2980747834933,
          lat: 34.968210807879785,
          height: 50.0,
          imgUrl: ""
        },
        {
          name: "建筑d",
          info: "简介4",
          lon: 118.29879841336356,
          lat: 34.967438204865886,
          height: 40.0,
          imgUrl: ""
        },
        {
          name: "建筑e",
          info: "简介5",
          lon: 118.2978811355137,
          lat: 34.966576484097715,
          height: 35.0,
          imgUrl: ""
        },
        {
          name: "建筑f",
          info: "简介6",
          lon: 118.29543955319316,
          lat: 34.96767893964343,
          height: 30.0,
          imgUrl: ""
        }
      ],
      cameraPosition: [
        // 没牌子小白
        {
          lon: 118.29656274333464,
          lat: 34.96730370884514,
          height: 50,
          heading: 5,
          pitch: -20
        },
        // 小粉
        {
          lon: 118.29854541126369,
          lat: 34.96868756768568,
          height: 40,
          heading: -100,
          pitch: -15
        },
        // 北大楼
        {
          lon: 118.29800630920963,
          lat: 34.967004487234745,
          height: 60,
          heading: 5,
          pitch: -25
        },
        // 哈佛楼
        {
          lon: 118.29746721395457,
          lat: 34.96741194423595,
          height: 35,
          heading: 90,
          pitch: -15
        },
        // 清华楼
        {
          lon: 118.29795253488118,
          lat: 34.96756539893792,
          height: 35,
          heading: -175,
          pitch: -20
        },
        // 小寨子
        {
          lon: 118.2953661062254,
          lat: 34.96705648792102,
          height: 35,
          heading: 10,
          pitch: -20
        }
      ],
      buildInfoBoxFlag: false,
      currentClickBuildInfo: null
    };
  },
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MDZiODg5ZS0yMTYwLTQwNzgtODNkMi0xMjk5NzU1NDMzYTciLCJpZCI6MTM0MTUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjMyNTQ1ODF9.ZSTW9uIkKQKW2hO3KsHdBRJ-udZ4tWMEChZCSslFTyw";
      // 加载地球
      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, // [ Bool, 是否显示动画控件 ]
        shouldAnimate: true, // [ Bool, 是否开启动画 ]
        homeButton: false, // [ Bool, 是否显示Home按钮 ]
        vrButton: false, // [ Bool, 是否显示vr按钮 ]
        fullscreenButton: false, // [ Bool, 是否显示全屏按钮 ]
        baseLayerPicker: false, // [ Bool, 是否显示图层选择控件 ]
        geocoder: false, // [ Bool, 是否显示地名查找控件 ]
        timeline: false, // [ Bool, 是否显示时间线控件 ]
        sceneModePicker: true, // [ Bool, 是否显示投影方式控件 ]
        navigationHelpButton: false, // [ Bool, 是否显示帮助信息控件 ]
        infoBox: false, // [ Bool, 是否 ]
        requestRenderMode: true, // [ Bool, 启用请求渲染模式 ]
        scene3DOnly: false, // [ Bool, 每个几何实例将只能以3D渲染以节省GPU内存 ]
        sceneModePicker: false, // [ Bool, 是否显示场景切换控件 ]
        sceneMode: 3, // [ Number,初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode ]
        fullscreenElement: document.body // [ Object, 全屏时渲染的HTML元素 ]
      });

      // 清除默认的第一个影像 bing地图影像
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
      // viewer.terrainProvider = Cesium.createWorldTerrain();
      // arcGis影像
      let img = viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url:
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          baseLayerPicker: false
        })
      );
      // // 影像的亮度
      img.brightness = 0.8;

      // 天地图标注
      let label = viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg" +
            "&tk=" +
            "19b72f6cde5c8b49cf21ea2bb4c5b21e",
          layer: "tdtAnnoLayer",
          style: "default",
          maximumLevel: 20, // 天地图的最大缩放级别
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      // 影像的亮度
      label.brightness = 1;

      viewer.scene.undergroundMode = false; // [ Bool , 设置开启地下场景 ]
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 30; // [ Number ,设置相机最小缩放距离,距离地表n米 ]
      viewer.scene.terrainProvider.isCreateSkirt = false; // [ Bool , 关闭裙边 ]
      viewer.scene.globe.enableLighting = true; // [ Bool , 是否添加全球光照，scene(场景)中的光照将会随着每天时间的变化而变化 ]
      viewer.scene.globe.showGroundAtmosphere = false; // [ Bool , 是否关闭大气效果 ]
      // viewer.scene.globe.depthTestAgainstTerrain = true                  // [ Bool , 地面以下不可见（高程遮挡） ]
      viewer._cesiumWidget._creditContainer.style.display = "none"; // [ String , 隐藏logo ]

      // 加载3DTiles模型数据
      tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url:
            "https://cesium-map.oss-cn-qingdao.aliyuncs.com/zjl/data/tileset.json",
          maximumScreenSpaceError: 2, // 最大的屏幕空间误差
          maximumNumberOfLoadedTiles: 1000, // 最大加载瓦片个数
          scale: 10000
        })
      );

      this.up3dtilesMaxtrix();
    },
    // 加载模型位置调整
    up3dtilesMaxtrix() {
      tileset.readyPromise.then(function(argument) {
        let x = "298.29725",
          y = "145.03273",
          z = "0";
        let RotateX = 0,
          RotateY = 10,
          RotateZ = -94;
        //旋转
        let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(RotateX));
        let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(RotateY));
        let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(RotateZ));
        let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        let position = Cesium.Cartesian3.fromDegrees(x, y, z);
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        // 缩放
        let scale = Cesium.Matrix4.fromUniformScale(3);
        //旋转、平移、缩放矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        Cesium.Matrix4.multiply(m, scale, m);
        //赋值给tileset
        tileset._root.transform = m;

        viewer.zoomTo(tileset, {
          heading: Cesium.Math.toRadians(-55),
          pitch: Cesium.Math.toRadians(-15),
          range: 500
        });
      });
    },
    // 点击Nav Build --------------------------------
    NavBuildClick() {
      console.log("build");
      viewer.entities.removeAll();
      this.currentNavType = "build"; // 更改Nav状态
      this.buildInfoBoxFlag = false;
      if (this.currentNavType == "build") {
        this.flyToStartCamera();
      }
      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); // 移除之前事件绑定
      }
      // console.log(entitiesList);
      if (entitiesList.length !== 0) {
        this.entitiesInfo.map((e, i) => {
          viewer.entities.removeById(e.name); // 移除点
        });
        entitiesList = []; // ...
      } else {
        this.entitiesInfo.map((e, i) => {
          // 循环添加点
          entitiesItem = viewer.entities.add({
            id: e.name,
            position: Cesium.Cartesian3.fromDegrees(e.lon, e.lat, e.height), // 点位置
            cylinder: {
              length: 12.0,
              topRadius: 6.0, // 圆锥顶部半径
              bottomRadius: 0.0, // 圆锥底部半径
              material: new Cesium.Color(0, 0.65, 0.78, 0.6) // 几何体颜色 透明度
            }
          });
          entitiesList.push(entitiesItem); // ...
        });

        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 添加事件绑定
        handler.setInputAction(movement => {
          var pick = viewer.scene.pick(movement.position); // pick点击元素
          if (pick.id) {
            let tempIndex = this.entitiesInfo
              .map((e, i) => {
                // 获取点击的对应点
                return e.name;
              })
              .indexOf(pick.id.id);
            console.log(this.entitiesInfo[tempIndex]);
            this.currentClickBuildInfo = this.entitiesInfo[tempIndex];
            this.buildInfoBoxFlag = true;
            // viewer.zoomTo(entitiesList[tempIndex]);
            viewer.scene.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                this.cameraPosition[tempIndex].lon,
                this.cameraPosition[tempIndex].lat,
                this.cameraPosition[tempIndex].height
              ), // 设置位置
              orientation: {
                heading: Cesium.Math.toRadians(
                  this.cameraPosition[tempIndex].heading
                ), // 方向
                pitch: Cesium.Math.toRadians(
                  this.cameraPosition[tempIndex].pitch
                ), // 倾斜角度
                roll: 0
              }
            });
            // if (Cesium.defined(pick) && pick.id.id === "id") {}
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    },
    // buildInfoBoxClose
    closeBuildInfoBox() {
      this.buildInfoBoxFlag = false;
    },

    // 点击Nav Student --------------------------------
    NavStudentClick() {
      console.log("student");
      this.currentNavType = "student"; // 更改Nav状态
      // handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      viewer.entities.removeAll();
      entitiesList = [];
      this.buildInfoBoxFlag = false;

      // var entity = viewer.entities.add({
      //   position: Cesium.Cartesian3.fromDegrees(-103.0, 40.0),
      //   ellipse: {
      //     semiMinorAxis: 250.0,
      //     semiMajorAxis: 400.0,
      //     material: Cesium.Color.BLUE.withAlpha(0.5)
      //   }
      // });
      // viewer.zoomTo(viewer.entities);
      // var ellipse = entity.ellipse; // Fo
      // ellipse.material = "img/nav/bui.png";

      // var st = Cesium.JulianDate.fromDate(new Date(2019, 11, 9, 9));
      // var t2 = Cesium.JulianDate.addSeconds(st, 10, new Cesium.JulianDate());
      // var t3 = Cesium.JulianDate.addSeconds(t2, 10, new Cesium.JulianDate());
      // var t4 = Cesium.JulianDate.addSeconds(t3, 10, new Cesium.JulianDate());
      // var t5 = Cesium.JulianDate.addSeconds(t4, 10, new Cesium.JulianDate());
      // var t6 = Cesium.JulianDate.addSeconds(t5, 10, new Cesium.JulianDate());
      // var t7 = Cesium.JulianDate.addSeconds(t6, 10, new Cesium.JulianDate());
      // var et = Cesium.JulianDate.addSeconds(t7, 10, new Cesium.JulianDate());

      // viewer.clock.startTime = st.clone();
      // viewer.clock.stopTime = et.clone();
      // viewer.clock.currentTime = st.clone();
      // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      // viewer.clock.multiplier = 5;
      // viewer.clock.shouldAnimate = true;

      // // 设置时间线焦点
      // // viewer.timeline.zoomTo(st, et);

      // var pos1 = Cesium.Cartesian3.fromDegrees(
      //   118.2990851003215,
      //   34.96769364068988,
      //   -1
      // );
      // var pos2 = Cesium.Cartesian3.fromDegrees(
      //   118.29908451442867,
      //   34.96763043313925,
      //   -1
      // );
      // var pos3 = Cesium.Cartesian3.fromDegrees(
      //   118.29908148083524,
      //   34.96753635047444,
      //   -1
      // );
      // var pos4 = Cesium.Cartesian3.fromDegrees(
      //   118.29901759223947,
      //   34.96749448459458,
      //   -1
      // );
      // var pos5 = Cesium.Cartesian3.fromDegrees(
      //   118.29892664232482,
      //   34.96744431411429,
      //   -1
      // );
      // var pos6 = Cesium.Cartesian3.fromDegrees(
      //   118.29882752805425,
      //   34.96743815624351,
      //   -1
      // );
      // var pos7 = Cesium.Cartesian3.fromDegrees(
      //   118.2986210223403,
      //   34.96745258742299,
      //   -1
      // );
      // var pos8 = Cesium.Cartesian3.fromDegrees(
      //   118.29858766790473,
      //   34.96756397978087,
      //   -1
      // );
      // let position = new Cesium.SampledPositionProperty();

      // position.addSample(st, pos1);
      // position.addSample(t2, pos2);
      // position.addSample(t3, pos3);
      // position.addSample(t4, pos4);
      // position.addSample(t5, pos5);
      // position.addSample(t6, pos6);
      // position.addSample(t7, pos7);
      // position.addSample(et, pos8);

      // let entity = viewer.entities.add({
      //   availability: new Cesium.TimeIntervalCollection([
      //     new Cesium.TimeInterval({
      //       start: st,
      //       stop: t2
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t2,
      //       stop: t3
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t3,
      //       stop: t4
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t4,
      //       stop: t5
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t5,
      //       stop: t6
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t6,
      //       stop: t7
      //     }),
      //     new Cesium.TimeInterval({
      //       start: t7,
      //       stop: et
      //     })
      //   ]),
      //   model: {
      //     uri: "lib/Cesium_Man.gltf",
      //     minimumPixelSize: 0,
      //     maximumScale: 64,
      //     scale: 1.2
      //   },
      //   viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
      //   position: position,
      //   orientation: new Cesium.VelocityOrientationProperty(position)
      // });
      // viewer.trackedEntity = entity;

      // 移动到校门口位置
      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          // 设置位置
          118.29969900417087,
          34.96740152417609,
          30
        ),
        orientation: {
          heading: Cesium.Math.toRadians(-90), // 方向
          pitch: Cesium.Math.toRadians(-20), // 倾斜角度
          roll: 0
        }
      });

      // 右进人1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        [
          {
            lon: 118.29923006878558,
            lat: 34.96724527331529,
            height: -1.5298812281348095
          },
          {
            lon: 118.29905591595683,
            lat: 34.967276364291536,
            height: -1.3761751541052696
          },
          {
            lon: 118.29903514024419,
            lat: 34.9674075500457,
            height: -1.0625287643951982
          },
          {
            lon: 118.29888125273801,
            lat: 34.96743935028854,
            height: -1.020202849028363
          },
          {
            lon: 118.298749108351,
            lat: 34.96737026231512,
            height: -0.6663517807169757
          },
          {
            lon: 118.29861747714654,
            lat: 34.967354829117106,
            height: -1.0172531758570718
          },
          {
            lon: 118.29857937305385,
            lat: 34.967193250375104,
            height: -1.2166455218592822
          },
          {
            lon: 118.29857777759062,
            lat: 34.96698279397183,
            height: -1.6198945951934267
          }
        ],
        1.2,
        "lib/Cesium_Man.gltf",
        true,
        "进校"
      );
      // 左出人1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        [
          {
            lon: 118.29858248125473,
            lat: 34.96712743848664,
            height: -1.3886244098580731
          },
          {
            lon: 118.29858512212323,
            lat: 34.96727336797037,
            height: -1.127554555503942
          },
          {
            lon: 118.29861195126716,
            lat: 34.96737429186964,
            height: -0.9589538919052741
          },
          {
            lon: 118.29867139113829,
            lat: 34.96740580665601,
            height: -0.9602623147391524
          },
          {
            lon: 118.29878014457071,
            lat: 34.96742125240462,
            height: -1.0394626037552819
          },
          {
            lon: 118.29887897257638,
            lat: 34.96743855729579,
            height: -1.0530660537488028
          },
          {
            lon: 118.29900575443277,
            lat: 34.96730925665093,
            height: -1.280392548516297
          },
          {
            lon: 118.29903427244282,
            lat: 34.96722649266792,
            height: 0.7173112125817588
          }
        ],
        1.2,
        "lib/Cesium_Man.gltf",
        true,
        "离校"
      );
      // 进出人1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        [
          {
            lon: 118.29902376784113,
            lat: 34.96777233888317,
            height: 0.01107216593044354
          },
          {
            lon: 118.29902955776939,
            lat: 34.96756291553885,
            height: -0.6051348426208084
          },
          {
            lon: 118.29887950550116,
            lat: 34.967440834066906,
            height: -1.0540240567697148
          },
          {
            lon: 118.29859132942356,
            lat: 34.96753475750711,
            height: -0.6828354847988889
          },
          {
            lon: 118.29884159919085,
            lat: 34.967415086431956,
            height: -1.0846438704759158
          },
          {
            lon: 118.29898989038628,
            lat: 34.96745636066981,
            height: -0.9904200002776051
          },
          {
            lon: 118.29902119907658,
            lat: 34.96760806180003,
            height: -0.4504996595267081
          },
          {
            lon: 118.29901875718693,
            lat: 34.96777280537055,
            height: 0.06524144007875826
          }
        ],
        1.2,
        "lib/Cesium_Man.gltf",
        true,
        "进校"
      );
      // 右进车停下车1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        // 118.29913231396338 34.96736239777324
        // 118.29904798734334 34.96740926146875
        // 118.29858128997604 34.96742454147027
        [
          {
            lon: 118.2990855681482,
            lat: 34.967992088101155,
            height: 0.32946789042778446
          },
          {
            lon: 118.29908620611862,
            lat: 34.967697971709434,
            height: -0.391076462088459
          },
          {
            lon: 118.29905136806107,
            lat: 34.96758946895067,
            height: -0.6454033186187359
          },
          {
            lon: 118.29905136806107,
            lat: 34.96758946895067,
            height: -0.6454033186187359
          },
          {
            lon: 118.29908766088211,
            lat: 34.9675178562473,
            height: -0.8758879240248846
          },
          {
            lon: 118.29907553610086,
            lat: 34.96727065457283,
            height: -1.4115908856063035
          },
          {
            lon: 118.29906469360141,
            lat: 34.96702003753259,
            height: -1.929439339384638
          },
          {
            lon: 118.29906404201816,
            lat: 34.96683195918955,
            height: -2.193006702980869
          }
        ],
        1,
        "lib/CesiumMilkTruck-kmc.gltf",
        false,
        ""
      );
      // 右进停车下车人1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        [
          {
            lon: 118.2990855681482,
            lat: 34.967992088101155,
            height: 0.32946789042778446
          },
          {
            lon: 118.29908620611862,
            lat: 34.967697971709434,
            height: -0.391076462088459
          },
          {
            lon: 118.29905136806107,
            lat: 34.96758946895067,
            height: -0.6454033186187359
          },
          {
            lon: 118.29902475352084,
            lat: 34.96753481764369,
            height: -0.7411418835972181
          },
          {
            lon: 118.29888997049748,
            lat: 34.967441409020765,
            height: -1.0935522115568432
          },
          {
            lon: 118.29865842212294,
            lat: 34.967451257045916,
            height: -0.923070671504357
          },
          {
            lon: 118.29861304281398,
            lat: 34.967536744530804,
            height: -0.6679862664005061
          },
          {
            lon: 118.29860379306884,
            lat: 34.967727544995505,
            height: -0.2462934860384414
          }
        ],
        1.2,
        "lib/Cesium_Man.gltf",
        true,
        "进校"
      );
      // 路上车1
      this.createModel(
        {
          year: 2019,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        8,
        5,
        // 118.29913231396338 34.96736239777324
        // 118.29904798734334 34.96740926146875
        // 118.29858128997604 34.96742454147027
        [
          {
            lon: 118.29913870788185,
            lat: 34.966975009613876,
            height: -2.1114998513214336
          },
          {
            lon: 118.29914620325307,
            lat: 34.96725009733144,
            height: -1.5818221353510442
          },
          {
            lon: 118.29914474208375,
            lat: 34.96751255132484,
            height: -0.9358344931256223
          },
          {
            lon: 118.29915329898166,
            lat: 34.96781449810999,
            height: -0.13251763099284805
          },
          {
            lon: 118.2990801040854,
            lat: 34.96781397162938,
            height: -0.07701041307935579
          },
          {
            lon: 118.29907361941474,
            lat: 34.96752457882198,
            height: -0.8168680272070504
          },
          {
            lon: 118.29907025817403,
            lat: 34.96725510895223,
            height: -1.4596206293286247
          },
          {
            lon: 118.29906756013096,
            lat: 34.96698984892347,
            height: -1.9494291197892852
          }
        ],
        1,
        "lib/CesiumMilkTruck-kmc.gltf",
        false,
        ""
      );

      // viewer.entities.add({
      //   id: 'aaa',
      //   position: Cesium.Cartesian3.fromDegrees(
      //     118.2988831833369,
      //     34.96743996387322,
      //     8
      //   ),
      //   label:{
      //     text: '\t\t',
      //     font: '14pt monospace',
      //     showBackground: true,
      //     backgroundColor: new Cesium.Color(0, 0.45, 0.6, 0.6),
      //   }
      // });
      // console.log('创建了');
    },

    // 点击Nav Teacher --------------------------------
    NavTeacherClick() {
      console.log("teacher");
      this.currentNavType = "teacher"; // 更改Nav状态
      // handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      viewer.entities.removeAll();
      entitiesList = [];
      this.buildInfoBoxFlag = false;

      
      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          118.29409588101844,
          34.96556316800423,
          80
        ), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(50), // 方向
          pitch: Cesium.Math.toRadians(-20), // 倾斜角度
          roll: 0
        }
      });

      this.createModel(
        {
          year: 2018,
          mounth: 11,
          day: 9,
          hour: 12
        },
        10,
        10,
        5,
        [{lon: 118.29901888442387,lat: 34.96743535220638,height: -1.0553698259084834},{lon: 118.29795505529832,lat: 34.967520436419285,height: -0.32990774293802083},{lon: 118.29689195375862,lat: 34.96759853187185,height: 0.24432059341758738},{lon: 118.29679237044053,lat: 34.96683698606198,height: -1.0183223378570037},{lon: 118.2963860167185,lat: 34.96661157642752,height: -1.1831365196431496},{lon: 118.29584110937142,lat: 34.966788014213975,height: -0.8128939628089796},{lon: 118.29619726970932,lat: 34.96718104385448,height: -0.2553706316613609},{lon: 118.29656827747641,lat: 34.96757419038719,height: 0.37239257454066343},{lon: 118.29687712394275,lat: 34.96773904604787,height: 0.505607192799921},{lon: 118.29689997727213,lat: 34.96804088960696,height: 1.22194816016343}],
        1,
        "lib/CesiumMilkTruck-kmc.gltf",
        false,
        ""
      );

      // 出校路线demo
      let lineArr = [
        [118.29807018303829,34.96798727373689,6,118.29805707028588,34.967928270635085,6,118.29805233559198,34.967864050352944,6,118.29809493317609,34.967832348441874,6,118.2981780908548,34.967823020916285,6,118.29828722178755,34.967818723530236,6,118.29837110961593,34.96780805058978,6,118.29840685260093,34.96780711597543,6,118.29848837110447,34.96783977019387,6,118.29859475542906,34.96783360784111,6,118.29861450631968,34.96780749457343,6,118.29860848122841,34.96771369162021,6,118.29860804076323,34.96762548923818,6,118.2986061195245,34.96754876779097,6,118.29860803497566,34.96747404837151,6,118.29863948629853,34.96742371070615,6,118.29870896819575,34.967420136412336,6,118.29875405535397,34.967412733816055,6],
        
        [118.29807101374499,34.96798393578067,6,118.29805716548665,34.96790852148084,6,118.29804937342986,34.967838379849056,6,118.29804539169753,34.96778380321906,6,118.29803355284321,34.967683786568564,6,118.29802133055661,34.96760752802916,6,118.29801527608817,34.9675465582365,6,118.29802276477636,34.967488236842456,6,118.29806839367161,34.967472886117356,6,118.2981681407484,34.9674623833417,6,118.29828003423995,34.967453945404635,6,118.29838027782895,34.96744607509331,6,118.29846720992495,34.96743919628215,6,118.29853353558036,34.967430652282026,6,118.29863548353387,34.96742263922799,6,118.29869465090799,34.96741536032569,6,118.29875285920112,34.967409538253634,6],

        [118.29791222057969,34.966666360176454,6,118.2979232283668,34.96673151462756,6,118.29794017223293,34.96674848655604,6,118.29804864181389,34.966738254521246,6,118.29815354330772,34.96672500306918,6,118.29828529182427,34.966714024918005,6,118.29838896251181,34.96670614463924,6,118.2984679946215,34.966700994821366,6,118.29852175585343,34.96671268802291,6,118.29856477096736,34.96675377297651,6,118.29857918102864,34.96686831860023,6,118.29858231480989,34.96696627433312,6,118.29858562116273,34.96703427572579,6,118.29858947630217,34.96713704198102,6,118.29859483133126,34.96724829455108,6,118.2985995783568,34.96732625490155,6,118.29863577804845,34.96739649562298,6,118.29868086285478,34.96742419047141,6,118.29874192443832,34.96742467509841,6],

        [118.29791898138672,34.966669718902025,6,118.29792427983324,34.96673000051583,6,118.2978937051239,34.96676022086476,6,118.29771951513112,34.966769351275154,6,118.2976176061073,34.966780491144945,6,118.29750823014844,34.9667886220284,6,118.29739017098105,34.96680079974538,6,118.29730269110969,34.966802838760145,6,118.29718808842384,34.96681400982602,6,118.2970746538465,34.96681305690292,6,118.29696857033213,34.966810080371424,6,118.2968354270444,34.9667909442093,6,118.29672835583288,34.966719185382566,6,118.29671785060229,34.96663636586099,6,118.29670561346971,34.96655795028374,6,118.29669761656304,34.96645118783912,6,118.2966821336761,34.966366692220575,6,118.29666977427281,34.96625848023697,6,118.29666595546712,34.96623423157861,6],

        [118.29621962061441,34.96814639981781,6,118.29622856934424,34.96811043100642,6,118.29630311792437,34.968087592666365,6,118.29650846579615,34.96806934286594,6,118.29662427658928,34.968059364908356,6,118.29677396251284,34.96805261932372,6,118.29685103766067,34.96804585812704,6,118.29690993459175,34.968026305249765,6,118.296925466947,34.96799130183082,6,118.29691149249018,34.96787251686968,6,118.29689313366612,34.96776679160127,6,118.29688472695179,34.9676699280904,6],

        [118.29658104900238,34.96811779245502,6,118.29657751921847,34.96808966799966,6,118.29663200491025,34.968059640951026,6],

        [118.2972095858438,34.96828089026294,6,118.29719445031854,34.96816507693586,6,118.29718369640224,34.96808646758805,6,118.29717486946319,34.968055977615194,6,118.29716031486956,34.968034304813834,6,118.29709030538662,34.9680379116423,6,118.29702042437506,34.96803906963798,6,118.2969692594167,34.968019126567874,6,118.29693041972018,34.96799831019449,6,118.2969267313478,34.967992054165215,6],

        [118.29688006901281,34.96766461221151,6,118.29686958173173,34.967621960982065,6,118.29685679764286,34.96758740071332,6,118.29678265181015,34.967582820515716,6,118.29671891843897,34.96759055726159,6,118.29664309518373,34.967596434181246,6,118.296579635127,34.96755430919389,6,118.29653587625084,34.96747793390571,6,118.29647399081357,34.96736642959315,6,118.29642147333752,34.96729240220366,6,118.29636922821095,34.96724092706801,6,118.2963010312493,34.96719364715478,6,118.29625117262161,34.96717192269048,6,118.29617849107893,34.96713905986825,6,118.29610526667774,34.96706220534466,6,118.29607772145555,34.96697316931973,6,118.29603227654863,34.96689590612609,6,118.29597283969949,34.96684626403001,6,118.29591794967689,34.96680878397708,6,118.2958224945587,34.96678537814799,6,118.29567068256463,34.96678961862832,6,118.29554502590591,34.96680201315326,6,118.29540375997423,34.96681423363298,6,118.29527568095303,34.96682803049793,6,118.29514883765187,34.966841684129875,6,118.2950700727996,34.96683813288304,6,118.29503358214413,34.96683102502867,6],

        [118.29687111602647,34.96761893165191,6,118.29686444274806,34.96755931112781,6,118.29684828404707,34.96744913991571,6,118.29683666473265,34.967370459056504,6,118.29682222334235,34.967262846695995,6,118.29680267264085,34.967140213194476,6,118.29679276795324,34.96706284756729,6,118.29677480228239,34.96694050435899,6,118.2967680874185,34.96686452796977,6,118.29674642137452,34.96678068441535,6,118.29673324264066,34.966738803188804,6,118.29672282548258,34.966704221414346,6],

        [118.29673340790583,34.966712905466004,6,118.29663614000252,34.966667940537384,6,118.29647922242142,34.96662192861553,6,118.29633532737397,34.96660057080715,6,118.29623439148304,34.96658817989659,6,118.29612346034594,34.966617697458624,6,118.29603621694301,34.966664688993255,6,118.29592802785548,34.966736564460895,6,118.2958217187412,34.9667612655936,6,118.29568932997506,34.966786181084494,6]
      ]
      lineArr.map((e, i) => {
        this.createLine(e, 2000, 3);
      })

       ysc.addCircleRipple(viewer,{ 
        // id:"111",
        lon:118.29875405535397,
        lat:34.967412733816055,
        height:2,
        maxR:100,
        minR:0,
        deviationR:1,
        eachInterval:1000,
        imageUrl:"img/CesiumItem/redCircle2.png"
      });
      ysc.addCircleRipple(viewer,{ 
        // id:"222",
        lon:118.29503358214413,
        lat:34.96683102502867,
        height:2,
        maxR:100,
        minR:0,
        deviationR:1,
        eachInterval:1000,
        imageUrl:"img/CesiumItem/redCircle2.png"
      });
    },

    // 返回初始视角
    flyToStartCamera() {
      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          118.29985832144117,
          34.96550688230607,
          100
        ), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(-40), // 方向
          pitch: Cesium.Math.toRadians(-20), // 倾斜角度
          roll: 0
        }
      });
    },
    // 生成模型
    createModel(
      fristTime, // 开始时间 obj {year, mounth, day, hour}
      intervalTime, //间隔时间 Number
      dropNum, // 点数量 Number
      speed, // 速度 Number
      positionInfo, //坐标信息 Array [{lon,lat,height},{...},...]
      scale, // 模型大小 Number
      modelUrl, // 模型路径 String
      showLabel, // 是否显示label
      labelContent // label内容
    ) {
      let tempDateInfo = {};
      let tempDateInfoKey = [];
      let tempPosInfo = {};
      for (let i = 0; i < dropNum; i++) {
        if (i == 0) {
          tempDateInfo[`t${i}`] = Cesium.JulianDate.fromDate(
            new Date(
              fristTime.year,
              fristTime.mounth,
              fristTime.day,
              fristTime.hour
            )
          );
        } else {
          tempDateInfo[`t${i}`] = Cesium.JulianDate.addSeconds(
            tempDateInfo[`t${i - 1}`],
            intervalTime,
            new Cesium.JulianDate()
          );
        }
        tempPosInfo[`pos${i}`] = Cesium.Cartesian3.fromDegrees(
          positionInfo[i].lon,
          positionInfo[i].lat,
          positionInfo[i].height
        );
      }
      for (let key in tempDateInfo) {
        tempDateInfoKey.push(key);
      }
      // console.log(tempDateInfoKey);
      // console.log(tempDateInfo[tempDateInfoKey[0]]);
      viewer.clock.startTime = tempDateInfo[tempDateInfoKey[0]].clone();
      viewer.clock.stopTime = tempDateInfo[
        tempDateInfoKey[tempDateInfoKey.length - 1]
      ].clone();
      viewer.clock.currentTime = tempDateInfo[tempDateInfoKey[0]].clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      viewer.clock.multiplier = speed;
      viewer.clock.shouldAnimate = true;

      // // 设置时间线焦点
      // // viewer.timeline.zoomTo(st, et);

      let position = new Cesium.SampledPositionProperty();

      tempDateInfoKey.map((e, i) => {
        position.addSample(tempDateInfo[`t${i}`], tempPosInfo[`pos${i}`]);
      });

      let tempWayList = [];
      for (let i = 0; i < tempDateInfoKey.length - 1; i++) {
        let tempObj = new Cesium.TimeInterval({
          start: tempDateInfo[`t${i}`],
          stop: tempDateInfo[`t${i + 1}`]
        });
        // console.log(tempObj);
        tempWayList.push(tempObj);
      }

      let entity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection(tempWayList),
        model: {
          uri: modelUrl,
          minimumPixelSize: 0,
          maximumScale: 64,
          scale: scale
        },
        label: {
          show: showLabel,
          text: labelContent,
          font: "10pt monospace",
          showBackground: true,
          backgroundColor: new Cesium.Color(0, 0.45, 0.6, 0.6),
          pixelOffset: new Cesium.Cartesian2(0.0, -45.0)
        },
        viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position)
      });
      // entity.label.text._value = "qwertyui";
    },

    // 生成线路
    createLine(
      lineInfo, // 路线
      speed, // 速度
      width // 宽度
      ){
      
      function PolylineTrailLinkMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = new Date().getTime();
      }
      Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
        isConstant: {
          get: function() {
            return false;
          }
        },
        definitionChanged: {
          get: function() {
            return this._definitionChanged;
          }
        },
        color: Cesium.createPropertyDescriptor("color")
      });
      PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
        return "PolylineTrailLink";
      };
      PolylineTrailLinkMaterialProperty.prototype.getValue = function(
        time,
        result
      ) {
        if (!Cesium.defined(result)) {
          result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(
          this._color,
          time,
          Cesium.Color.WHITE,
          result.color
        );
        result.image = Cesium.Material.PolylineTrailLinkImage;
        result.time =
          ((new Date().getTime() - this._time) % this.duration) / this.duration;
        return result;
      };
      PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
        return (
          this === other ||
          (other instanceof PolylineTrailLinkMaterialProperty &&
            Property.equals(this._color, other._color))
        );
      };
      Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
      Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
      Cesium.Material.PolylineTrailLinkImage = "img/CesiumItem/colors1.png";
      Cesium.Material.PolylineTrailLinkSource =
        "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
          {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
              vec2 st = materialInput.st;\n\
              vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
              material.alpha = colorImage.a * color.a;\n\
              material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
              return material;\n\
          }";
      Cesium.Material._materialCache.addMaterial(
        Cesium.Material.PolylineTrailLinkType,
        {
          fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
              color: new Cesium.Color(1, 0, 0, 0.5),
              image: Cesium.Material.PolylineTrailLinkImage,
              time: 0
            },
            source: Cesium.Material.PolylineTrailLinkSource
          },
          translucent: function(material) {
            return true;
          }
        }
      );

        viewer.entities.add({
          name: "yscNoNeedEntity",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(lineInfo),
            width: width,
            clampToGround: false, //贴地
            material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.BLUE, speed) //混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
          }
        });
    },
    // 消防演习视角切换
    cameraToFireHelp(){

    }
  },
  watch: {
    buildInfoBoxFlag() {
      if (!this.buildInfoBoxFlag && this.currentNavType == "build") {
        this.flyToStartCamera();
      }
    }
  }
};
</script>

<style scope>
#cesiumContainer {
  width: 100%;
  height: 100vh;
}
.home {
  width: 100%;
  height: 100vh;
  position: relative;
}
.homeNav {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.homeNavUl {
  width: 50%;
  height: 60px;
  margin: 0 auto;
  background-color: #1e8ec7;
  display: flex;
  justify-content: space-around;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.homeNavUl li {
  position: relative;
  top: -40px;
  cursor: pointer;
}

.navFristIcon img {
  width: 33px;
  height: 33px;
  margin-top: 15px;
}
.homeNavUlIcon {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background-color: white;
  border-radius: 50%;
  text-align: center;
  border: 1px solid #1e8ec7;
  margin-bottom: 8px;
}
.homeNavUlIcon img {
  margin-top: 13px;
}
.homeNavUl li p {
  color: white;
}

/* 左上建筑信息 */
.buildInfoBox {
  position: absolute;
  top: 25px;
  left: 25px;
  width: 450px;
  height: 200px;
  border-radius: 10px;
  /* border: 1px solid white; */
  background-color: rgba(69, 159, 204, 0.502);
  display: flex;
  justify-content: space-between;
  padding: 18px;
  padding-top: 40px;
  box-sizing: border-box;
  transition: 1s;
}
.buildInfoBoxTitle {
  padding: 7px 18px 0;
  width: 100%;
  box-sizing: border-box;
  font-size: 20px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}
.buildInfoBoxTitle span:nth-child(2) {
  cursor: pointer;
}
/* .buildInfoBoxText{
}
.buildInfoBoxText li{
} */
.buildInfoBoxText li p {
  text-align: left;
  color: white;
  line-height: 32px;
}
.buildInfoBoxImg {
  width: 50%;
}
.buildInfoBoxImg img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.teaInSchool {
  position: absolute;
  top: 5vh;
  right: 5vw;
}
.teaInSchool ul li {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  width: 20vw;
  height: 10vh;
  border-radius: 0.5vw;
  color: white;
  background-color: #1e8ec790;
}
</style>
