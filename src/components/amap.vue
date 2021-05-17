<template>
  <div id="amap-container">
    <!--        <span>考勤范围（半径）:</span>-->
    <!--        <el-input-->
    <!--                v-model="newscope"-->
    <!--                leabel="考勤范围（半径）"-->
    <!--                class="input-with1"-->
    <!--                type="number"-->
    <!--                placeholder="请输入考勤范围（半径 m）"/>-->
    <el-row class="margin-top-10 address">
      当前地址是： {{ formattedAddress }}
      <el-button size="small" type="primary" @click="handelSave"
        >使用该地址</el-button
      >
    </el-row>
    <el-input
      id="search-input"
      v-model="searchValue"
      class="input-with"
      placeholder="请输入您要查找的考勤点"
      clearable
      @keyup.native.enter="handelSearch"
    >
      <el-button slot="append" size="small" type="primary" @click="handelSearch"
        >检索</el-button
      >
    </el-input>
    <div id="searchResultPanel" />

    <div id="custom-amap" />
  </div>
</template>

<script>
import { remoteLoad } from "@/utils/utils";

export default {
  name: "AMap",
  props: {
    defaultValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      newscope: "",
      defaultCity: "北京",
      // 地图对象
      map: null,
      // 定位默认地址 | 搜索后选择的地址
      formattedAddress: null,
      // 地址对应的经纬度信息
      position: {},
      // 检索关键字
      searchValue: "",
      // 检索函数对象
      placeSearch: null,
      // 检索结果数据数据
      searchInfoList: [],
      // 地图标记
      marker: "",
      // 地址解析（正向）
      geocoder: "",
      // 地址名称
      name: "",
      circle: "",
      circles: [],
    };
  },
  watch: {
    defaultValue() {
      this.searchValue = this.defaultValue;
    },
  },
  created() {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      // 载入高德地图和UI组件
      Promise.all([
        remoteLoad(
          "https://webapi.amap.com/maps?v=1.3&key=" +
            "c7238a31cd7d4ced13c7ecfbb72f5589"
        ),
        remoteLoad("https://webapi.amap.com/ui/1.0/main.js"),
      ]).then(() => {
        this.initMap();
      });
    }
  },

  mounted() {
    // 初始化地图页面
    // this.initMap();
  },
  beforeDestroy() {
    // 销毁地图
    this.map.destroy();
  },
  methods: {
    //   初始化地图页面
    initMap() {
      this.map = new AMap.Map("custom-amap", {
        resizeEnable: true,

        zoom: 30,
      });
      // 添加工具栏
      this.map.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.OverView"], () => {
        // 工具条
        const toolbar = new AMap.ToolBar();
        // 比例尺
        const scale = new AMap.Scale();
        // 显示鹰眼
        const overView = new AMap.OverView();
        this.map.addControl(toolbar);
        this.map.addControl(scale);
        this.map.addControl(overView);
      });
      // 添加maker
      this.setMaker();
      // 添加鼠标点选地图选择地址
      this.addAmapGeocoder();
      // 添加定位
      this.addAMapGeolocation();
      // 添加检索提示
      this.addAMapAutocompletePlaceSearch();
    },
    // 添加maker
    setMaker() {
      this.marker = new AMap.Marker();
      this.map.add(this.marker);
      // 添加解析地理位置插件
      this.map.plugin("AMap.Geocoder", () => {
        // 异步加载插件
        this.geocoder = new AMap.Geocoder({
          city: this.defaultCity, // 默认：“全国”
          radius: 1000, // 范围，默认：500
        });
      });
    },
    // 添加鼠标点选地图选择地址
    addAmapGeocoder() {
      // 添加maker
      this.setMaker();
      // 地图添加点击事件
      this.map.on("click", (e) => {
        const lnglat = [e.lnglat.lng, e.lnglat.lat];
        console.log(111, lnglat);

        this.marker.setPosition(lnglat);
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            const res = result.regeocode;
            const data = {
              // 地址名称
              adress: res.formattedAddress,
              // 纬度lat
              lat: lnglat[1],
              // 经度lng
              lng: lnglat[0],
            };
            this.formattedAddress = res.formattedAddress;
            this.position = data;
            this.name = res.formattedAddress;
            console.log(111, this.name);
          } else {
            // alert(JSON.stringify(result));
          }
        });
      });
    },
    // 添加自动定位
    addAMapGeolocation() {
      this.map.plugin("AMap.Geolocation", () => {
        const geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(200, 200),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });
        // 获取当前位置
        geolocation.getCurrentPosition();
        // 添加定位当前城市成功监听
        AMap.event.addListener(
          geolocation,
          "complete",
          this.onCurrentPositionComplete
        );
        // 添加定位当前城市发生错误监听
        AMap.event.addListener(
          geolocation,
          "error",
          this.onCurrentPositionError
        );
      });
    },
    // 添加检索提示检索
    addAMapAutocompletePlaceSearch() {
      // 自动提示
      this.map.plugin("AMap.Autocomplete", () => {
        const auto = new AMap.Autocomplete({
          city: this.defaultCity,
          input: "search-input",
        });
        // 添加检索监听
        AMap.event.addListener(auto, "select", this.onSelectAutocomplete);
      });
      // 检索服务
      AMap.service(["AMap.PlaceSearch"], () => {
        // 构造地点查询类
        this.placeSearch = new AMap.PlaceSearch({
          type: "", // 兴趣点类别
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: this.defaultCity, // 兴趣点城市
          citylimit: false, // 是否强制限制在设置的城市内搜索
          map: this.map, // 展现结果的地图实例
          panel: "searchResultPanel", // 结果列表将在此容器中进行展示。
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
      });
      // 添加检索监听
      AMap.event.addListener(
        this.placeSearch,
        "listElementClick",
        this.onSelectSearch
      );
    },
    // 定位当前城市成功回调
    onCurrentPositionComplete(res) {
      // 添加maker
      const lnglat = [res.position.lng, res.position.lat];
      this.marker.setPosition(lnglat);
      this.map.setZoomAndCenter(14, lnglat);
      console.log(res, "res");
      this.formattedAddress = res.formattedAddress;
      this.name = res.formattedAddress;
      this.position = res.position;
      this.setMaker();
      console.log("定位", res.position);
    },
    // 定位当前城市发生错误回调
    onCurrentPositionError(err) {
      console.log(1111111111111, err);
    },
    // 按钮触发检索
    handelSearch() {
      this.placeSearch.search(this.searchValue, (status, info) => {
        this.searchInfoList = info.poiList.pois;
      });
    },
    // 选择自动提示数据事件回调
    onSelectAutocomplete(e) {
      this.searchValue = e.poi.name;
      this.handelSearch();
    },
    // 选择检索数据结果事件回调
    onSelectSearch(e) {
      const res = e.data;
      this.formattedAddress = res.cityname + res.adname + res.address;
      this.name = res.name;
      this.position = res.location;
    },
    // 清除input里的值，清除搜索结果，再次初始化map
    // handelclearInput() {
    //     document.querySelector('#searchResultPanel').innerHTML = '';
    // },
    // 保存当前选择的地址,分发事件
    handelSave() {
      // if(this.newscope==''){
      //     this.$message.error('请输入考勤范围值');
      //     return false
      // }
      this.searchValue = this.formattedAddress;
      const { lat, lng } = this.position;
      let scope = this.newscope;
      let ln = Number(lng);
      let la = Number(lat);
      this.map.add(this.circle);
      let id = this.circle._amap_id;
      console.log("11111id", this.circle._amap_id);
      const data = {
        name: this.name,
        // 地址名称
        address: this.formattedAddress,
        // 纬度lat
        lat,
        // 经度lng
        lng,
        // 圆半径
        scope,
        // 覆盖物id
        id,
      };
      this.$emit("getPosition", data);
    },
    detecircle(id) {
      console.log(222, id, this.circle);
      console.log(333, this.map);
      this.map.remove(this.circle);
    },
  },
};
</script>

<style lang="less">
#amap-container {
  width: 80%;
  margin-left: 10%;
  overflow: hidden;
  .el-input__clear {
    line-height: 34px;
    // top: 20px;
    width: 100%;
  }
  #custom-amap {
    height: 50vh;
    width: 100%;
    margin-top: 10px;
    border: 1px solid #ccc;
  }
  .input-with {
    // position: fixed;
    // top: 40px;
    z-index: 1;
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .input-with1 {
    // position: fixed;
    // top: 40px;
    z-index: 1;
    width: 300px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .address {
    color: #373737;
  }
  #searchResultPanel {
    max-height: 100px;
    overflow: auto;
  }
}
.amap-sug-result {
  z-index: 99999;
}
</style>
