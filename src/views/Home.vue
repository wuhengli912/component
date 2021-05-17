<template>
  <div class="home">
    <dragSlideValidate
      @isvalidate="isvalidate"
      width="580px"
      height="90px"
      slidebgcolor="skyblue"
    />
    <!-- <my-dialog :visible="true" width="800px" height="500px"></my-dialog> -->
    <!-- <div @click="download">下载get</div>
    <div @click="downloadPost">下载post</div> -->
    <!-- 地图定位 -->
    <!-- <amap></amap> -->
    <test></test>
    <!-- <the-upload-file></the-upload-file> -->
  </div>
</template>

<script>
// @ is an alias to /src

import dragSlideValidate from "@/components/dragSlideValidate";
import dialog from "@/components/dialog";
import amap from "@/components/amap";
import test from "@/components/test";
import { autoDownloadGet, autoDownloadPost } from "@/utils/utils";
import TheUploadFile from "../components/theUploadFile.vue";
export default {
  name: "Home",
  data() {
    return {
      slidestatus: false,
      radio: "1",
    };
  },
  components: {
    dragSlideValidate,
    myDialog: dialog,
    amap,
    test,
    TheUploadFile,
  },
  created() {
    console.log("当前的环境是", process.env);
  },
  methods: {
    isvalidate(val) {
      this.slidestatus = val;
      console.log(this.slidestatus);
    },
    download() {
      autoDownloadGet(
        "http://qiniutest.brc-beei.com/项目2-2-20210409095210评估报告.docx",
        "word"
      );
    },
    downloadPost() {
      autoDownloadPost(
        "http://39.108.214.183:9803/api/LaborProjectLogNo/Export",
        { ids: 1095 }
      );
    },
  },
};
</script>
