<template>
  <div id="cesiumContainer"></div>
</template>

<script>
var viewer = null;
var tileset = null;
var handler = null;
export default {
  data() {
    return {};
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
        infoBox: false, // [ Bool, 是否显示点击要素之后显示的信息 ]
        requestRenderMode: true, // [ Bool, 启用请求渲染模式 ]
        scene3DOnly: false, // [ Bool, 每个几何实例将只能以3D渲染以节省GPU内存 ]
        sceneModePicker: false, // [ Bool, 是否显示场景切换控件 ]
        sceneMode: 3, // [ Number,初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode ]
        fullscreenElement: document.body // [ Object, 全屏时渲染的HTML元素 ]
      });

      // 清除默认的第一个影像 bing地图影像
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
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
      label.brightness = 0.8;

      viewer.scene.undergroundMode = false; // [ Bool , 设置开启地下场景 ]
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0; // [ Number ,设置相机最小缩放距离,距离地表n米 ]
      viewer.scene.terrainProvider.isCreateSkirt = false; // [ Bool , 关闭裙边 ]
      viewer.scene.globe.enableLighting = true; // [ Bool , 是否添加全球光照，scene(场景)中的光照将会随着每天时间的变化而变化 ]
      viewer.scene.globe.showGroundAtmosphere = true; // [ Bool , 是否关闭大气效果 ]
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

      this.queryPointLatLon();
    },
    // 调整模型位置
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

        viewer.zoomTo(tileset);
      });
    },
    // 获取楼坐标
    queryPointLatLon() {
      // 绑定事件实例
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      let resultArr = [];
      // 鼠标左键
      handler.setInputAction(event => {
        console.log(viewer.scene.pickPosition(event.position));

        var earthPosition = viewer.scene.pickPosition(event.position);

        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartographic = ellipsoid.cartesianToCartographic(earthPosition);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        let resultStr = "[";
        // let resultStr = "[";
        let tempObj = {
          lng,
          lat,
          height: alt
        };
        resultArr.push(tempObj);

        // 模型路径
        resultArr.map((e, i) => {
          if (i == resultArr.length - 1) {
            resultStr += `{lon: ${e.lng},lat: ${e.lat},height: ${e.height}}]`;
          } else {
            resultStr += `{lon: ${e.lng},lat: ${e.lat},height: ${e.height}},`;
          }
        });

        // 路线路径
        // resultArr.map((e, i) => {
        //   if (i == resultArr.length - 1) {
        //     resultStr += `${e.lng},${e.lat},6]`;
        //   } else {
        //     resultStr += `${e.lng},${e.lat},6,`;
        //   }
        // });
        // resultStr = `[${resultStr}]`
        console.log(resultStr);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
  background-color: rgb(64, 165, 160);
}
</style>
