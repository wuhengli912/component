<!--
参数
content:[string](undefined),//按钮显示的文字
multiple: [vool](false),//是否可以多选
accept:[string](''),//限制文件的类型 如 .png,.jpeg 等等
 -->
<template>
  <div class="_import_file">
    <p class="_file_btn" @click.stop="triggerInput">
      <input
        class="_file_input"
        ref="file"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="selectFile"
      />
      <span class="el-icon-document-add"></span>
      <span>{{ contentView }}</span>
    </p>
    <!-- <p class="_file_text"> .xls,.xlsx -->
    <span class="_file_name" v-for="(name, index) in nameList" :key="index">
      {{ name }}
    </span>
    <!-- </p> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      LS: "basicComponents.theUploadFile.",
      nameList: [],
    };
  },
  props: {
    multiple: { default: false },
    accept: { default: "" },
    content: { default: undefined },
  },
  methods: {
    triggerInput() {
      $(this.$refs.file).trigger("click");
    },
    selectFile(e) {
      let files = e.target.files;
      this.nameList = [];
      for (let prop of files) {
        this.nameList.push(prop.name);
      }
      this.$emit("selectback", files);
    },
  },
  computed: {
    contentView() {
      if (this.content === undefined) {
        return this.$(this.LS + "btnText");
      } else {
        return this.content;
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
._import_file {
  position: relative;
  width: 100%;
  font-size: 0;
  > ._file_btn {
    position: relative;
    background-color: rgb(56, 80, 111);
    display: inline-block;
    vertical-align: middle;
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    margin-right: 8px;
    cursor: pointer;
    > ._file_input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  > ._file_name {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    height: 24px;
    max-width: 160px;
    background-color: rgba(56, 80, 111, 0.3);
    color: rgba(255, 255, 255, 0.7);
    margin-top: 6px;
    margin-right: 8px;
    border-radius: 2px;
    line-height: 24px;
    padding: 0 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>